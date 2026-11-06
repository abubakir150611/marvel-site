import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Canvas, SectionTitle } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Карточка-совет «выбирай X, если …»: заголовок влетает, условие печатается следом. */
const Pick: React.FC<{ at: number; condAt: number; mark: React.ReactNode; name: string; cond: string; dark?: boolean; top: number; dir: 1 | -1 }> = ({ at, condAt, mark, name, cond, dark, top, dir }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - 2, at + 10], [0, 1], { ...rclamp, easing: RE.pop });
  const c = interpolate(frame, [condAt, condAt + 8], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        background: dark ? R.codex : R.clay,
        color: R.white,
        borderRadius: 38,
        padding: "34px 38px 40px",
        boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
        translate: `${(1 - p) * 120 * dir}% 0`,
        rotate: `${dir * -1.5}deg`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {mark}
        <span style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 74, letterSpacing: "-0.04em" }}>{name}</span>
      </div>
      <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, marginTop: 18, opacity: c, translate: `0 ${(1 - c) * 24}px` }}>{cond}</div>
    </div>
  );
};

/** 08 — итог: кому что подходит. */
export const S8Verdict: React.FC = () => {
  const L = local("verdict");
  return (
    <Canvas>
      <SectionTitle n="→" title="Итог" sub="кому что подходит" at={0} />
      <Pick at={L.at(114)} condAt={L.at(116)} mark={<CodexMark size={70} invert />} name="Codex" cond="если ты живёшь в ChatGPT" dark top={520} dir={1} />
      <Pick at={L.at(121)} condAt={L.at(123)} mark={<ClaudeMark size={70} />} name="Claude Code" cond="если хочешь агента, которого можно настроить под себя" top={920} dir={-1} />
    </Canvas>
  );
};
