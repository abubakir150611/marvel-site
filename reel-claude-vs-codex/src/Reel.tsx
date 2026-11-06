import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Captions, Hud } from "./components/Overlay";
import { S1Hook } from "./scenes/S1Hook";
import { S2Who } from "./scenes/S2Who";
import { S3Common } from "./scenes/S3Common";
import { S4Codex } from "./scenes/S4Codex";
import { S5Claude } from "./scenes/S5Claude";
import { S6Cons } from "./scenes/S6Cons";
import { S7Price } from "./scenes/S7Price";
import { S8Verdict } from "./scenes/S8Verdict";
import { S9Final } from "./scenes/S9Final";
import { RT, sceneOf, type SceneId } from "./theme";

export const REEL_SCENES: { id: SceneId; component: React.FC }[] = [
  { id: "hook", component: S1Hook },
  { id: "who", component: S2Who },
  { id: "common", component: S3Common },
  { id: "codex", component: S4Codex },
  { id: "claude", component: S5Claude },
  { id: "cons", component: S6Cons },
  { id: "price", component: S7Price },
  { id: "verdict", component: S8Verdict },
  { id: "final", component: S9Final },
];

// Тёмные и насыщенные поля: HUD рисуется светлым.
const DARK: SceneId[] = ["hook", "codex", "claude"];
const sceneAt = (frame: number) => RT.scenes.find((s) => frame >= s.start && frame < s.end)?.id as SceneId | undefined;

/** Вертикальный рилс «Claude Code vs Codex» (9:16): 9 сцен, озвучка, субтитры, бит. */
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
