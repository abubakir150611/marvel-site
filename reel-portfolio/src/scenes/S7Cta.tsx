import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Slam, Sticker } from "../components/Kinetic";
import { Part } from "../components/Part";
import { Cursor, Grain } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** Кнопка-«контакт»: значок и подпись, выпрыгивает и пульсирует. */
const Contact: React.FC<{ at: number; label: string; sub: string; bg: string; icon: React.ReactNode; top: number; pressAt: number }> = ({ at, label, sub, bg, icon, top, pressAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - 2, at + 10], [0, 1], { ...rclamp, easing: RE.pop });
  const t = frame - pressAt;
  const press = t >= 0 && t < 8 ? Math.sin((t / 8) * Math.PI) * 0.05 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        height: 170,
        borderRadius: 40,
        background: bg,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "0 40px",
        color: R.white,
        boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
        scale: p * (1 - press) * (1 + Math.sin(frame / 9) * 0.01),
        opacity: frame < at - 2 ? 0 : 1,
      }}
    >
      <div style={{ width: 100, height: 100, borderRadius: 30, background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 60, letterSpacing: "-0.03em", lineHeight: 1 }}>{label}</div>
        <div style={{ fontFamily: RF.mono, fontSize: 26, opacity: 0.85, marginTop: 8 }}>{sub}</div>
      </div>
    </div>
  );
};

const Plane: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 24 24">
    <path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
const Tg: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 24 24">
    <path d="M21 4 L3 11 L9 13 L11 19 L14 15 L18 18 Z M9 13 L18 7 L11 15" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

/** 07 — призыв: «Хочешь такой сайт?», кнопки «Директ» и «Телеграм», стрелка «ссылка в профиле». */
export const S7Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("cta");
  const arrowAt = L.at(80);
  const bob = Math.sin(frame / 6) * 14;
  return (
    <Part from={0} color={R.clay}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 300 }}>
        <Slam at={-2} from={1.5}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 108, letterSpacing: "-0.05em", color: R.white, lineHeight: 0.98 }}>
            Хочешь
            <br />
            такой сайт?
          </div>
        </Slam>
        <Slam at={L.at(74)} from={1.5}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 72, color: R.ink, marginTop: 14 }}>пиши мне</div>
        </Slam>
      </div>
      <Contact at={L.at(76)} pressAt={L.at(76) + 10} top={800} label="Директ" sub="Instagram · сообщения" bg="linear-gradient(135deg, #8134AF, #DD2A7B 55%, #F58529)" icon={<Plane />} />
      <Contact at={L.at(79)} pressAt={L.at(79) + 10} top={1010} label="Телеграм" sub="ссылка в профиле" bg="#2AABEE" icon={<Tg />} />
      <Cursor
        hideBefore={L.at(76)}
        keys={[
          { f: L.at(76), x: 760, y: 1300 },
          { f: L.at(76) + 10, x: 620, y: 880, click: true },
          { f: L.at(79) + 10, x: 640, y: 1090, click: true },
          { f: L.at(79) + 26, x: 700, y: 1160 },
        ]}
      />
      {frame >= arrowAt && (
        <div style={{ position: "absolute", right: 90, top: 1250 + bob, display: "flex", alignItems: "center", gap: 16, opacity: interpolate(frame, [arrowAt, arrowAt + 6], [0, 1], rclamp) }}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 110, color: R.white, lineHeight: 1 }}>↑</div>
        </div>
      )}
      <Sticker at={arrowAt} rotate={-5} bg={R.amber} style={{ left: 70, top: 1300, fontSize: 50 }}>
        ссылка в профиле
      </Sticker>
      <Grain />
    </Part>
  );
};
