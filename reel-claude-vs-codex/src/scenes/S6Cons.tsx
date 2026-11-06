import React from "react";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Slam } from "../components/Kinetic";
import { Appear, Canvas, Cross, Win } from "../components/Ui";
import { local, R, RF } from "../theme";

const Con: React.FC<{ at: number; text: string; dark?: boolean }> = ({ at, text, dark }) => (
  <Appear at={at}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 20px", borderRadius: 20, background: dark ? "#232327" : R.row, marginTop: 12 }}>
      <Cross at={at} size={46} />
      <span style={{ fontFamily: RF.ui, fontWeight: 700, fontSize: 36, color: dark ? R.white : R.ink }}>{text}</span>
    </div>
  </Appear>
);

/** 06 — минусы каждого: по два пункта с крестиками. */
export const S6Cons: React.FC = () => {
  const L = local("cons");
  const head = (mark: React.ReactNode, name: string, dark?: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {mark}
      <span style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 52, letterSpacing: "-0.04em", color: dark ? R.white : R.ink }}>{name}</span>
    </div>
  );
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 72, right: 72, top: 270 }}>
        <Slam at={L.at(87)} from={1.8}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 120, letterSpacing: "-0.05em", color: R.red }}>Минусы?</div>
        </Slam>
      </div>
      <Appear at={L.at(88) - 3} style={{ position: "absolute", left: 70, right: 70, top: 470 }}>
        <Win title="минусы" width={940}>
          {head(<ClaudeMark size={64} />, "Claude Code")}
          <Con at={L.at(90)} text="Закрытый код" />
          <Con at={L.at(93)} text="Только модели Claude" />
        </Win>
      </Appear>
      <Appear at={L.at(97) - 3} style={{ position: "absolute", left: 70, right: 70, top: 960 }}>
        <Win title="минусы" dark width={940}>
          {head(<CodexMark size={64} invert />, "Codex", true)}
          <Con at={L.at(100)} text="Плагины ещё молодые" dark />
          <Con at={L.at(104)} text="Экосистема меньше" dark />
        </Win>
      </Appear>
    </Canvas>
  );
};
