import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Phone, Rise, Sticker } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Check, Grain, typed } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const AGENTS = [
  { name: "Агент 1 · сценарий", speed: 1.4 },
  { name: "Агент 2 · код", speed: 0.9 },
  { name: "Агент 3 · тесты", speed: 0.65 },
];

/** 07 — облако: синее поле, телефон с задачей и параллельными агентами, «часы» бегут, гигантское ЧАСАМИ проезжает. */
export const S7Cloud: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("cloud");
  const sendAt = L.at(80);
  const runFrom = sendAt + 8;
  // Счётчик времени работы: ускоряется к «часами»
  const secs = Math.round(interpolate(frame, [runFrom, L.at(86), L.len], [0, 1800, 3 * 3600 + 1240], { ...rclamp, easing: RE.in }));
  const clock = `${Math.floor(secs / 3600)}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const giant = interpolate(frame, [L.at(86) - 4, L.len], [1100, -2300], rclamp);
  const task = "Сделай сайт и проверь тесты";
  return (
    <Part from={0} color={R.blue}>
      <div style={{ position: "absolute", left: 72, right: 72, top: 286 }}>
        <Rise at={0}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 78, letterSpacing: "-0.04em", color: R.white, lineHeight: 1.05 }}>Работает в облаке</div>
        </Rise>
        <Rise at={L.at(76)}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 64, color: R.amber }}>даже с телефона</div>
        </Rise>
      </div>

      {/* Гигантское слово проезжает за телефоном */}
      <div style={{ position: "absolute", top: 820, left: giant, fontFamily: RF.display, fontWeight: 900, fontSize: 420, letterSpacing: "-0.05em", color: "transparent", WebkitTextStroke: "4px rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
        ЧАСАМИ
      </div>

      <Phone width={520} screenHeight={880} style={{ left: 280, top: 500, rotate: "-3deg", translate: `0 ${interpolate(frame, [0, 14], [700, 0], { ...rclamp, easing: RE.out })}px` }}>
        <div style={{ position: "absolute", inset: 0, background: R.canvas, padding: "70px 26px 26px", fontFamily: RF.ui }}>
          <div style={{ fontWeight: 800, fontSize: 26, color: R.ink, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: R.clay, display: "inline-block" }} />
            Claude Code · облако
          </div>
          <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: frame >= sendAt ? R.clay : R.white, color: frame >= sendAt ? R.white : R.ink, borderRadius: "22px 22px 6px 22px", padding: "14px 18px", fontWeight: 700, fontSize: 24, maxWidth: 380 }}>
              {typed(task, frame, L.at(79) - 6, sendAt - 2) || <span style={{ color: R.gray }}>Задача…</span>}
            </div>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            {AGENTS.map((a, i) => {
              const at = runFrom + i * 5;
              if (frame < at) return null;
              const p = Math.min(1, ((frame - at) / 70) * a.speed);
              const pop = interpolate(frame, [at, at + 8], [0, 1], { ...rclamp, easing: RE.pop });
              return (
                <div key={a.name} style={{ background: R.white, borderRadius: 18, padding: "14px 16px", scale: 0.9 + 0.1 * pop, opacity: pop, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 700, fontSize: 22, color: R.ink }}>
                    {a.name}
                    {p >= 1 ? <Check at={at + 70 / a.speed} size={30} /> : <span style={{ fontFamily: RF.mono, fontSize: 20, color: R.gray }}>{Math.round(p * 100)}%</span>}
                  </div>
                  <div style={{ marginTop: 10, height: 10, borderRadius: 6, background: R.clayTint, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p * 100}%`, background: p >= 1 ? R.green : R.clay }} />
                  </div>
                </div>
              );
            })}
          </div>
          {frame >= runFrom && (
            <div style={{ position: "absolute", left: 26, right: 26, bottom: 30, background: R.ink, color: R.white, borderRadius: 18, padding: "16px 20px", display: "flex", justifyContent: "space-between", fontFamily: RF.mono, fontSize: 24 }}>
              <span>● работает</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: R.amber }}>{clock}</span>
            </div>
          )}
        </div>
      </Phone>

      <Sticker at={L.at(81)} rotate={-7} bg={R.amber} style={{ left: 60, top: 1230, fontSize: 48 }}>
        а ты ушёл по делам
      </Sticker>
      <Sticker at={L.at(86)} rotate={6} bg={R.white} style={{ right: 50, top: 1390, fontSize: 48 }}>
        работает часами
      </Sticker>
      <Grain />
    </Part>
  );
};
