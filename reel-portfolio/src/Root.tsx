import React from "react";
import { Composition, Folder } from "remotion";
import "./fonts";
import { REEL_DURATION, REEL_SCENES, Reel } from "./Reel";
import { RT, sceneOf } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PortfolioReel" component={Reel} durationInFrames={REEL_DURATION} fps={RT.fps} width={RT.width} height={RT.height} defaultProps={{ audio: true }} />
    <Folder name="Scenes">
      {REEL_SCENES.map(({ id, component }) => (
        <Composition key={id} id={`scene-${id}`} component={component} durationInFrames={sceneOf(id).end - sceneOf(id).start} fps={RT.fps} width={RT.width} height={RT.height} />
      ))}
    </Folder>
  </>
);
