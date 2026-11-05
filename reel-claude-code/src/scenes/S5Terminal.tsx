import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { shake, Sticker } from "../components/Kinetic";
import { Btn, Canvas, Caret, Check, SectionTitle, TermGlyph, typed, Win } from "../components/Ui";
import { local, R, RE, RF, rclamp } from "../theme";

/** 05 — терминал: сборка падает с ошибкой, Claude Code чинит (полоса выполнения), повторный запуск зелёный. */
export const S5Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("terminal");
  const run1 = L.at(50) - 2;
  const errAt = L.at(54);
  const fixFrom = L.at(56);
  // Сцена короткая: исправление и повторный запуск укладываются до конца сцены.
  const fixTo = Math.min(L.len - 24, Math.max(fixFrom + 12, L.at(58)));
  const run2 = fixTo + 1;
  const okAt = Math.min(L.len - 10, Math.max(run2 + 8, L.at(61)));
  const fix = interpolate(frame, [fixFrom, fixTo], [0, 1], { ...rclamp, easing: RE.inOut });
  const flash = interpolate(frame, [errAt, errAt + 10], [1, 0], rclamp);
  const line = (show: boolean, children: React.ReactNode, color = "#E9E6DF") =>
    show ? <div style={{ color, whiteSpace: "pre", minHeight: 52 }}>{children}</div> : null;
  return (
    <Canvas>
      <SectionTitle n="3" title="Терминал и тесты" sub="сам запускает — сам чинит" at={0} />

      <Win
        title="Терминал — claude"
        dark
        icon={<TermGlyph size={26} color="#2A2A30" />}
        width={940}
        clicks={[errAt, okAt]}
        style={{ left: 70, top: 500, translate: shake(frame, errAt, 12) }}
      >
        <div style={{ fontFamily: RF.mono, fontSize: 31, lineHeight: 1.65, minHeight: 690 }}>
          {line(
            frame >= run1,
            <>
              <span style={{ color: R.clay }}>❯</span> {typed("npm run build && npm test", frame, run1, run1 + 18)}
              {frame < run1 + 22 && <Caret color="#E9E6DF" h={30} />}
            </>,
          )}
          {line(frame >= run1 + 22, "  ▸ компиляция…", "#9A968E")}
          {line(
            frame >= errAt,
            <span style={{ background: `rgba(232,56,44,${0.25 + flash * 0.5})`, borderRadius: 8, padding: "2px 8px", color: "#FF8A80" }}>✗ Ошибка: Hero.tsx, строка 14</span>,
          )}
          {line(frame >= fixFrom, <span style={{ color: R.clay }}>● Claude: нашёл причину, исправляю</span>)}
          {frame >= fixFrom && (
            <div style={{ margin: "10px 0 18px" }}>
              <Btn label="Исправить" busy="Исправляю…" done="Исправлено ✓" progress={fix} color={fix >= 1 ? R.green : R.clay} />
            </div>
          )}
          {line(
            frame >= run2,
            <>
              <span style={{ color: R.clay }}>❯</span> {typed("npm run build && npm test", frame, run2, run2 + 6)}
            </>,
          )}
          {line(frame >= okAt, "✓ сборка прошла · тесты зелёные", "#5BD38B")}
        </div>
      </Win>

      {frame >= okAt && (
        <div style={{ position: "absolute", left: 540 - 80, top: 1250 }}>
          <Check at={okAt} size={160} />
        </div>
      )}
      <Sticker at={errAt + 2} exit={fixFrom + 4} rotate={-6} bg={R.red} color={R.white} style={{ right: 70, top: 1300, fontSize: 52 }}>
        ошибка?
      </Sticker>
      <Sticker at={okAt + 4} rotate={5} bg={R.green} color={R.white} style={{ left: 70, top: 1400, fontSize: 52 }}>
        починил сам
      </Sticker>
    </Canvas>
  );
};
