/**
 * Монтажный лист рилса из пословных таймингов озвучки.
 *
 * Вход:  src/vo-words.json — слова озвучки с метками времени (ElevenLabs Scribe).
 *        С флагом --estimate файл не читается, а тайминги оцениваются по тексту
 *        (черновой монтаж, пока нет озвучки).
 * Выход: src/timeline.json — сцены, слова и субтитры в кадрах. По нему собираются
 *        и картинка (src/), и звук (scripts/make-audio.mjs).
 *
 * Слова расшифровки выравниваются со сценарием (scripts/script.mjs), поэтому номера слов
 * в сценах не зависят от того, как Scribe записал «Claude» или «Клод».
 *
 * Запуск: node scripts/timeline.mjs [--estimate]
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCRIPT_WORDS } from "./script.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, "../src");
const FPS = 30;
const OFFSET = 0.35; // голос вступает чуть позже первого удара
const TAIL = 2.6; // финальный кадр и затухание

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]/g, "")
    .replace(/^claude$/, "клод")
    .replace(/^code$/, "код")
    .replace(/^github$/, "гитхаб");

/** Оценка таймингов по тексту: для чернового монтажа до озвучки. */
function estimate() {
  let t = 0;
  let para = 0;
  return SCRIPT_WORDS.map((w) => {
    if (w.para !== para) {
      t += 0.3;
      para = w.para;
    }
    const d = 0.1 + 0.062 * w.text.length;
    const word = { text: w.text, start: t, end: t + d };
    t += d + (/[.?!]$/.test(w.text) ? 0.42 : /[,»]$/.test(w.text) ? 0.2 : 0.06);
    return word;
  });
}

/** Выравнивание расшифровки со сценарием (редакционное расстояние), пропуски — интерполяцией. */
function align(spoken) {
  const a = SCRIPT_WORDS.map((w) => norm(w.text));
  const b = spoken.map((w) => norm(w.text));
  const n = a.length;
  const m = b.length;
  const D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), D[i - 1][j] + 1, D[i][j - 1] + 1);
  const map = new Array(n).fill(null);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (D[i][j] === D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      map[i - 1] = spoken[j - 1];
      i--;
      j--;
    } else if (D[i][j] === D[i - 1][j] + 1) i--;
    else j--;
  }
  const out = SCRIPT_WORDS.map((w, k) => (map[k] ? { text: w.text, start: map[k].start, end: map[k].end } : null));
  for (let k = 0; k < n; k++) {
    if (out[k]) continue;
    const prev = out.slice(0, k).reverse().find(Boolean);
    let nk = k;
    while (nk < n && !out[nk]) nk++;
    const t0 = prev ? prev.end : 0;
    const t1 = nk < n ? out[nk].start : t0 + 0.4 * (nk - k);
    const step = (t1 - t0) / (nk - k + 1);
    for (let q = k; q < nk; q++) out[q] = { text: SCRIPT_WORDS[q].text, start: t0 + step * (q - k + 0.5) - step * 0.4, end: t0 + step * (q - k + 0.5) + step * 0.4 };
    console.warn(`  слова ${k}–${nk - 1} не найдены в расшифровке, тайминги интерполированы`);
  }
  return out;
}

const estimated = process.argv.includes("--estimate");
const words = estimated
  ? estimate()
  : align(JSON.parse(readFileSync(path.join(dir, "vo-words.json"), "utf8")).words.filter((w) => (w.type ?? "word") === "word" && w.text.trim() !== "—"));

const f = (t) => Math.round((t + OFFSET) * FPS);

const SCENES = [
  { id: "hook", title: "01 — VS", from: 0 },
  { id: "chat", title: "02 — ЧАТ", from: 13 },
  { id: "turn", title: "03 — ПОВОРОТ", from: 28 },
  { id: "project", title: "04 — ПРОЕКТ", from: 35 },
  { id: "terminal", title: "05 — ТЕРМИНАЛ", from: 50 },
  { id: "ship", title: "06 — ДЕПЛОЙ", from: 62 },
  { id: "cloud", title: "07 — ОБЛАКО", from: 73 },
  { id: "summary", title: "08 — ИТОГ", from: 88 },
  { id: "cta", title: "09 — КОММЕНТАРИЙ", from: 95 },
];

const duration = Math.round((words[words.length - 1].end + OFFSET + TAIL) * FPS);
const scenes = SCENES.map((s, i) => ({ ...s, start: i === 0 ? 0 : Math.round((words[s.from].start + OFFSET - 0.1) * FPS) })).map((s, i, all) => ({
  ...s,
  end: i < all.length - 1 ? all[i + 1].start : duration,
}));

const wordFrames = words.map((w, i) => ({ i, text: w.text, start: f(w.start), end: f(w.end) }));

// Субтитры: фразы по 1–4 слова (номер первого слова фразы), границы — по смыслу.
const CHUNK_STARTS = [0, 4, 7, 10, 13, 15, 18, 20, 22, 24, 28, 31, 33, 35, 37, 40, 43, 46, 50, 52, 54, 56, 58, 62, 65, 68, 71, 73, 76, 79, 81, 84, 87, 88, 90, 92, 95, 98, 101, 103, 106];
// Где те же слова уже крупно в кадре — субтитры не дублируют их.
const HIDDEN = new Set([0, 1, 2, 3, 33, 34, 88, 89, 90, 91, 92, 93, 94, 101, 102]);
// Бренды на экране — оригинальным написанием (в озвучке — фонетически).
const DISPLAY = { 0: "Claude", 2: "Claude", 3: "Code", 14: "Claude", 29: "Claude", 30: "Code", 67: "GitHub", 90: "Claude", 91: "Code" };
const shown = (i) => DISPLAY[i] ?? words[i].text;

const captions = CHUNK_STARTS.map((from, k) => {
  const to = k < CHUNK_STARTS.length - 1 ? CHUNK_STARTS[k + 1] : words.length;
  const ids = Array.from({ length: to - from }, (_, q) => from + q);
  const nextStart = k < CHUNK_STARTS.length - 1 ? f(words[CHUNK_STARTS[k + 1]].start) - 2 : duration;
  return {
    start: f(words[from].start) - 2,
    end: Math.min(nextStart, f(words[to - 1].end) + 18),
    hidden: ids.every((i) => HIDDEN.has(i)),
    words: ids.map((i) => ({ text: shown(i), start: f(words[i].start), end: f(words[i].end) })),
  };
});

const out = { fps: FPS, width: 1080, height: 1920, offset: OFFSET, estimated, duration, scenes, words: wordFrames, captions };
writeFileSync(path.join(dir, "timeline.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`Ролик: ${(duration / FPS).toFixed(2)} с, ${scenes.length} сцен, ${captions.length} фраз субтитров${estimated ? " (тайминги — оценка)" : ""}`);
for (const s of scenes) console.log(`  ${s.title.padEnd(20)} ${(s.start / FPS).toFixed(2)}–${(s.end / FPS).toFixed(2)} с`);
