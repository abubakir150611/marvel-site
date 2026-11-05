import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Rise, Slam, Sticker } from "../components/Kinetic";
import { Appear, Canvas, Caret, Cursor, typed, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

const Heart: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.9 3.8 4.3 7.3C19.5 16.4 12 21 12 21z" fill={on ? R.red : "none"} stroke={on ? R.red : R.gray} strokeWidth="2" />
  </svg>
);
const Plane: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24">
    <path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z" fill="none" stroke={R.white} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

/** 09 — призыв: «Напиши КЛОД» + комментарий печатается и отправляется, приходит сообщение в Директ. */
export const S9Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("cta");
  const typeFrom = L.at(100);
  const typeTo = L.at(102) + 4;
  const sendAt = typeTo + 6;
  const dmAt = Math.max(sendAt + 16, L.at(105));
  const sent = frame >= sendAt;
  const pulse = 1 + Math.sin(frame / 7) * 0.025;
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 60, right: 60, top: 280, textAlign: "center" }}>
        <Rise at={L.at(98) - 2}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 84, letterSpacing: "-0.04em", color: R.ink }}>Напиши</div>
        </Rise>
        <Slam at={L.at(102)} from={2.2}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 230, letterSpacing: "-0.05em", color: R.clay, lineHeight: 0.95, scale: pulse }}>КЛОД</div>
        </Slam>
        <Rise at={L.at(100)}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 66, color: R.ink, marginTop: 8 }}>в комментариях ↓</div>
        </Rise>
      </div>

      <Win title="Комментарии" width={940} clicks={[sendAt]} style={{ left: 70, top: 820, translate: `0 ${interpolate(frame, [0, 12], [500, 0], { ...rclamp, easing: RE.out })}px` }} pad={26}>
        {sent && (
          <Appear at={sendAt} style={{ display: "flex", alignItems: "center", gap: 18, padding: "6px 6px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: `linear-gradient(135deg, ${R.amber}, ${R.clay})`, display: "grid", placeItems: "center", fontFamily: RF.display, fontWeight: 800, fontSize: 26, color: R.white }}>ты</div>
            <div style={{ flex: 1, fontFamily: RF.ui, fontSize: 34, color: R.ink }}>
              <b>ты</b> <span style={{ fontWeight: 800, color: R.clay }}>Клод</span>
            </div>
            <Heart on={frame >= sendAt + 10} />
          </Appear>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: R.row, borderRadius: 999, padding: "14px 14px 14px 30px" }}>
          <div style={{ flex: 1, fontFamily: RF.ui, fontWeight: 700, fontSize: 36, color: R.ink }}>
            {sent ? (
              <span style={{ color: R.gray }}>Добавьте комментарий…</span>
            ) : frame >= typeFrom ? (
              <>
                {typed("Клод", frame, typeFrom, typeTo)}
                <Caret h={36} />
              </>
            ) : (
              <span style={{ color: R.gray }}>Добавьте комментарий…</span>
            )}
          </div>
          <div style={{ width: 72, height: 72, borderRadius: 99, background: R.clay, display: "grid", placeItems: "center" }}>
            <Plane />
          </div>
        </div>
      </Win>

      {/* Сообщение в Директ */}
      {frame >= dmAt && (
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 1180,
            translate: `0 ${interpolate(frame, [dmAt, dmAt + 12], [-60, 0], { ...rclamp, easing: RE.pop })}px`,
            opacity: interpolate(frame, [dmAt, dmAt + 5], [0, 1], rclamp),
            background: R.ink,
            color: R.white,
            borderRadius: 30,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            boxShadow: "0 30px 70px rgba(20,20,19,0.35)",
          }}
        >
          <div style={{ width: 76, height: 76, borderRadius: 22, background: R.clay, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Plane />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: RF.mono, fontSize: 22, color: "rgba(255,255,255,0.6)" }}>ДИРЕКТ · сейчас</div>
            <div style={{ fontFamily: RF.ui, fontWeight: 700, fontSize: 32, marginTop: 4 }}>Держи инструкцию по Claude Code</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: R.red, display: "grid", placeItems: "center", fontFamily: RF.ui, fontWeight: 800, fontSize: 24 }}>1</div>
        </div>
      )}
      <Sticker at={dmAt + 8} rotate={-5} bg={R.amber} style={{ left: 90, top: 1380, fontSize: 46 }}>
        пришлю в личку
      </Sticker>
      <Cursor
        hideBefore={typeTo - 14}
        hideAfter={dmAt + 4}
        keys={[
          { f: typeTo - 14, x: 760, y: 1300 },
          { f: sendAt, x: 930, y: 950, click: true },
          { f: sendAt + 16, x: 960, y: 1010 },
        ]}
      />
    </Canvas>
  );
};
