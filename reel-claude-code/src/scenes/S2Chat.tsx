import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Sticker } from "../components/Kinetic";
import { Appear, Canvas, Caret, ChatGlyph, Cursor, FileIcon, SectionTitle, typed, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const CODE = ['<header class="hero">', "  <h1>Marvel</h1>", "  <nav>…</nav>", "</header>"];

/** 02 — обычный Claude: вопрос в чате, ответ с кодом, «Копировать» и ручная вставка в редактор. */
export const S2Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("chat");
  const ask = "Сделай мне сайт про Marvel";
  const askFrom = L.at(18) - 4;
  const askTo = L.at(19) + 16;
  const answerAt = L.at(20);
  const copyAt = L.at(24);
  const pasteAt = L.at(26) + 6;
  const copied = frame >= copyAt;
  // Окно чата чуть уезжает вверх, когда снизу появляется редактор.
  const lift = interpolate(frame, [L.at(25), L.at(25) + 12], [0, -40], { ...rclamp, easing: RE.inOut });
  const pasted = Math.round(interpolate(frame, [pasteAt + 2, pasteAt + 10], [0, CODE.length], rclamp));
  return (
    <Canvas>
      <SectionTitle n="1" title="Обычный Claude" sub="живёт в чате и отвечает" at={0} />

      <Win title="Claude · чат" icon={<ChatGlyph size={26} />} width={940} style={{ left: 70, top: 500 + lift }} clicks={[copyAt]}>
        <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 78 }}>
          {frame >= askFrom && (
            <div style={{ background: R.clayTint, borderRadius: "28px 28px 8px 28px", padding: "18px 26px", fontFamily: RF.ui, fontWeight: 700, fontSize: 34, color: R.ink }}>
              {typed(ask, frame, askFrom, askTo)}
              {frame < askTo + 6 && <Caret h={34} />}
            </div>
          )}
        </div>
        <Appear at={answerAt} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: RF.ui, fontWeight: 600, fontSize: 32, color: R.ink, marginBottom: 16 }}>Вот код для сайта. Скопируй его:</div>
          <div style={{ position: "relative", background: R.term, borderRadius: 22, padding: "24px 28px", fontFamily: RF.mono, fontSize: 28, lineHeight: 1.6, color: "#E9E6DF" }}>
            {CODE.map((line, i) => (
              <div key={i} style={{ opacity: interpolate(frame, [answerAt + 4 + i * 3, answerAt + 8 + i * 3], [0, 1], rclamp), whiteSpace: "pre" }}>
                {line}
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                right: 18,
                top: 18,
                padding: "10px 18px",
                borderRadius: 14,
                background: copied ? R.green : "#2E2E35",
                color: R.white,
                fontFamily: RF.ui,
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              {copied ? "Скопировано ✓" : "Копировать"}
            </div>
          </div>
        </Appear>
      </Win>

      {/* Редактор пользователя: вставлять приходится самому */}
      {frame >= L.at(25) && (
        <Win
          title="твой редактор"
          width={640}
          clicks={[pasteAt]}
          style={{
            left: 380,
            top: 1090,
            rotate: "2deg",
            translate: `0 ${interpolate(frame, [L.at(25), L.at(25) + 12], [500, 0], { ...rclamp, easing: RE.out })}px`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: RF.ui, fontWeight: 700, fontSize: 28, color: R.ink, marginBottom: 14 }}>
            <FileIcon ext="html" color={R.clay} size={30} />
            index.html
          </div>
          <div style={{ background: R.row, borderRadius: 16, padding: "16px 20px", fontFamily: RF.mono, fontSize: 24, lineHeight: 1.5, color: R.ink, minHeight: 160 }}>
            {pasted === 0 ? <span style={{ color: R.gray }}>пусто…</span> : CODE.slice(0, pasted).map((l, i) => <div key={i} style={{ whiteSpace: "pre" }}>{l}</div>)}
          </div>
        </Win>
      )}

      <Cursor
        hideBefore={L.at(22)}
        keys={[
          { f: L.at(22), x: 640, y: 1500 },
          { f: copyAt - 2, x: 900, y: 790, click: true },
          { f: L.at(25) + 6, x: 900, y: 800 },
          { f: pasteAt, x: 700, y: 1330, click: true },
          { f: pasteAt + 30, x: 730, y: 1360 },
        ]}
      />

      <Sticker at={L.at(24) + 4} rotate={-7} bg={R.amber} style={{ left: 60, top: 1130, fontSize: 50 }}>
        Ctrl+C → Ctrl+V
      </Sticker>
      <Sticker at={L.at(27)} rotate={6} bg={R.red} color={R.white} style={{ left: 90, top: 1290, fontSize: 46 }}>
        всё вручную
      </Sticker>
    </Canvas>
  );
};
