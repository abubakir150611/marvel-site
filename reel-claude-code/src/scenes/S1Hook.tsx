import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Slam, Sticker } from "../components/Kinetic";
import { Canvas, ChatGlyph, TermGlyph, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 01 — хук: два окна «Claude» и «Claude Code», врезка VS, наклейка «не одно и то же». Первый кадр уже читается. */
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("hook");
  // Окна влетают с разных сторон; к кадру 0 они уже на полпути — превью ролика не пустое.
  const inL = interpolate(frame, [-6, 8], [0, 1], { ...rclamp, easing: RE.out });
  const inR = interpolate(frame, [-2, 12], [0, 1], { ...rclamp, easing: RE.out });
  const drift = Math.sin(frame / 22) * 6;
  // На «разницу» окна разъезжаются, освобождая место под плашку.
  const apart = interpolate(frame, [L.at(10), L.at(10) + 10], [0, 1], { ...rclamp, easing: RE.inOut });
  const head = interpolate(frame, [-10, 6], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 72, right: 72, top: 286, textAlign: "center", opacity: head, translate: `0 ${(1 - head) * 30}px` }}>
        <div style={{ fontFamily: RF.text, fontWeight: 800, fontSize: 40, color: R.gray, letterSpacing: "0.02em" }}>Все спрашивают:</div>
        <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 78, letterSpacing: "-0.04em", color: R.ink, lineHeight: 1.08, marginTop: 6 }}>
          что такое <span style={{ color: R.clay }}>Claude&nbsp;Code?</span>
        </div>
      </div>

      <Win
        title="Claude"
        icon={<ChatGlyph size={28} />}
        width={560}
        style={{ left: 50 - apart * 20, top: 560 + drift, rotate: `${-4 - apart * 2}deg`, translate: `${(1 - inL) * -900}px 0` }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: R.clayTint, borderRadius: "26px 26px 6px 26px", padding: "16px 24px", fontFamily: RF.ui, fontWeight: 700, fontSize: 30, color: R.ink }}>Как сделать сайт?</div>
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          {[0.92, 0.78, 0.86, 0.5].map((w, i) => (
            <div key={i} style={{ height: 22, width: `${w * 100}%`, borderRadius: 11, background: "#ECE8E1" }} />
          ))}
        </div>
        <div style={{ marginTop: 26, fontFamily: RF.mono, fontSize: 24, color: R.gray }}>отвечает текстом</div>
      </Win>

      <Win
        title="Claude Code"
        dark
        icon={<TermGlyph size={28} color="#2A2A30" />}
        width={580}
        style={{ left: 450 + apart * 20, top: 900 - drift, rotate: `${3 + apart * 2}deg`, translate: `${(1 - inR) * 900}px 0` }}
      >
        <div style={{ fontFamily: RF.mono, fontSize: 30, lineHeight: 1.7, color: "#E9E6DF" }}>
          <div>
            <span style={{ color: R.clay }}>❯</span> claude
          </div>
          <div style={{ color: "#9A968E" }}>● читаю проект…</div>
          <div style={{ color: "#9A968E" }}>● правлю 3 файла…</div>
          <div style={{ color: "#5BD38B" }}>✓ сайт опубликован</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: RF.mono, fontSize: 24, color: "#77736B" }}>делает работу</div>
      </Win>

      {/* VS — на втором «Клод» */}
      <div style={{ position: "absolute", left: 540 - 95, top: 845 }}>
        <Slam at={L.at(1)} from={2.2}>
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: 999,
              background: R.red,
              display: "grid",
              placeItems: "center",
              fontFamily: RF.display,
              fontWeight: 900,
              fontSize: 76,
              color: R.white,
              boxShadow: "0 24px 60px rgba(232,56,44,0.45), 0 0 0 10px rgba(255,255,255,0.9)",
            }}
          >
            VS
          </div>
        </Slam>
      </div>

      <Sticker at={L.at(5)} rotate={-6} bg={R.amber} style={{ left: 80, top: 1338, fontSize: 56 }}>
        ≠ не одно и то же
      </Sticker>
      <Sticker at={L.at(10)} rotate={5} bg={R.ink} color={R.white} style={{ right: 70, top: 1420, fontSize: 44, padding: "16px 26px 18px" }}>
        покажу разницу →
      </Sticker>
    </Canvas>
  );
};
