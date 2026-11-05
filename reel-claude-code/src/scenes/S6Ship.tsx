import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Phone, Sticker } from "../components/Kinetic";
import { Appear, Btn, Canvas, Check, Cursor, Row, SectionTitle, TermGlyph, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 06 — коммит → GitHub → публикация: одна кнопка проходит три стадии (как в референсе), затем телефон с живым сайтом. */
export const S6Ship: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("ship");
  const c1 = L.at(63) - 2;
  const c2 = Math.max(L.at(65), c1 + 20);
  const c3 = Math.max(L.at(69), c2 + 22);
  const p1 = interpolate(frame, [c1 + 2, c1 + 14], [0, 1], { ...rclamp, easing: RE.inOut });
  const p2 = interpolate(frame, [c2 + 2, c2 + 16], [0, 1], { ...rclamp, easing: RE.inOut });
  const p3 = interpolate(frame, [c3 + 2, c3 + 22], [0, 1], { ...rclamp, easing: RE.inOut });
  const d1 = c1 + 15;
  const d2 = c2 + 17;
  const d3 = c3 + 23;
  const btn =
    frame < c2 ? (
      <Btn label="Сделать коммит" busy="Коммит…" done="Коммит готов ✓" progress={frame < c1 + 2 ? 0 : p1} color={p1 >= 1 ? R.green : R.clay} />
    ) : frame < c3 ? (
      <Btn label="Отправить на GitHub" busy="Отправляю…" done="Отправлено ✓" progress={frame < c2 + 2 ? 0 : p2} color={p2 >= 1 ? R.green : R.clay} />
    ) : (
      <Btn label="Опубликовать сайт" busy="Публикую…" done="Сайт в интернете ✓" progress={frame < c3 + 2 ? 0 : p3} color={p3 >= 1 ? R.green : R.clay} />
    );
  const phoneIn = interpolate(frame, [d3 - 4, d3 + 12], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <Canvas>
      <SectionTitle n="4" title="GitHub и деплой" sub="сам выкладывает сайт в интернет" at={0} />

      <Win title="Claude Code" icon={<TermGlyph size={26} />} width={940} clicks={[c1, c2, c3]} style={{ left: 70, top: 500 }}>
        <Row icon={<span style={{ fontFamily: RF.mono, fontSize: 30, color: R.clay }}>⎇</span>} text="marvel-site · main" mono meta="3 файла изменено" />
        <div style={{ marginTop: 20 }}>{btn}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20, minHeight: 300 }}>
          {frame >= d1 && (
            <Appear at={d1}>
              <Row icon={<Check at={d1} size={40} />} text="Коммит: «Новый главный экран»" bg={R.greenTint} color="#1E7A47" />
            </Appear>
          )}
          {frame >= d2 && (
            <Appear at={d2}>
              <Row icon={<Check at={d2} size={40} />} text="Отправлено на GitHub" meta="main" bg={R.greenTint} color="#1E7A47" />
            </Appear>
          )}
          {frame >= d3 && (
            <Appear at={d3}>
              <Row icon={<Check at={d3} size={40} />} text="Сайт опубликован" meta="онлайн" bg={R.greenTint} color="#1E7A47" />
            </Appear>
          )}
        </div>
      </Win>

      <Cursor
        hideBefore={L.at(62) - 6}
        hideAfter={d3 + 6}
        keys={[
          { f: L.at(62) - 6, x: 760, y: 1250 },
          { f: c1, x: 560, y: 740, click: true },
          { f: c1 + 12, x: 600, y: 770 },
          { f: c2, x: 540, y: 745, click: true },
          { f: c2 + 12, x: 590, y: 775 },
          { f: c3, x: 530, y: 742, click: true },
          { f: c3 + 16, x: 620, y: 800 },
        ]}
      />

      {/* Настоящий экран сайта marvel-site (снят Playwright, вьюпорт 412×915) */}
      {frame >= d3 - 4 && (
        <Phone
          width={400}
          src="screens/site-1.png"
          screenHeight={610}
          scrollY={150}
          style={{ left: 600, top: 858, rotate: `${6 - phoneIn * 2}deg`, translate: `0 ${(1 - phoneIn) * 900}px` }}
        />
      )}
      <Sticker at={d3 + 6} rotate={-6} bg={R.amber} style={{ left: 70, top: 1330, fontSize: 52 }}>
        сайт уже онлайн
      </Sticker>
    </Canvas>
  );
};
