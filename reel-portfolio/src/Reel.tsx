import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Captions, Hud } from "./components/Overlay";
import { S1Hook } from "./scenes/S1Hook";
import { S2Flowers, S3Japonica, S4Waste } from "./scenes/Projects";
import { S5Wow } from "./scenes/S5Wow";
import { S6Perks } from "./scenes/S6Perks";
import { S7Cta } from "./scenes/S7Cta";
import { RT, sceneOf, type SceneId } from "./theme";

export const REEL_SCENES: { id: SceneId; component: React.FC }[] = [
  { id: "hook", component: S1Hook },
  { id: "flowers", component: S2Flowers },
  { id: "japonica", component: S3Japonica },
  { id: "waste", component: S4Waste },
  { id: "wow", component: S5Wow },
  { id: "perks", component: S6Perks },
  { id: "cta", component: S7Cta },
];

// Светлые поля: HUD рисуется тёмным.
const LIGHT: SceneId[] = ["flowers", "perks"];
// Сцены с настоящими экранами сайтов (каталоги — демо-данные).
const REAL: SceneId[] = ["flowers", "japonica", "waste", "wow"];
const sceneAt = (frame: number) => RT.scenes.find((s) => frame >= s.start && frame < s.end)?.id as SceneId | undefined;

/** Вертикальный рилс-портфолио (9:16): мои сайты, озвучка, субтитры, бит, призыв написать. */
export const Reel: React.FC<{ audio: boolean }> = ({ audio }) => (
  <AbsoluteFill style={{ background: "#0A0C0B" }}>
    {REEL_SCENES.map(({ id, component: Scene }) => {
      const s = sceneOf(id);
      return (
        <Sequence key={id} from={s.start} durationInFrames={s.end - s.start} name={s.title}>
          <Scene />
        </Sequence>
      );
    })}
    <Hud dark={(f) => LIGHT.includes(sceneAt(f) ?? "hook")} demo={(f) => REAL.includes(sceneAt(f) ?? "hook")} />
    <Captions />
    {audio && <Audio src={staticFile("reel/reel-audio.m4a")} />}
  </AbsoluteFill>
);

export const REEL_DURATION = RT.duration;
