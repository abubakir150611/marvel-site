import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Slam, Sticker } from "../components/Kinetic";
import { Part } from "../components/Part";
import { SitePhone } from "../components/SitePhone";
import { Grain } from "../components/Ui";
import { local, R, RF, rclamp } from "../theme";

/** 01 — хук: «Делаю сайты для бизнеса» и веер из четырёх телефонов с настоящими сайтами. */
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("hook");
  const spread = interpolate(frame, [0, 18], [0, 1], rclamp);
  const phones = [
    { src: "screens/fl-home.jpg", r: -14, x: -10 },
    { src: "screens/jp-home.jpg", r: -5, x: 225 },
    { src: "screens/wz-dashboard.jpg", r: 5, x: 460 },
    { src: "screens/mv-0.jpg", r: 14, x: 695 },
  ];
  return (
    <Part from={0} color={R.black}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 270 }}>
        <Slam at={-4} from={1.4}>
          <div style={{ fontFamily: RF.display, fontWeight: 900, fontSize: 112, letterSpacing: "-0.05em", color: R.white, lineHeight: 0.98 }}>
            Делаю
            <br />
            сайты
          </div>
        </Slam>
        <Slam at={L.at(2)} from={1.6}>
          <div style={{ fontFamily: RF.serif, fontStyle: "italic", fontSize: 84, color: R.amber, marginTop: 6 }}>для бизнеса</div>
        </Slam>
      </div>
      {phones.map((ph, i) => (
        <SitePhone
          key={ph.src}
          width={330}
          screenHeight={620}
          shots={[{ src: ph.src, from: 0, scroll: [0, 220] }]}
          left={420 + (ph.x - 420) * spread}
          top={790 + Math.abs(i - 1.5) * 40 * spread}
          rotate={ph.r * spread}
          enter={-6 + i * 2}
        />
      ))}
      <Sticker at={L.at(4)} rotate={-5} bg={R.amber} style={{ left: 70, top: 690, fontSize: 48 }}>
        мои проекты
      </Sticker>
      <Sticker at={L.at(7)} rotate={5} bg={R.white} style={{ right: 60, top: 1420, fontSize: 44 }}>
        смотри до конца ↓
      </Sticker>
      <Grain />
    </Part>
  );
};
