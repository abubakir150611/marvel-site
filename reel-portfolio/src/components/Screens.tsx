import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RE, rclamp } from "../theme";

/**
 * Настоящие снимки сайтов внутри телефона: экраны сменяются «шторкой» снизу,
 * каждый может прокручиваться (scroll — в CSS-пикселях страницы шириной 412).
 */
export type Shot = { src: string; from: number; scroll?: [number, number]; until?: number };

export const Screens: React.FC<{ shots: Shot[]; width: number }> = ({ shots, width }) => {
  const frame = useCurrentFrame();
  const s = width / 412;
  return (
    <>
      {shots.map((sh, i) => {
        const next = shots[i + 1];
        const end = sh.until ?? (next ? next.from + 10 : 1e9);
        if (frame < sh.from - 1 || frame > end) return null;
        const enter = i === 0 ? 1 : interpolate(frame, [sh.from, sh.from + 9], [0, 1], { ...rclamp, easing: RE.out });
        const [a, b] = sh.scroll ?? [0, 0];
        const y = interpolate(frame, [sh.from, next ? next.from : sh.from + 120], [a, b], { ...rclamp, easing: RE.inOut });
        return (
          <div key={sh.src + i} style={{ position: "absolute", inset: 0, translate: `0 ${(1 - enter) * 100}%`, overflow: "hidden", background: "#fff" }}>
            <Img src={staticFile(sh.src)} style={{ position: "absolute", left: 0, top: 0, width, translate: `0 ${-y * s}px` }} />
          </div>
        );
      })}
    </>
  );
};
