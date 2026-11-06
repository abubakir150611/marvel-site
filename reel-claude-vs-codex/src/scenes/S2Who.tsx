import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, ClaudeMark, CodexMark } from "../components/Brand";
import { Appear, Canvas, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const Line: React.FC<{ label: string; children: React.ReactNode; dark?: boolean }> = ({ label, children, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderTop: `2px solid ${dark ? "rgba(255,255,255,0.08)" : R.line}` }}>
    <div style={{ width: 200, fontFamily: RF.mono, fontSize: 26, color: dark ? "rgba(255,255,255,0.5)" : R.gray, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{children}</div>
  </div>
);

/** 02 — кто есть кто: две карточки — компания и модели. */
export const S2Who: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("who");
  const a = interpolate(frame, [-2, 12], [0, 1], { ...rclamp, easing: RE.out });
  const b = interpolate(frame, [L.at(22) - 6, L.at(22) + 8], [0, 1], { ...rclamp, easing: RE.out });
  const head = (mark: React.ReactNode, name: string, dark?: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
      {mark}
      <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 64, letterSpacing: "-0.04em", color: dark ? R.white : R.ink }}>{name}</div>
    </div>
  );
  return (
    <Canvas>
      <Win title="кто есть кто" width={940} style={{ left: 70, top: 300, translate: `${(1 - a) * -110}% 0`, rotate: "-1.5deg" }}>
        {head(<ClaudeMark size={72} />, "Claude Code")}
        <Line label="Компания">
          <Appear at={L.at(16)}>
            <Chip bg={R.clayTint}>Anthropic</Chip>
          </Appear>
        </Line>
        <Line label="Модели">
          <Appear at={L.at(20)}>
            <Chip bg={R.clay} color={R.white}>
              Claude Opus
            </Chip>
          </Appear>
          <Appear at={L.at(20) + 3}>
            <Chip bg={R.clay} color={R.white}>
              Claude Sonnet
            </Chip>
          </Appear>
        </Line>
      </Win>
      <Win title="кто есть кто" dark width={940} style={{ left: 70, top: 880, translate: `${(1 - b) * 110}% 0`, rotate: "1.5deg" }}>
        {head(<CodexMark size={72} invert />, "Codex", true)}
        <Line label="Компания" dark>
          <Appear at={L.at(23)}>
            <Chip bg="#2A2A2E" color={R.white}>
              OpenAI
            </Chip>
          </Appear>
        </Line>
        <Line label="Модели" dark>
          <Appear at={L.at(27)}>
            <Chip bg={R.white} color={R.ink}>
              GPT · Codex
            </Chip>
          </Appear>
        </Line>
      </Win>
    </Canvas>
  );
};
