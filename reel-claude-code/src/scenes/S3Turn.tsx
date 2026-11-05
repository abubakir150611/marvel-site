import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Rise, shake, Slam } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Grain, typed } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 03 — поворот: «Claude Code не отвечает» (зачёркивается) → хлёсткая смена поля → «ДЕЛАЕТ.» */
export const S3Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("turn");
  const strike = interpolate(frame, [L.at(32), L.at(32) + 8], [0, 1], { ...rclamp, easing: RE.out });
  const doAt = L.at(33) - 3;
  return (
    <>
      <Part from={0} until={doAt} color={R.black}>
        <div style={{ position: "absolute", left: 72, right: 72, top: 560 }}>
          <Rise at={0}>
            <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 88, color: R.cream }}>а вот</div>
          </Rise>
          <Rise at={L.at(29)}>
            <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 104, letterSpacing: "-0.04em", color: R.clay, lineHeight: 1.05 }}>Claude Code</div>
          </Rise>
          <div style={{ position: "relative", display: "inline-block", marginTop: 28 }}>
            <Rise at={L.at(31)}>
              <div style={{ fontFamily: RF.display, fontWeight: 800, fontSize: 88, letterSpacing: "-0.03em", color: "rgba(242,238,228,0.55)" }}>не отвечает</div>
            </Rise>
            <div style={{ position: "absolute", left: -10, top: "52%", height: 14, width: `${strike * 104}%`, background: R.red, rotate: "-3deg", borderRadius: 8 }} />
          </div>
        </div>
      </Part>
      <Part from={doAt} color={R.clay}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", translate: shake(frame, L.at(34) + 6, 16) }}>
          <Slam at={L.at(33)} from={1.5}>
            <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 110, color: R.ink }}>он</div>
          </Slam>
          <Slam at={L.at(34)} from={2}>
            <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 196, letterSpacing: "-0.05em", color: R.cream, lineHeight: 1, textShadow: "0 18px 0 rgba(20,20,19,0.18)" }}>ДЕЛАЕТ.</div>
          </Slam>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: RF.mono, fontSize: 40, color: R.ink }}>
          <span style={{ color: R.cream }}>❯</span> {typed("claude «сделай сайт»", frame, doAt + 4, doAt + 30)}
        </div>
      </Part>
      <Grain />
    </>
  );
};
