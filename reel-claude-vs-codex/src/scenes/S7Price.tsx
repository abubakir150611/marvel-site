import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Count, Rise, Slam } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Grain } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Ценник: карточка с отметкой агента, сумма «набегает» от нуля. */
const Tag: React.FC<{ at: number; mark: React.ReactNode; name: string; plan: string; dark?: boolean; rotate: number }> = ({ at, mark, name, plan, dark, rotate }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], { ...rclamp, easing: RE.pop });
  return (
    <div
      style={{
        width: 440,
        background: dark ? R.codex : R.white,
        color: dark ? R.white : R.ink,
        borderRadius: 34,
        padding: "30px 30px 34px",
        boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
        rotate: `${rotate}deg`,
        scale: p,
        opacity: frame < at ? 0 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: RF.display, fontWeight: 800, fontSize: 36 }}>
        {mark}
        {name}
      </div>
      <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 130, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 22 }}>
        $<Count from={0} to={20} at={at} dur={14} />
      </div>
      <div style={{ fontFamily: RF.mono, fontSize: 26, opacity: 0.6, marginTop: 8 }}>в месяц · {plan}</div>
    </div>
  );
};

/** 07 — цена: два одинаковых ценника и знак «=». */
export const S7Price: React.FC = () => {
  const L = local("price");
  return (
    <Part from={0} color={R.amber}>
      <div style={{ position: "absolute", left: 72, right: 72, top: 290 }}>
        <Rise at={0}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 104, letterSpacing: "-0.05em", color: R.ink }}>Цена</div>
        </Rise>
        <Rise at={L.at(107) - 2}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 76, color: R.ink }}>одинаковая</div>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 50, top: 640 }}>
        <Tag at={L.at(108)} mark={<ClaudeMark size={48} />} name="Claude Code" plan="Claude Pro" rotate={-4} />
      </div>
      <div style={{ position: "absolute", right: 50, top: 930 }}>
        <Tag at={L.at(108) + 4} mark={<CodexMark size={48} invert />} name="Codex" plan="ChatGPT Plus" dark rotate={4} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1050 }}>
        <Slam at={L.at(110)} from={2}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 220, color: R.ink, lineHeight: 1 }}>=</div>
        </Slam>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, top: 1410, fontFamily: RF.mono, fontSize: 28, color: R.ink, opacity: 0.75 }}>
        максимальные тарифы — до $200 у обоих
      </div>
      <Grain />
    </Part>
  );
};
