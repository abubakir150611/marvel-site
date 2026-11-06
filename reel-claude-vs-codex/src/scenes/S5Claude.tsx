import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, ClaudeMark } from "../components/Brand";
import { Feature } from "../components/Feature";
import { Rise } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Check, FileIcon, Grain } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const PARTS = ["хуки", "субагенты", "скиллы", "плагины", "MCP"];

/** 05 — сильные стороны Claude Code на терракотовом поле: твои файлы, плагины и хуки, качество кода. */
export const S5Claude: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("claude");
  const files = L.at(70);
  const plug = L.at(75);
  const diff = L.at(82);
  return (
    <Part from={0} color={R.clay}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 270, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ borderRadius: 22, boxShadow: "0 0 0 6px rgba(255,255,255,0.9)" }}>
          <ClaudeMark size={92} />
        </div>
        <div>
          <Rise at={0}>
            <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 56, color: "rgba(255,255,255,0.85)" }}>сильные стороны</div>
          </Rise>
          <Rise at={2}>
            <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 92, letterSpacing: "-0.05em", color: R.white, lineHeight: 1 }}>Claude Code</div>
          </Rise>
        </div>
      </div>

      <Feature n={1} at={L.at(68)} top={500} accent={R.clay} title="Прямо в твоих файлах" sub="читает и правит проект" dir={-1}>
        {["page.tsx", "Hero.tsx", "globals.css"].map((f, i) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: RF.mono, fontSize: 24, color: R.ink }}>
            <FileIcon ext={f.split(".")[1]!} color={i === 2 ? R.clay : R.blue} size={26} />
            <span style={{ flex: 1 }}>{f}</span>
            {frame >= files + i * 4 && <Check at={files + i * 4} size={30} color={R.clay} />}
          </div>
        ))}
      </Feature>

      <Feature n={2} at={L.at(73)} top={830} accent={R.clay} title="Плагины и хуки" sub="зрелая система расширений">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {PARTS.map((t, i) => {
            const s = interpolate(frame, [plug + i * 3, plug + i * 3 + 8], [0, 1], { ...rclamp, easing: RE.pop });
            return (
              <Chip key={t} bg={i % 2 ? R.clayTint : R.clay} color={i % 2 ? R.ink : R.white} style={{ fontSize: 24, padding: "10px 18px", scale: s }}>
                {t}
              </Chip>
            );
          })}
        </div>
      </Feature>

      <Feature n={3} at={L.at(80)} top={1160} accent={R.clay} title="Качество кода" sub="хвалят в больших проектах" dir={-1}>
        {[
          { t: "-", c: "старый код" },
          { t: "+", c: "чище и короче" },
          { t: "+", c: "тесты прошли" },
        ].map((d, i) => {
          const on = interpolate(frame, [diff + i * 4, diff + i * 4 + 6], [0, 1], rclamp);
          return (
            <div
              key={i}
              style={{
                fontFamily: RF.mono,
                fontSize: 24,
                padding: "6px 12px",
                borderRadius: 10,
                background: d.t === "+" ? "#E3F6EA" : "#FCE4E1",
                color: d.t === "+" ? "#1E7A47" : "#B4362B",
                opacity: on,
                translate: `${(1 - on) * 20}px 0`,
                textDecoration: d.t === "-" ? "line-through" : "none",
              }}
            >
              {d.t} {d.c}
            </div>
          );
        })}
      </Feature>
      <Grain />
    </Part>
  );
};
