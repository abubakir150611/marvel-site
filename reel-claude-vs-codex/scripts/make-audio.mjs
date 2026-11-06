/**
 * Звуковая дорожка вертикального ролика: оригинальный бит 120 уд/мин (синтезируется кодом,
 * без чужих записей и сэмплов), звуковые эффекты на монтажных событиях и озвучка.
 *
 * Все времена берутся из src/timeline.json — того же монтажного листа, по которому
 * собраны сцены: удары совпадают с «врезками» слов, свисты — со сменой цветовых полей.
 * Озвучка (public/reel/voiceover.mp3, ElevenLabs) ставится со сдвигом timeline.offset,
 * музыка под голосом приглушается автоматически (следящая огибающая, около −8 дБ).
 *
 * Запуск: node scripts/make-audio.mjs
 * Результат: public/reel/reel-audio.m4a (AAC 192 кбит/с, −14 LUFS, пики ≤ −1,5 dBTP).
 * Требуется ffmpeg в PATH.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import timeline from "../src/timeline.json" with { type: "json" };

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.resolve(here, "../public/reel");
const tmpDir = path.resolve(here, "../tmp");
mkdirSync(tmpDir, { recursive: true });

const SR = 48000;
const FPS = timeline.fps;
const DUR = timeline.duration / FPS;
const N = Math.ceil(DUR * SR);
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;
const TAU = Math.PI * 2;

// ---------- монтажные события (секунды) ----------
const sc = Object.fromEntries(timeline.scenes.map((s) => [s.id, { start: s.start / FPS, end: s.end / FPS }]));
const w = (i) => timeline.words[i].start / FPS;
const fr = (f) => f / FPS;

// Детерминированный шум — каждый запуск даёт одинаковый звук.
let seed = 90417;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;

const stereo = () => [new Float32Array(N), new Float32Array(N)];
const music = stereo(); // бит, бас, гармония — приглушается под голосом
const sfx = stereo(); // удары, свисты, щелчки — приглушаются слабее
const send = stereo(); // шина реверберации
const idx = (t) => Math.round(t * SR);
const pan = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)];
function add(bus, i, l, r, rev = 0) {
  if (i < 0 || i >= N) return;
  bus[0][i] += l;
  bus[1][i] += r;
  if (rev) {
    send[0][i] += l * rev;
    send[1][i] += r * rev;
  }
}

const NOTE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const hz = (name) => {
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  return 440 * 2 ** ((12 * (Number(m[2]) + 1) + NOTE[m[1]] - 69) / 12);
};

// ---------- инструменты ----------
function kick(t0, amp) {
  const s = idx(t0);
  let ph = 0;
  for (let k = 0; k < 0.42 * SR; k++) {
    const t = k / SR;
    ph += (48 + 120 * Math.exp(-t * 30)) / SR;
    const env = Math.exp(-t * 8) * (1 - Math.exp(-t * 600));
    const v = Math.tanh(1.6 * Math.sin(TAU * ph)) * env + (k < 120 ? noise() * 0.2 * (1 - k / 120) : 0);
    add(music, s + k, v * amp, v * amp, 0.02);
  }
}
function clap(t0, amp) {
  const s = idx(t0);
  let lp = 0;
  for (let k = 0; k < 0.22 * SR; k++) {
    const t = k / SR;
    // три быстрых «хлопка» и хвост
    const burst = [0, 0.011, 0.022].reduce((a, d) => a + (t >= d ? Math.exp(-(t - d) * 180) : 0), 0) + Math.exp(-t * 22) * 0.5;
    const n = noise();
    lp += 0.45 * (n - lp);
    const v = (n - lp * 0.6) * burst;
    add(music, s + k, v * amp * 0.9, v * amp, 0.25);
  }
}
function hat(t0, amp, p = 0, open = false) {
  const s = idx(t0);
  const [gl, gr] = pan(p);
  let lp = 0;
  for (let k = 0; k < (open ? 0.2 : 0.05) * SR; k++) {
    const t = k / SR;
    const n = noise();
    lp += 0.3 * (n - lp);
    const v = (n - lp) * Math.exp(-t * (open ? 18 : 90));
    add(music, s + k, v * amp * gl, v * amp * gr, 0.05);
  }
}
/** Бас: пила с фильтром, короткая атака — слышен и на телефоне. */
function bass(name, t0, dur, amp) {
  const f = hz(name);
  const s = idx(t0);
  let lp = 0;
  for (let k = 0; k < (dur + 0.06) * SR; k++) {
    const t = k / SR;
    const ph = (f * t) % 1;
    const saw = 2 * ph - 1;
    lp += 0.06 * (saw - lp);
    const env = Math.min(1, t / 0.005) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.06) : 1) * (0.75 + 0.25 * Math.exp(-t * 6));
    const v = (lp * 0.8 + Math.sin(TAU * f * t) * 0.6) * env * amp;
    add(music, s + k, v, v, 0);
  }
}
/** Щипковый синт (Karplus–Strong) для арпеджио. */
function pluck(name, t0, amp, p = 0, length = 0.9) {
  const f = hz(name);
  const period = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(period);
  for (let i = 0; i < period; i++) buf[i] = noise();
  const [gl, gr] = pan(p);
  const s = idx(t0);
  let q = 0;
  const total = Math.round(length * SR);
  for (let k = 0; k < total; k++) {
    const cur = buf[q];
    buf[q] = (cur + buf[(q + 1) % period]) * 0.5 * 0.994;
    q = (q + 1) % period;
    const fade = k > total - 1500 ? (total - k) / 1500 : 1;
    add(music, s + k, cur * amp * gl * fade, cur * amp * gr * fade, 0.3);
  }
}
/** Пэд: три расстроенных пилы с мягкой атакой. */
function padChord(notes, t0, t1, amp, attack = 0.6, release = 1.2) {
  for (const name of notes) {
    const f = hz(name);
    const det = [-7, 0, 6].map((c) => f * 2 ** (c / 1200));
    const s = idx(t0);
    const e = idx(t1 + release);
    let lp = 0;
    for (let i = s; i < e && i < N; i++) {
      const t = i / SR - t0;
      let env = Math.min(1, t / attack);
      env *= env;
      if (t > t1 - t0) env *= Math.max(0, 1 - (t - (t1 - t0)) / release) ** 2;
      let v = 0;
      for (const d of det) v += 2 * ((d * t) % 1) - 1;
      lp += 0.035 * (v / 3 - lp);
      add(music, i, lp * amp * env, lp * amp * env * 0.96, 0.5);
    }
  }
}
/** Короткий удар для «врезки» слова: суббас + шумовой хлопок. */
function punch(t0, amp) {
  const s = idx(t0);
  let ph = 0;
  let lp = 0;
  for (let k = 0; k < 0.7 * SR; k++) {
    const t = k / SR;
    ph += (40 + 90 * Math.exp(-t * 18)) / SR;
    const sub = Math.sin(TAU * ph) * Math.exp(-t * 5) * (1 - Math.exp(-t * 900));
    const n = noise();
    lp += 0.12 * (n - lp);
    const body = lp * 2.2 * Math.exp(-t * 16);
    const v = (sub * 0.9 + body) * amp;
    add(sfx, s + k, v, v, 0.3);
  }
}
/** Большой импакт с длинным хвостом — на появлении знака. */
function impact(t0, amp) {
  const s = idx(t0);
  let ph = 0;
  let lp = 0;
  let lp2 = 0;
  for (let k = 0; k < 2.6 * SR; k++) {
    const t = k / SR;
    ph += (38 + 34 * Math.exp(-t * 2)) / SR;
    const sub = Math.sin(TAU * ph) * Math.exp(-t * 1.6) * (1 - Math.exp(-t * 400));
    const n = noise();
    lp += 0.05 * (n - lp);
    lp2 += 0.25 * (n - lp2);
    const v = (sub * 0.8 + lp * 3 * Math.exp(-t * 5) + (n - lp2) * 0.1 * Math.exp(-t * 3)) * amp;
    add(sfx, s + k, v, v, 0.55);
  }
}
/** Свист: полосовой фильтр по шуму с движением по панораме. */
function sweep(t0, dur, f0, f1, amp, shape, p0, p1, q = 1.3) {
  const s = idx(t0);
  const total = Math.round(dur * SR);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let k = 0; k < total; k++) {
    const x = k / total;
    const fc = f0 * (f1 / f0) ** x;
    const wv = (TAU * fc) / SR;
    const al = Math.sin(wv) / (2 * q);
    const a0 = 1 + al;
    const n = noise();
    const y = (al / a0) * n - (al / a0) * x2 - ((-2 * Math.cos(wv)) / a0) * y1 - ((1 - al) / a0) * y2;
    x2 = x1;
    x1 = n;
    y2 = y1;
    y1 = y;
    const [gl, gr] = pan(p0 + (p1 - p0) * x);
    const e = shape(x);
    add(sfx, s + k, y * amp * e * gl, y * amp * e * gr, 0.3);
  }
}
const whoosh = (tc, amp, dur = 0.42, dir = 1) => sweep(tc - dur * 0.7, dur, dir > 0 ? 500 : 5000, dir > 0 ? 5000 : 500, amp * 2.4, (x) => Math.sin(Math.PI * x) ** 2, -0.7 * dir, 0.7 * dir);
const riser = (t0, t1, amp) => sweep(t0, t1 - t0, 300, 7000, amp * 2, (x) => x ** 2.4 * (x > 0.97 ? (1 - x) / 0.03 : 1), 0, 0, 1.6);
function tick(t0, amp, pitch = 2200, p = 0) {
  const s = idx(t0);
  const [gl, gr] = pan(p);
  for (let k = 0; k < 0.05 * SR; k++) {
    const t = k / SR;
    const v = Math.sin(TAU * pitch * t) * Math.exp(-t * 110) + 0.5 * Math.sin(TAU * pitch * 1.5 * t) * Math.exp(-t * 160);
    add(sfx, s + k, v * amp * gl, v * amp * gr, 0.12);
  }
}
/** «Поп» наклейки: короткий тон, скользящий вверх. */
function pop(t0, amp, p = 0) {
  const s = idx(t0);
  const [gl, gr] = pan(p);
  let ph = 0;
  for (let k = 0; k < 0.09 * SR; k++) {
    const t = k / SR;
    ph += (500 + 1400 * (1 - Math.exp(-t * 40))) / SR;
    const v = Math.sin(TAU * ph) * Math.exp(-t * 38) * Math.min(1, t / 0.002);
    add(sfx, s + k, v * amp * gl, v * amp * gr, 0.15);
  }
}
function keyClick(t0, amp, p = 0) {
  const s = idx(t0);
  const [gl, gr] = pan(p);
  let lp = 0;
  for (let k = 0; k < 0.025 * SR; k++) {
    const t = k / SR;
    const n = noise();
    lp += 0.5 * (n - lp);
    const v = (lp * 0.7 + Math.sin(TAU * 3200 * t) * 0.4) * Math.exp(-t * 260);
    add(sfx, s + k, v * amp * gl, v * amp * gr, 0.04);
  }
}
function drip(t0, amp, p = 0) {
  const s = idx(t0);
  const [gl, gr] = pan(p);
  let ph = 0;
  for (let k = 0; k < 0.09 * SR; k++) {
    const t = k / SR;
    ph += (600 + 1700 * Math.exp(-t * 28)) / SR;
    const v = Math.sin(TAU * ph) * Math.exp(-t * 40);
    add(sfx, s + k, v * amp * gl, v * amp * gr, 0.35);
  }
}
/** Цифровой «глитч» при смене языка: дробный шум со скачками высоты. */
function glitch(t0, dur, amp) {
  const s = idx(t0);
  let hold = 0;
  let val = 0;
  for (let k = 0; k < dur * SR; k++) {
    if (hold-- <= 0) {
      hold = 20 + Math.floor(rand() * 220);
      val = noise();
    }
    const t = k / SR;
    const gate = Math.sin(TAU * 38 * t) > -0.2 ? 1 : 0.15;
    const v = (val * 0.7 + Math.sign(Math.sin(TAU * (300 + 900 * rand()) * t)) * 0.2) * gate * Math.exp(-t * 6);
    add(sfx, s + k, v * amp, v * amp * 0.9, 0.1);
  }
}

// ---------- музыка ----------
// Гармония по тактам: Am – F – C – G (каждый аккорд — один такт, 2 с).
const PROG = [
  { root: "A1", oct: "A2", pad: ["A3", "C4", "E4", "B4"], arp: ["A4", "C5", "E5", "B4"] },
  { root: "F1", oct: "F2", pad: ["F3", "A3", "C4", "E4"], arp: ["F4", "A4", "C5", "E5"] },
  { root: "C2", oct: "C3", pad: ["G3", "C4", "E4", "D5"], arp: ["G4", "C5", "E5", "D5"] },
  { root: "G1", oct: "G2", pad: ["G3", "B3", "D4", "A4"], arp: ["G4", "B4", "D5", "A4"] },
];
const chordAt = (t) => PROG[Math.floor(t / BAR) % PROG.length];

/** Ударные и бас на отрезке [t0, t1). style: full — полный грув, half — половинный темп, none — только бас. */
function groove(t0, t1, style, level = 1) {
  const step = BEAT / 4; // шестнадцатые
  const first = Math.ceil(t0 / step - 1e-6);
  for (let n = first; n * step < t1 - 1e-6; n++) {
    const t = n * step;
    const pos = n % 16; // положение в такте
    const ch = chordAt(t);
    if (style === "full") {
      if (pos % 4 === 0) kick(t, 0.5 * level);
      if (pos === 4 || pos === 12) clap(t, 0.16 * level);
      if (pos % 2 === 0) hat(t + (pos % 4 === 2 ? 0.012 : 0), (pos % 4 === 2 ? 0.07 : 0.04) * level, pos % 4 === 2 ? 0.3 : -0.3);
      else hat(t + 0.01, 0.018 * level, 0.5);
      if (pos === 14) hat(t, 0.05 * level, 0.2, true);
    } else if (style === "half") {
      if (pos === 0 || pos === 8) kick(t, 0.45 * level);
      if (pos === 8) clap(t, 0.12 * level);
      if (pos % 4 === 2) hat(t, 0.045 * level, 0.3);
    }
    // бас: восьмые с октавным скачком на слабых долях
    if (pos % 2 === 0) {
      const name = pos % 8 === 6 ? ch.oct : ch.root;
      bass(name, t, step * 1.6, (pos % 4 === 0 ? 0.22 : 0.16) * level);
    }
  }
}
function arps(t0, t1, amp) {
  const step = BEAT / 2;
  for (let n = Math.ceil(t0 / step - 1e-6); n * step < t1 - 1e-6; n++) {
    const t = n * step;
    const ch = chordAt(t);
    pluck(ch.arp[n % 4], t, amp, n % 2 ? 0.45 : -0.45);
  }
}
function pads(t0, t1, amp) {
  for (let b = Math.floor(t0 / BAR); b * BAR < t1; b++) {
    const s = Math.max(t0, b * BAR);
    const e = Math.min(t1, (b + 1) * BAR);
    padChord(chordAt(b * BAR).pad, s, e, amp, 0.25, 0.5);
  }
}

const S = sc;
const at = w; // начало слова i, секунды (сдвиг озвучки уже учтён в кадрах)
// 01 хук: сразу полный грув, удар на VS
impact(0.02, 0.55);
groove(0, S.who.start, "full", 0.95);
pads(0, S.who.start, 0.05);
punch(at(2), 0.5);
pop(at(5), 0.12, -0.3);
pop(at(10), 0.12, 0.3);
// 02 кто есть кто: карточки въезжают, чипы «попают»
whoosh(S.who.start, 0.16, 0.38, 1);
groove(S.who.start, S.common.start, "full", 0.85);
arps(S.who.start, S.codex.start, 0.04);
pads(S.who.start, S.codex.start, 0.035);
[at(16), at(20), at(20) + fr(3), at(23), at(27)].forEach((t, k) => pop(t, 0.1, k % 2 ? 0.3 : -0.3));
whoosh(at(22) - fr(4), 0.14, 0.36, -1);
// 03 общее: половинный темп, тик на каждой паре галочек
whoosh(S.common.start, 0.16, 0.38, -1);
groove(S.common.start, S.codex.start, "half", 0.85);
[at(33), at(39), at(41), at(44)].forEach((t, k) => {
  tick(t, 0.06, 1500 + k * 150, -0.2);
  tick(t + fr(3), 0.06, 1800 + k * 150, 0.2);
});
pop(at(44) + fr(6), 0.12, -0.3);
// 04 Codex: тёмное поле, плотный грув, карточки влетают
riser(S.codex.start - 0.8, S.codex.start, 0.1);
impact(S.codex.start, 0.35);
groove(S.codex.start, S.cons.start, "full", 0.9);
arps(S.codex.start, S.cons.start, 0.035);
pads(S.codex.start, S.cons.start, 0.03);
[at(48), at(51), at(56)].forEach((t, k) => whoosh(t, 0.14, 0.34, k % 2 ? -1 : 1));
for (let k = 0; k < 3; k++) tick(at(52) + fr(40 + k * 6), 0.04, 2000, 0.2);
// 05 Claude Code: смена поля, те же «влёты», щелчки чипов
whoosh(S.claude.start, 0.18, 0.4, 1);
impact(S.claude.start, 0.3);
[at(68), at(73), at(80)].forEach((t, k) => whoosh(t, 0.14, 0.34, k % 2 ? 1 : -1));
for (let k = 0; k < 3; k++) tick(at(70) + fr(k * 4), 0.05, 1600 + k * 160, 0.2);
for (let k = 0; k < 5; k++) pop(at(75) + fr(k * 3), 0.07, (k / 4) * 1.2 - 0.6);
// 06 минусы: брейк, удар на «Минусы?», глухие «нет»
whoosh(S.cons.start, 0.16, 0.36, -1);
punch(at(87), 0.5);
padChord(["F2", "C3", "A3", "E4"], S.cons.start, at(97), 0.05, 0.05, 0.3);
padChord(["G2", "D3", "B3", "A4"], at(97), S.price.start, 0.05, 0.05, 0.3);
groove(at(88), S.price.start, "half", 0.75);
[at(90), at(93), at(100), at(104)].forEach((t) => {
  sweep(t, 0.16, 900, 300, 0.12, (x) => Math.sin(Math.PI * x), 0, 0);
  tick(t, 0.04, 700, 0);
});
// 07 цена: грув возвращается, счётчики, удар на «=»
whoosh(S.price.start, 0.18, 0.38, 1);
groove(S.price.start, S.final.start, "full", 0.9);
arps(S.price.start, S.final.start, 0.035);
pads(S.price.start, S.final.start, 0.03);
for (let k = 0; k < 10; k++) tick(at(108) + fr(k * 1.4), 0.035, 1200 + k * 90, -0.2);
punch(at(110), 0.45);
// 08 итог: два «влёта» карточек
whoosh(S.verdict.start, 0.16, 0.36, -1);
whoosh(at(114), 0.14, 0.34, 1);
whoosh(at(121), 0.14, 0.34, -1);
riser(S.final.start - 1.0, S.final.start, 0.12);
// 09 финал: без ударных, клик по переключателю, большой удар на «Claude Code», финальный аккорд
const pick = at(134) - fr(2);
keyClick(pick, 0.24, 0.3);
tick(pick + 0.01, 0.06, 1500, 0.3);
impact(at(134), 0.75);
padChord(["A2", "E3", "A3", "C4", "E4"], S.final.start, DUR, 0.07, 0.3, 1.4);
bass("A1", S.final.start, DUR - S.final.start - 0.3, 0.15);
["E5", "A5", "B5", "E6"].forEach((n, k) => pluck(n, at(134) + 0.2 + k * 0.35, 0.05, k % 2 ? 0.4 : -0.4, 1.4));
pop(at(135) + fr(10), 0.12, -0.3);

// ---------- реверберация ----------
function freeverb([L, R], room = 0.8, damp = 0.35) {
  const scale = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const alls = [556, 441, 341, 225];
  const out = stereo();
  [L, R].forEach((input, c) => {
    const cb = combs.map((d) => ({ buf: new Float32Array(Math.round((d + c * 23) * scale)), p: 0, st: 0 }));
    const ab = alls.map((d) => ({ buf: new Float32Array(Math.round((d + c * 23) * scale)), p: 0 }));
    for (let i = 0; i < N; i++) {
      const x = input[i] * 0.015;
      let s = 0;
      for (const f of cb) {
        const y = f.buf[f.p];
        f.st = y * (1 - damp) + f.st * damp;
        f.buf[f.p] = x + f.st * room;
        f.p = (f.p + 1) % f.buf.length;
        s += y;
      }
      for (const f of ab) {
        const b = f.buf[f.p];
        const y = -s + b;
        f.buf[f.p] = s + b * 0.5;
        f.p = (f.p + 1) % f.buf.length;
        s = y;
      }
      out[c][i] = s;
    }
  });
  return out;
}
const verb = freeverb(send);

// ---------- озвучка ----------
const voRaw = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", path.join(pub, "voiceover.mp3"), "-ac", "2", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
const vo = stereo();
{
  const f = new Float32Array(voRaw.buffer, voRaw.byteOffset, Math.floor(voRaw.length / 4));
  const off = idx(timeline.offset);
  for (let k = 0; k * 2 + 1 < f.length; k++) {
    const i = off + k;
    if (i >= N) break;
    vo[0][i] = f[k * 2];
    vo[1][i] = f[k * 2 + 1];
  }
}
// Огибающая голоса (атака 8 мс, спад 300 мс) → коэффициент приглушения музыки
const duck = new Float32Array(N);
{
  const att = Math.exp(-1 / (0.008 * SR));
  const rel = Math.exp(-1 / (0.3 * SR));
  let env = 0;
  for (let i = 0; i < N; i++) {
    const x = Math.max(Math.abs(vo[0][i]), Math.abs(vo[1][i]));
    env = x > env ? att * env + (1 - att) * x : rel * env + (1 - rel) * x;
    duck[i] = Math.min(1, env / 0.08);
  }
}

// ---------- сведение ----------
const mix = stereo();
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fadeOut = t > DUR - 2.4 ? Math.cos((Math.min(1, (t - (DUR - 2.4)) / 2.3) * Math.PI) / 2) ** 2 : 1;
  const gm = 1 - 0.62 * duck[i]; // ≈ −8 дБ под голосом
  const gs = 1 - 0.3 * duck[i];
  for (let c = 0; c < 2; c++) {
    const bed = Math.tanh((music[c][i] * gm + verb[c][i] * 0.9 * gm + sfx[c][i] * gs) * 1.2) / 1.2;
    const v = (bed * 0.5 + vo[c][i] * 1.0) * fadeOut;
    mix[c][i] = v;
    peak = Math.max(peak, Math.abs(v));
  }
}

/** WAV 32-bit float. */
function writeWav(file, [L, R], g) {
  const data = Buffer.alloc(N * 8);
  for (let i = 0; i < N; i++) {
    data.writeFloatLE(L[i] * g, i * 8);
    data.writeFloatLE(R[i] * g, i * 8 + 4);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(3, 20);
  h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 8, 28);
  h.writeUInt16LE(8, 32);
  h.writeUInt16LE(32, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([h, data]));
}
const raw = path.join(tmpDir, "reel-audio-raw.wav");
writeWav(raw, mix, 0.89 / peak);
// REEL_STEMS=1 — дополнительно сохранить в tmp/ музыку с эффектами и голос по отдельности (для проверки баланса)
if (process.env.REEL_STEMS) {
  const bedOnly = stereo();
  const voOnly = stereo();
  for (let i = 0; i < N; i++) {
    const gm = 1 - 0.62 * duck[i];
    const gs = 1 - 0.3 * duck[i];
    for (let c = 0; c < 2; c++) {
      bedOnly[c][i] = (Math.tanh((music[c][i] * gm + verb[c][i] * 0.9 * gm + sfx[c][i] * gs) * 1.2) / 1.2) * 0.5;
      voOnly[c][i] = vo[c][i];
    }
  }
  writeWav(path.join(tmpDir, "stem-bed.wav"), bedOnly, 0.89 / peak);
  writeWav(path.join(tmpDir, "stem-vo.wav"), voOnly, 0.89 / peak);
}
// Мастер: срез инфранизких, двухпроходная нормализация громкости для соцсетей (−14 LUFS, пики ≤ −1,5 dBTP)
const EQ = "highpass=f=32:poles=2";
const meas = spawnSync("ffmpeg", ["-hide_banner", "-i", raw, "-af", `${EQ},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
let st = null;
try {
  st = JSON.parse(meas.slice(meas.lastIndexOf("{"), meas.lastIndexOf("}") + 1));
} catch {
  st = null;
}
const ln = st
  ? `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${st.input_i}:measured_TP=${st.input_tp}:measured_LRA=${st.input_lra}:measured_thresh=${st.input_thresh}:offset=${st.target_offset}:linear=true`
  : "loudnorm=I=-14:TP=-1.5:LRA=11";
const out = path.join(pub, "reel-audio.m4a");
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-af", `${EQ},${ln},aresample=48000`, "-c:a", "aac", "-b:a", "192k", out]);
rmSync(raw);
console.log(`Звук ролика: ${out} (${DUR.toFixed(2)} с)`, st ? `исходная громкость ${st.input_i} LUFS` : "");
