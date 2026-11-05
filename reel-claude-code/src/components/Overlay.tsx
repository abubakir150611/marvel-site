import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { R, RE, RF, RT, rclamp } from "../theme";

/**
 * Интерфейсная рамка поверх всего ролика (как в референсе): марка слева, номер сцены справа,
 * прогресс из девяти делений. Цвет текста подстраивается под цветовое поле кадра.
 */
export const Hud: React.FC<{ dark: (frame: number) => boolean; demo: (frame: number) => boolean }> = ({ dark, demo }) => {
  const frame = useCurrentFrame();
  const ink = dark(frame) ? R.ink : R.cream;
  const index = RT.scenes.findIndex((s) => frame >= s.start && frame < s.end);
  const scene = RT.scenes[Math.max(0, index)]!;
  const label: React.CSSProperties = { fontFamily: RF.mono, fontSize: 24, letterSpacing: "0.14em", color: ink, textTransform: "uppercase" };
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 128, pointerEvents: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...label, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 14, height: 14, background: R.clay, display: "inline-block" }} />
          Claude Code · разбор
        </div>
        <div key={scene.id} style={{ ...label, overflow: "hidden" }}>
          <div style={{ translate: `0 ${interpolate(frame, [scene.start, scene.start + 8], [100, 0], { ...rclamp, easing: RE.out })}%` }}>{scene.title}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        {RT.scenes.map((s, i) => (
          <div key={s.id} style={{ flex: 1, height: 4, background: dark(frame) ? "rgba(10,12,11,0.18)" : "rgba(242,238,228,0.25)", overflow: "hidden" }}>
            <div style={{ height: "100%", background: ink, width: `${i < index ? 100 : i > index ? 0 : interpolate(frame, [s.start, s.end], [0, 100], rclamp)}%` }} />
          </div>
        ))}
      </div>
      {demo(frame) && (
        <div style={{ ...label, fontSize: 20, marginTop: 14, opacity: 0.8 }}>● Иллюстрация интерфейса</div>
      )}
    </div>
  );
};

/**
 * Субтитры: фраза из 1–3 слов на тёмной плашке, текущее слово подсвечено.
 * Тексты и тайминги — из озвучки (src/reel/reel-timeline.json).
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const chunk = RT.captions.find((c) => frame >= c.start && frame < c.end && !c.hidden);
  if (!chunk) return null;
  const enter = interpolate(frame, [chunk.start, chunk.start + 5], [0, 1], { ...rclamp, easing: RE.pop });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1540, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          background: "rgba(10,12,11,0.86)",
          borderRadius: 26,
          padding: "20px 30px 24px",
          maxWidth: 940,
          textAlign: "center",
          fontFamily: RF.text,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
          color: R.white,
          scale: interpolate(enter, [0, 1], [0.86, 1]),
          translate: `0 ${(1 - enter) * 24}px`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
        }}
      >
        {chunk.words.map((w, i) => {
          const active = frame >= w.start - 1 && frame < (chunk.words[i + 1]?.start ?? chunk.end);
          const future = frame < w.start - 1;
          return (
            <span key={i} style={{ color: active ? R.amber : R.white, opacity: future ? 0.5 : 1 }}>
              {w.text}
              {i < chunk.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
