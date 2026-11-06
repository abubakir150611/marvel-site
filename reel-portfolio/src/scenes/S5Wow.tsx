import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Rise, shake, Slam } from "../components/Kinetic";
import { Part } from "../components/Part";
import { SitePhone } from "../components/SitePhone";
import { Grain } from "../components/Ui";
import { local, R, RF, rclamp } from "../theme";

/** 05 — 3D: Marvel-сайт (настоящие экраны при прокрутке), гигантское «3D» врезается на последнем слове. */
export const S5Wow: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("wow");
  const step = Math.max(8, Math.round((L.at(58) - 2) / 4));
  const glow = interpolate(frame, [L.at(58), L.at(58) + 10], [0, 1], rclamp);
  return (
    <Part from={0} color="#0B0306">
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 60%, rgba(232,56,44,${0.25 + glow * 0.35}), transparent 70%)` }} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 270 }}>
        <Rise at={0}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 72, color: R.white }}>нужен вау-эффект?</div>
        </Rise>
      </div>
      <SitePhone
        width={520}
        screenHeight={960}
        left={280}
        top={430}
        rotate={-3}
        enter={-2}
        shots={[0, 1, 2, 3].map((k) => ({ src: `screens/mv-${k}.jpg`, from: k * step }))}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", translate: shake(frame, L.at(58) + 6, 18) }}>
        <Slam at={L.at(58)} from={2.6}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 380, letterSpacing: "-0.06em", color: R.red, lineHeight: 1, textShadow: "0 0 60px rgba(232,56,44,0.6), 0 20px 0 rgba(0,0,0,0.35)" }}>3D</div>
        </Slam>
      </div>
      <Grain opacity={0.08} />
    </Part>
  );
};
