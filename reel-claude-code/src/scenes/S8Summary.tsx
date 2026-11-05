import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Slam } from "../components/Kinetic";
import { Canvas, ChatGlyph, Check, Cross, TermGlyph, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const ROWS: { label: string; chat: boolean }[] = [
  { label: "Отвечает и объясняет", chat: true },
  { label: "Правит файлы проекта", chat: false },
  { label: "Терминал и тесты", chat: false },
  { label: "GitHub и деплой", chat: false },
  { label: "Работает часами сам", chat: false },
];

/** 08 — итог: таблица сравнения (галочки щёлкают по очереди) и два слогана. */
export const S8Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("summary");
  const step = 4;
  const win = interpolate(frame, [-2, 10], [0, 1], { ...rclamp, easing: RE.out });
  const head: React.CSSProperties = { width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: RF.ui, fontWeight: 800, fontSize: 22 };
  return (
    <Canvas>
      <Win title="Сравнение" width={940} style={{ left: 70, top: 300, translate: `0 ${(1 - win) * 300}px`, opacity: win }} pad={26}>
        <div style={{ display: "flex", alignItems: "flex-end", padding: "0 18px 14px", borderBottom: `2px solid ${R.line}` }}>
          <div style={{ flex: 1 }} />
          <div style={{ ...head, color: R.ink }}>
            <ChatGlyph size={34} />
            Claude
          </div>
          <div style={{ ...head, color: R.clay }}>
            <TermGlyph size={34} />
            Claude Code
          </div>
        </div>
        {ROWS.map((r, i) => {
          const at = 6 + i * step;
          const on = interpolate(frame, [at, at + 6], [0, 1], { ...rclamp, easing: RE.out });
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", padding: "20px 18px", borderBottom: i < ROWS.length - 1 ? `2px solid ${R.line}` : "none", opacity: on, translate: `${(1 - on) * 40}px 0` }}>
              <div style={{ flex: 1, fontFamily: RF.ui, fontWeight: 700, fontSize: 32, color: R.ink }}>{r.label}</div>
              <div style={{ width: 150, display: "flex", justifyContent: "center" }}>{r.chat ? <Check at={at + 2} size={46} /> : <Cross at={at + 2} size={46} />}</div>
              <div style={{ width: 150, display: "flex", justifyContent: "center" }}>
                <Check at={at + 4} size={46} />
              </div>
            </div>
          );
        })}
      </Win>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1120, textAlign: "center" }}>
        <Slam at={L.at(88)} from={1.5}>
          <div style={{ fontFamily: RF.display, fontWeight: 800, fontSize: 70, letterSpacing: "-0.03em", color: R.gray }}>Чат советует.</div>
        </Slam>
        <Slam at={L.at(90)} from={1.8} style={{ marginTop: 18 }}>
          <div style={{ display: "inline-block", background: R.clay, color: R.white, borderRadius: 28, padding: "18px 34px 24px", rotate: "-2deg", boxShadow: "0 24px 50px rgba(217,119,87,0.4)" }}>
            <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 74, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Claude Code</div>
            <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 56, opacity: interpolate(frame, [L.at(92), L.at(92) + 6], [0, 1], rclamp) }}>работает за тебя</div>
          </div>
        </Slam>
      </div>
    </Canvas>
  );
};
