import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Count, Sticker } from "../components/Kinetic";
import { Appear, Canvas, Check, FileIcon, Row, SectionTitle, TermGlyph, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Настоящие файлы проекта marvel-site (этот репозиторий). */
const FILES: { name: string; ext: string; color: string }[] = [
  { name: "app/page.tsx", ext: "tsx", color: R.blue },
  { name: "sections/Hero.tsx", ext: "tsx", color: R.blue },
  { name: "sections/Heroes.tsx", ext: "tsx", color: R.blue },
  { name: "sections/Timeline.tsx", ext: "tsx", color: R.blue },
  { name: "three/PortalRing.tsx", ext: "tsx", color: R.blue },
  { name: "hooks/useCounter.ts", ext: "ts", color: R.emerald },
  { name: "app/globals.css", ext: "css", color: R.clay },
];
/** Число файлов в src/ этого репозитория (git ls-files src | wc -l). */
const SRC_FILES = 52;

const DIFF: { t: " " | "-" | "+"; n: number; code: string }[] = [
  { t: " ", n: 12, code: "<h1 className=\"hero-title\">" },
  { t: "-", n: 13, code: "  Marvel Universe" },
  { t: "+", n: 13, code: "  Добро пожаловать" },
  { t: "+", n: 14, code: "  во вселенную Marvel" },
  { t: " ", n: 15, code: "</h1>" },
  { t: "+", n: 16, code: "<PortalRing glow />" },
];

/** 04 — Claude Code заходит в проект: читает файлы (сканер с галочками), затем правит код (дифф). */
export const S4Project: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("project");
  const scanFrom = L.at(40);
  const scanTo = Math.max(scanFrom + 18, L.at(43));
  const scanStep = (scanTo - scanFrom) / FILES.length;
  const editAt = L.at(45) - 2;
  const toDiff = interpolate(frame, [editAt, editAt + 10], [0, 1], { ...rclamp, easing: RE.inOut });
  return (
    <Canvas>
      <SectionTitle n="2" title="Claude Code" sub="работает прямо в твоём проекте" at={0} />

      <Win title="Claude Code — marvel-site" icon={<TermGlyph size={26} />} width={940} style={{ left: 70, top: 500 }} pad={26}>
        <Appear at={L.at(36)}>
          <Row
            icon={<span style={{ fontSize: 30 }}>📁</span>}
            text="~/projects/marvel-site"
            mono
            meta={
              <span style={{ color: R.ink }}>
                <Count from={0} to={SRC_FILES} at={scanFrom} dur={scanTo - scanFrom} /> файла
              </span>
            }
          />
        </Appear>
        <div style={{ position: "relative", height: 640, marginTop: 18, overflow: "hidden" }}>
          {/* Список файлов: сканер проходит сверху вниз, каждая строка получает галочку */}
          <div style={{ position: "absolute", inset: 0, translate: `${-toDiff * 105}% 0`, opacity: 1 - toDiff * 0.6 }}>
            {FILES.map((f, i) => {
              const at = scanFrom + i * scanStep;
              const active = frame >= at && frame < at + scanStep + 2;
              return (
                <Appear key={f.name} at={L.at(37) + i * 2} dy={24}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: "14px 18px",
                      borderRadius: 16,
                      background: active ? R.clayTint : "transparent",
                      fontFamily: RF.mono,
                      fontSize: 30,
                      color: R.ink,
                      height: 84,
                    }}
                  >
                    <FileIcon ext={f.ext} color={f.color} size={34} />
                    <span style={{ flex: 1 }}>{f.name}</span>
                    {frame >= at + scanStep * 0.6 && <Check at={at + scanStep * 0.6} size={40} />}
                  </div>
                </Appear>
              );
            })}
          </div>
          {/* Правка: дифф файла Hero.tsx */}
          <div style={{ position: "absolute", inset: 0, translate: `${(1 - toDiff) * 105}% 0` }}>
            <Row
              icon={<FileIcon ext="tsx" color={R.blue} size={34} />}
              text="Правка · Hero.tsx"
              meta={
                <span>
                  <span style={{ color: R.green }}>+3</span> <span style={{ color: R.red }}>−1</span>
                </span>
              }
            />
            <div style={{ marginTop: 16, background: "#FBFAF8", borderRadius: 18, overflow: "hidden", border: `2px solid ${R.line}` }}>
              {DIFF.map((d, i) => {
                const at = editAt + 8 + i * 4;
                const on = interpolate(frame, [at, at + 6], [0, 1], rclamp);
                const bg = d.t === "+" ? "#E3F6EA" : d.t === "-" ? "#FCE4E1" : "transparent";
                const fg = d.t === "+" ? "#1E7A47" : d.t === "-" ? "#B4362B" : R.ink;
                return (
                  <div key={i} style={{ display: "flex", gap: 18, padding: "12px 20px", background: bg, fontFamily: RF.mono, fontSize: 28, color: fg, opacity: d.t === " " ? 1 : on, translate: `${(1 - on) * (d.t === " " ? 0 : 30)}px 0` }}>
                    <span style={{ width: 40, color: R.gray, textAlign: "right" }}>{d.n}</span>
                    <span style={{ width: 22 }}>{d.t === " " ? "" : d.t}</span>
                    <span style={{ whiteSpace: "pre", textDecoration: d.t === "-" ? "line-through" : "none" }}>{d.code}</span>
                  </div>
                );
              })}
            </div>
            <Appear at={editAt + 34} style={{ marginTop: 18 }}>
              <Row icon={<Check at={editAt + 34} size={40} />} text="Файл сохранён" bg={R.greenTint} color="#1E7A47" />
            </Appear>
          </div>
        </div>
      </Win>

      <Sticker at={L.at(41)} exit={L.at(45) - 4} rotate={-5} bg={R.amber} style={{ left: 70, top: 1330, fontSize: 52 }}>
        читает все файлы
      </Sticker>
      <Sticker at={L.at(45)} rotate={6} bg={R.clay} color={R.white} style={{ right: 60, top: 1400, fontSize: 52 }}>
        и сам правит код
      </Sticker>
    </Canvas>
  );
};
