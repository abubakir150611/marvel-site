import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Canvas, Check } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Значки-символы (нарисованы кодом, без эмодзи-шрифта). */
const Glyph: React.FC<{ kind: "phone" | "bolt" | "brush" | "rocket"; color: string }> = ({ kind, color }) => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="18" fill={color} />
    {kind === "phone" && <rect x="22" y="12" width="20" height="40" rx="5" fill="none" stroke="#fff" strokeWidth="4" />}
    {kind === "bolt" && <path d="M36 10 L18 36 H30 L26 54 L46 26 H34 Z" fill="#fff" />}
    {kind === "brush" && <path d="M44 12 L52 20 L30 42 L22 34 Z M20 38 L26 44 C24 52 16 54 12 52 C16 48 14 42 20 38 Z" fill="#fff" />}
    {kind === "rocket" && <path d="M32 8 C42 16 44 30 40 42 H24 C20 30 22 16 32 8 Z M24 42 L18 52 L26 48 M40 42 L46 52 L38 48" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />}
  </svg>
);

/** 06 — что получает заказчик: четыре карточки выпрыгивают на словах озвучки. */
export const S6Perks: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("perks");
  const cards: { kind: "phone" | "bolt" | "brush" | "rocket"; title: string; at: number; color: string }[] = [
    { kind: "phone", title: "Под телефон", at: L.at(60), color: R.blue },
    { kind: "bolt", title: "Быстро", at: L.at(62), color: R.amber },
    { kind: "brush", title: "В вашем стиле", at: L.at(65), color: R.clay },
    { kind: "rocket", title: "От идеи до запуска", at: L.at(67), color: R.emerald },
  ];
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 72, right: 72, top: 280, fontFamily: RF.display, fontWeight: 900, fontSize: 84, letterSpacing: "-0.05em", color: R.ink, lineHeight: 1.02 }}>
        Что ты
        <br />
        <span style={{ color: R.clay }}>получишь</span>
      </div>
      {cards.map((c, i) => {
        const p = interpolate(frame, [c.at - 3, c.at + 9], [0, 1], { ...rclamp, easing: RE.pop });
        return (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: 70 + (i % 2) * 40,
              right: 70 + ((i + 1) % 2) * 40,
              top: 560 + i * 220,
              height: 180,
              background: R.white,
              borderRadius: 34,
              padding: "0 36px",
              display: "flex",
              alignItems: "center",
              gap: 28,
              boxShadow: "0 30px 70px rgba(60,50,35,0.16)",
              scale: p,
              opacity: frame < c.at - 3 ? 0 : 1,
              rotate: `${i % 2 ? 1.5 : -1.5}deg`,
            }}
          >
            <Glyph kind={c.kind} color={c.color} />
            <div style={{ flex: 1, fontFamily: RF.display, fontWeight: 800, fontSize: 52, letterSpacing: "-0.03em", color: R.ink }}>{c.title}</div>
            <Check at={c.at + 4} size={52} color={c.color} />
          </div>
        );
      })}
    </Canvas>
  );
};
