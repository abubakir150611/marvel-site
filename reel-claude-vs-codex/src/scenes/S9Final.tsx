import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Rise, Slam, Sticker } from "../components/Kinetic";
import { Canvas, Cursor } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Половина переключателя: активная заливается цветом агента. */
const Pill: React.FC<{ active: number; mark: React.ReactNode; name: string; bg: string }> = ({ active, mark, name, bg }) => (
  <div
    style={{
      flex: 1,
      height: 130,
      borderRadius: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      fontFamily: RF.display,
      fontWeight: 800,
      fontSize: 40,
      background: active > 0.5 ? bg : "transparent",
      color: active > 0.5 ? R.white : R.gray,
      scale: 1 + active * 0.04,
    }}
  >
    {mark}
    {name}
  </div>
);

/** 09 — финал: переключатель Codex / Claude Code, курсор выбирает Claude Code, «А я выбираю Claude Code». */
export const S9Final: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("final");
  const pick = L.at(134) - 2;
  const on = interpolate(frame, [pick, pick + 8], [0, 1], { ...rclamp, easing: RE.pop });
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center" }}>
        <Rise at={L.at(131) - 2}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 96, color: R.ink }}>А я выбираю</div>
        </Rise>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 560, background: R.white, borderRadius: 999, padding: 16, display: "flex", gap: 12, boxShadow: "0 30px 70px rgba(60,50,35,0.18)" }}>
        <Pill active={1 - on} mark={<CodexMark size={56} />} name="Codex" bg={R.codex} />
        <Pill active={on} mark={<ClaudeMark size={56} />} name="Claude Code" bg={R.clay} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center" }}>
        <Slam at={L.at(134)} from={2.2}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 170, letterSpacing: "-0.05em", color: R.clay, lineHeight: 0.95 }}>
            Claude
            <br />
            Code
          </div>
        </Slam>
      </div>

      <Cursor
        hideBefore={L.at(131)}
        keys={[
          { f: L.at(131), x: 300, y: 900 },
          { f: pick, x: 760, y: 640, click: true },
          { f: pick + 20, x: 800, y: 700 },
        ]}
      />
      <Sticker at={L.at(135) + 10} rotate={-5} bg={R.amber} style={{ left: 90, top: 1260, fontSize: 48 }}>
        а ты? пиши в комментах
      </Sticker>
    </Canvas>
  );
};
