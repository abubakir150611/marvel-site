import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { RE, rclamp } from "../theme";
import { Phone } from "./Kinetic";
import { Screens, type Shot } from "./Screens";

/** Телефон с настоящими экранами сайта; въезжает снизу в кадре enter и чуть покачивается. */
export const SitePhone: React.FC<{
  width: number;
  screenHeight: number;
  shots: Shot[];
  left: number;
  top: number;
  rotate?: number;
  enter?: number;
  from?: number;
}> = ({ width, screenHeight, shots, left, top, rotate = 0, enter = 0, from = 900 }) => {
  const frame = useCurrentFrame();
  const sw = width - Math.round(width * 0.032) * 2;
  const p = interpolate(frame, [enter - 4, enter + 12], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <Phone
      width={width}
      screenHeight={screenHeight}
      style={{ left, top, rotate: `${rotate + Math.sin(frame / 26) * 0.8}deg`, translate: `0 ${(1 - p) * from}px` }}
    >
      <Screens shots={shots} width={sw} />
    </Phone>
  );
};
