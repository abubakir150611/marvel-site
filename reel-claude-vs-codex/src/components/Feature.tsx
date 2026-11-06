import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { R, RE, RF, rclamp } from "../theme";

/**
 * Карточка «сильной стороны»: номер, заголовок, подпись и маленькая иллюстрация справа.
 * Влетает сбоку с пружиной в кадре at; пока не наступил её момент — не видна.
 */
export const Feature: React.FC<{
  n: number;
  at: number;
  title: string;
  sub: string;
  accent: string;
  top: number;
  children?: React.ReactNode;
  dir?: 1 | -1;
}> = ({ n, at, title, sub, accent, top, children, dir = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at - 2) return null;
  const p = interpolate(frame, [at - 2, at + 10], [0, 1], { ...rclamp, easing: RE.pop });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        height: 300,
        background: R.white,
        borderRadius: 34,
        padding: "30px 34px",
        display: "flex",
        gap: 26,
        boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
        translate: `${(1 - p) * 120 * dir}% 0`,
        rotate: `${(1 - p) * 8 * dir + (n % 2 ? -1 : 1)}deg`,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 99, background: accent, color: R.white, display: "grid", placeItems: "center", fontFamily: RF.display, fontWeight: 800, fontSize: 28 }}>{n}</div>
          <div style={{ fontFamily: RF.mono, fontSize: 24, color: R.gray, letterSpacing: "0.1em" }}>ПЛЮС</div>
        </div>
        <div style={{ fontFamily: RF.display, fontWeight: 800, fontSize: 50, letterSpacing: "-0.03em", color: R.ink, lineHeight: 1.08, marginTop: 18 }}>{title}</div>
        <div style={{ fontFamily: RF.text, fontWeight: 700, fontSize: 30, color: R.gray, marginTop: 10 }}>{sub}</div>
      </div>
      {children && <div style={{ width: 320, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>{children}</div>}
    </div>
  );
};

/** Полоса выполнения для мини-иллюстраций. */
export const Bar: React.FC<{ p: number; color: string; label?: string; h?: number }> = ({ p, color, label, h = 18 }) => (
  <div>
    {label && <div style={{ fontFamily: RF.mono, fontSize: 22, color: R.gray, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>{label}</div>}
    <div style={{ height: h, borderRadius: 99, background: R.row, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.max(0, Math.min(1, p)) * 100}%`, background: color, borderRadius: 99 }} />
    </div>
  </div>
);
