import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClaudeMark, CodexMark } from "../components/Brand";
import { Sticker } from "../components/Kinetic";
import { Canvas, Check, SectionTitle, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 03 — что общего: у обоих одинаковые базовые умения, галочки щёлкают на словах озвучки. */
export const S3Common: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("common");
  const rows: { label: string; at: number }[] = [
    { label: "Сами пишут и правят код", at: L.at(33) },
    { label: "Работают в терминале", at: L.at(39) },
    { label: "В редакторе кода (IDE)", at: L.at(41) },
    { label: "В облаке", at: L.at(44) },
  ];
  return (
    <Canvas>
      <SectionTitle n="=" title="Что общего?" sub="база у обоих одинаковая" at={0} />
      <Win title="сравнение" width={940} style={{ left: 70, top: 520 }} pad={26}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 0, padding: "0 10px 14px", borderBottom: `2px solid ${R.line}` }}>
          {[<ClaudeMark key="a" size={52} />, <CodexMark key="b" size={52} />].map((m, i) => (
            <div key={i} style={{ width: 150, display: "flex", justifyContent: "center" }}>
              {m}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          const on = interpolate(frame, [r.at - 4, r.at + 4], [0, 1], { ...rclamp, easing: RE.out });
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", padding: "24px 10px", borderBottom: i < rows.length - 1 ? `2px solid ${R.line}` : "none", opacity: 0.25 + on * 0.75 }}>
              <div style={{ flex: 1, fontFamily: RF.ui, fontWeight: 700, fontSize: 36, color: R.ink }}>{r.label}</div>
              <div style={{ width: 150, display: "flex", justifyContent: "center" }}>
                <Check at={r.at} size={54} color={R.clay} />
              </div>
              <div style={{ width: 150, display: "flex", justifyContent: "center" }}>
                <Check at={r.at + 3} size={54} color={R.codex} />
              </div>
            </div>
          );
        })}
      </Win>
      <Sticker at={L.at(44) + 6} rotate={-5} bg={R.amber} style={{ left: 80, top: 1330, fontSize: 52 }}>
        тут ничья
      </Sticker>
    </Canvas>
  );
};
