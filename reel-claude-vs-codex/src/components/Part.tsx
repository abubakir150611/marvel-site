import React from "react";
import { useCurrentFrame } from "remotion";
import { whipIn } from "./Kinetic";

/**
 * Часть сцены на своём цветовом поле: въезжает «хлёстким» сдвигом в кадре from и остаётся,
 * пока её не накроет следующая часть (until — кадр начала следующей).
 */
export const Part: React.FC<{ from: number; until?: number; color: string; dir?: 1 | -1; children: React.ReactNode }> = ({ from, until, color, dir = 1, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until + 8)) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: color, ...(from > 0 ? whipIn(frame, from, dir) : {}) }}>{children}</div>
    </div>
  );
};

/** Блок по центру по горизонтали на заданной высоте. */
export const Center: React.FC<{ top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, children, style }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", ...style }}>{children}</div>
);
