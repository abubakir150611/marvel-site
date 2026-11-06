import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Slam, Sticker } from "../components/Kinetic";
import { Grain } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 01 — хук: кадр разрезан по диагонали — терракотовый Claude Code сверху, чёрный Codex снизу, врезка VS. */
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("hook");
  // Половины уже на месте к кадру 0 (превью не пустое), лёгкое «дыхание» разреза.
  const inTop = interpolate(frame, [-8, 6], [0, 1], { ...rclamp, easing: RE.out });
  const inBot = interpolate(frame, [-4, 10], [0, 1], { ...rclamp, easing: RE.out });
  const tilt = Math.sin(frame / 20) * 10;
  const big: React.CSSProperties = { fontFamily: RF.display, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.95 };
  return (
    <div style={{ position: "absolute", inset: 0, background: R.codex, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: R.clay, clipPath: `polygon(0 0, 100% 0, 100% ${50 - 4 + tilt / 20}%, 0 ${50 + 4 - tilt / 20}%)`, translate: `${(1 - inTop) * -100}% 0` }}>
        <div style={{ position: "absolute", left: 72, top: 300, display: "flex", alignItems: "center", gap: 18, fontFamily: RF.mono, fontSize: 30, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>
          <ClaudeMark size={56} /> ANTHROPIC
        </div>
        <div style={{ ...big, position: "absolute", left: 64, top: 400, fontSize: 168, color: R.white }}>
          Claude
          <br />
          Code
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 ${50 + 4 - tilt / 20}%, 100% ${50 - 4 + tilt / 20}%, 100% 100%, 0 100%)`, translate: `${(1 - inBot) * 100}% 0` }}>
        <div style={{ position: "absolute", right: 72, top: 1090, display: "flex", alignItems: "center", gap: 18, fontFamily: RF.mono, fontSize: 30, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>
          OPENAI <CodexMark size={56} invert />
        </div>
        <div style={{ ...big, position: "absolute", right: 64, top: 1170, fontSize: 200, color: R.white, textAlign: "right" }}>Codex</div>
      </div>

      <div style={{ position: "absolute", left: 540 - 105, top: 960 - 105 }}>
        <Slam at={L.at(2)} from={2.4}>
          <div
            style={{
              width: 210,
              height: 210,
              borderRadius: 999,
              background: R.white,
              display: "grid",
              placeItems: "center",
              fontFamily: RF.display,
              fontWeight: 900,
              fontSize: 84,
              color: R.ink,
              boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
            }}
          >
            VS
          </div>
        </Slam>
      </div>

      <Sticker at={L.at(5)} rotate={-6} bg={R.amber} style={{ left: 60, top: 742, fontSize: 50 }}>
        топ-2 ИИ-агента
      </Sticker>
      <Sticker at={L.at(10)} rotate={5} bg={R.white} style={{ right: 70, top: 1420, fontSize: 46 }}>
        отличия за 60 сек
      </Sticker>
      <Grain />
    </div>
  );
};
