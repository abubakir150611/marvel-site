import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { R, RE, RF, rclamp } from "../theme";
import { Rise } from "./Kinetic";
import { Part } from "./Part";
import { type Shot } from "./Screens";
import { SitePhone } from "./SitePhone";
import { Check, Grain } from "./Ui";

export type Point = { label: string; at: number };

/**
 * Сцена проекта: цветное поле в стиле сайта, название и подпись слева сверху,
 * большой телефон с настоящими экранами справа, пункты-«галочки» слева на словах озвучки.
 */
export const Project: React.FC<{
  bg: string;
  ink: string;
  accent: string;
  name: string;
  tag: string;
  shots: Shot[];
  points: Point[];
  nameFont?: string;
  children?: React.ReactNode;
}> = ({ bg, ink, accent, name, tag, shots, points, nameFont = RF.display, children }) => {
  const frame = useCurrentFrame();
  return (
    <Part from={0} color={bg}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 262 }}>
        <Rise at={0}>
          <div style={{ fontFamily: nameFont, fontWeight: 900, fontSize: 92, letterSpacing: nameFont === RF.display ? "-0.05em" : "0.02em", color: ink, lineHeight: 1 }}>{name}</div>
        </Rise>
        <Rise at={3}>
          <div style={{ fontFamily: RF.mono, fontSize: 28, color: ink, opacity: 0.7, marginTop: 12, letterSpacing: "0.06em" }}>{tag}</div>
        </Rise>
      </div>
      <SitePhone width={560} screenHeight={1020} shots={shots} left={470} top={430} rotate={3} enter={-2} />
      <div style={{ position: "absolute", left: 50, top: 520, width: 430, display: "flex", flexDirection: "column", gap: 18 }}>
        {points.map((p) => {
          const on = interpolate(frame, [p.at - 2, p.at + 8], [0, 1], { ...rclamp, easing: RE.pop });
          return (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                alignSelf: "flex-start",
                background: R.white,
                color: R.ink,
                borderRadius: 22,
                padding: "16px 22px",
                fontFamily: RF.ui,
                fontWeight: 800,
                fontSize: 32,
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                scale: on,
                opacity: frame < p.at - 2 ? 0 : 1,
                rotate: `${-2 + (p.label.length % 3)}deg`,
              }}
            >
              <Check at={p.at} size={38} color={accent} />
              {p.label}
            </div>
          );
        })}
      </div>
      {children}
      <Grain />
    </Part>
  );
};
