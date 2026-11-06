import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, CodexMark } from "../components/Brand";
import { Bar, Feature } from "../components/Feature";
import { Rise } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Check, Grain } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 04 — сильные стороны Codex на чёрном поле: открытый код, облачная песочница, экономия токенов. */
export const S4Codex: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("codex");
  const sbx = L.at(52);
  const tok = L.at(60);
  return (
    <Part from={0} color={R.codex}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 270, display: "flex", alignItems: "center", gap: 24 }}>
        <CodexMark size={92} invert />
        <div>
          <Rise at={0}>
            <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 56, color: "rgba(255,255,255,0.7)" }}>сильные стороны</div>
          </Rise>
          <Rise at={2}>
            <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 92, letterSpacing: "-0.05em", color: R.white, lineHeight: 1 }}>Codex</div>
          </Rise>
        </div>
      </div>

      <Feature n={1} at={L.at(48)} top={500} accent={R.codex} title="Открытый исходный код" sub="CLI на Rust · Apache 2.0">
        <Chip bg={R.codex} color={R.white} style={{ alignSelf: "flex-start", fontFamily: RF.mono, fontSize: 26 }}>
          ★ open source
        </Chip>
        <div style={{ fontFamily: RF.mono, fontSize: 24, color: R.gray, lineHeight: 1.5 }}>
          github.com/openai/codex
        </div>
      </Feature>

      <Feature n={2} at={L.at(51)} top={830} accent={R.codex} title="Облачная песочница" sub="задачи параллельно" dir={-1}>
        {[1, 0.75, 0.55].map((s, i) => {
          const p = interpolate(frame, [sbx + i * 3, sbx + 40 + i * 6], [0, 1], { ...rclamp, easing: RE.out }) * (0.6 + s * 0.4);
          return <Bar key={i} p={p} color={R.codex} label={`задача ${i + 1}`} h={16} />;
        })}
      </Feature>

      <Feature n={3} at={L.at(56)} top={1160} accent={R.codex} title="Экономнее по токенам" sub="по ряду сторонних тестов">
        <Bar p={interpolate(frame, [tok, tok + 14], [0, 0.62], { ...rclamp, easing: RE.out })} color={R.codex} label="Codex" />
        <Bar p={interpolate(frame, [tok + 3, tok + 17], [0, 0.88], { ...rclamp, easing: RE.out })} color={R.clay} label="Claude Code" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: RF.mono, fontSize: 20, color: R.gray, opacity: frame >= tok + 18 ? 1 : 0 }}>
          <Check at={tok + 18} size={28} color={R.codex} /> иллюстрация
        </div>
      </Feature>
      <Grain />
    </Part>
  );
};
