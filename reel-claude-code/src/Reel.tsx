import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Captions, Hud } from "./components/Overlay";
import { S1Hook } from "./scenes/S1Hook";
import { S2Chat } from "./scenes/S2Chat";
import { S3Turn } from "./scenes/S3Turn";
import { S4Project } from "./scenes/S4Project";
import { S5Terminal } from "./scenes/S5Terminal";
import { S6Ship } from "./scenes/S6Ship";
import { S7Cloud } from "./scenes/S7Cloud";
import { S8Summary } from "./scenes/S8Summary";
import { S9Cta } from "./scenes/S9Cta";
import { RT, sceneOf, type SceneId } from "./theme";

export const REEL_SCENES: { id: SceneId; component: React.FC }[] = [
  { id: "hook", component: S1Hook },
  { id: "chat", component: S2Chat },
  { id: "turn", component: S3Turn },
  { id: "project", component: S4Project },
  { id: "terminal", component: S5Terminal },
  { id: "ship", component: S6Ship },
  { id: "cloud", component: S7Cloud },
  { id: "summary", component: S8Summary },
  { id: "cta", component: S9Cta },
];

// Тёмные поля (поворот, облако): HUD рисуется светлым.
const DARK: SceneId[] = ["turn", "cloud"];
const sceneAt = (frame: number) => RT.scenes.find((s) => frame >= s.start && frame < s.end)?.id as SceneId | undefined;

/** Вертикальный рилс «Claude vs Claude Code» (9:16): 9 сцен, озвучка, субтитры, бит. */
export const Reel: React.FC<{ audio: boolean }> = ({ audio }) => (
  <AbsoluteFill style={{ background: "#EFECE6" }}>
    {REEL_SCENES.map(({ id, component: Scene }) => {
      const s = sceneOf(id);
      return (
        <Sequence key={id} from={s.start} durationInFrames={s.end - s.start} name={s.title}>
          <Scene />
        </Sequence>
      );
    })}
    <Hud dark={(f) => !DARK.includes(sceneAt(f) ?? "hook")} demo={() => false} />
    <Captions />
    {audio && <Audio src={staticFile("reel/reel-audio.m4a")} />}
  </AbsoluteFill>
);

export const REEL_DURATION = RT.duration;
