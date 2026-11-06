import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { R, RE, RF, rclamp } from "../theme";

/** Сплошное цветовое поле на весь кадр. */
export const Field: React.FC<{ color: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ color, children, style }) => (
  <div style={{ position: "absolute", inset: 0, background: color, overflow: "hidden", ...style }}>{children}</div>
);

/** Детерминированная «тряска» после удара: затухает за ~8 кадров. */
export const shake = (frame: number, at: number, power = 14) => {
  const t = frame - at;
  if (t < 0 || t > 10) return "0px 0px";
  const k = power * (1 - t / 10);
  return `${Math.sin(t * 7.3) * k}px ${Math.cos(t * 5.1) * k}px`;
};

/** Слово «врезается» в кадр: из увеличения в норму с лёгкой тряской. */
export const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 1.7 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <div style={{ opacity: frame < at ? 0 : interpolate(frame, [at, at + 2], [0, 1], rclamp), scale: interpolate(p, [0, 1], [from, 1]), translate: shake(frame, at + 6, 10), ...style }}>
      {children}
    </div>
  );
};

/** Строка выезжает из-под маски (вверх), уходит вверх. */
export const Rise: React.FC<{ at: number; exit?: number; children: React.ReactNode; style?: React.CSSProperties; dur?: number }> = ({ at, exit, children, style, dur = 10 }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [at, at + dur], [110, 0], { ...rclamp, easing: RE.out }) + (exit === undefined ? 0 : interpolate(frame, [exit, exit + 8], [0, -110], { ...rclamp, easing: RE.in }));
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.06em", marginBottom: "-0.06em" }}>
      <div style={{ translate: `0 ${y}%`, ...style }}>{children}</div>
    </div>
  );
};

/** Наклейка с крупной цифрой: выпрыгивает с перелётом и чуть покачивается. */
export const Sticker: React.FC<{
  at: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  exit?: number;
}> = ({ at, children, bg = R.amber, color = R.ink, rotate = -4, style, exit }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 9], [0, 1], { ...rclamp, easing: RE.pop });
  const out = exit === undefined ? 1 : interpolate(frame, [exit, exit + 6], [1, 0], { ...rclamp, easing: RE.in });
  return (
    <div
      style={{
        position: "absolute",
        background: bg,
        color,
        padding: "18px 30px 20px",
        borderRadius: 22,
        fontFamily: RF.display,
        fontWeight: 800,
        fontSize: 64,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        scale: s * out,
        rotate: `${rotate + Math.sin((frame - at) / 14) * 1.2}deg`,
        opacity: frame < at ? 0 : 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Хлёсткий вход части сцены: сдвиг с наклоном, как «свайп» камеры. */
export const whipIn = (frame: number, at: number, dir: 1 | -1 = 1): React.CSSProperties => {
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...rclamp, easing: RE.out });
  return { translate: `${(1 - p) * 100 * dir}% 0`, transform: `skewX(${(1 - p) * -14 * dir}deg)` };
};

/** Число «набегает» до значения (только отображение: значение берётся из данных). */
export const Count: React.FC<{ from: number; to: number; at: number; dur: number; decimals?: number; suffix?: string }> = ({ from, to, at, dur, decimals = 0, suffix = "" }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [from, to], { ...rclamp, easing: RE.out });
  const text = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v).replace(/\u00a0/g, "\u202f");
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {text}
      {suffix}
    </span>
  );
};

/** Телефон с настоящим мобильным экраном приложения. scrollY — в CSS-пикселях страницы (ширина 412). */
export const Phone: React.FC<{
  width: number;
  src?: string;
  scrollY?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  screenHeight?: number;
}> = ({ width, src, scrollY = 0, children, style, screenHeight }) => {
  const bezel = Math.round(width * 0.032);
  const sw = width - bezel * 2;
  const sh = screenHeight ?? Math.round((sw * 915) / 412);
  const s = sw / 412;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height: sh + bezel * 2,
        borderRadius: width * 0.13,
        background: "#0B0C0C",
        padding: bezel,
        boxShadow: "0 60px 120px rgba(0,0,0,0.38), 0 0 0 2px rgba(255,255,255,0.08) inset",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: sw, height: sh, borderRadius: width * 0.1, overflow: "hidden", background: "#F6F7F5" }}>
        {src && <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: sw, translate: `0 ${-scrollY * s}px` }} />}
        {children}
        {/* «Островок» камеры */}
        <div style={{ position: "absolute", top: sw * 0.025, left: "50%", translate: "-50% 0", width: sw * 0.3, height: sw * 0.075, borderRadius: 99, background: "#0B0C0C" }} />
      </div>
    </div>
  );
};

/** Рамка-выделение на экране телефона (координаты в CSS-пикселях страницы). */
export const PhoneMark: React.FC<{ rect: { x: number; y: number; w: number; h: number }; scrollY: number; screenWidth: number; at: number; exit?: number; color?: string }> = ({
  rect,
  scrollY,
  screenWidth,
  at,
  exit,
  color = R.amber,
}) => {
  const frame = useCurrentFrame();
  const s = screenWidth / 412;
  const draw = interpolate(frame, [at, at + 12], [1, 0], { ...rclamp, easing: RE.inOut });
  const op = interpolate(frame, [at, at + 3], [0, 1], rclamp) * (exit === undefined ? 1 : interpolate(frame, [exit, exit + 6], [1, 0], rclamp));
  const pad = 8;
  const w = rect.w * s + pad * 2;
  const h = rect.h * s + pad * 2;
  return (
    <svg style={{ position: "absolute", left: rect.x * s - pad, top: (rect.y - scrollY) * s - pad, width: w, height: h, overflow: "visible", opacity: op }} viewBox={`0 0 ${w} ${h}`}>
      <rect x={0} y={0} width={w} height={h} rx={16} fill={`${color}22`} stroke={color} strokeWidth={5} pathLength={1} strokeDasharray={draw > 0.001 ? "1" : undefined} strokeDashoffset={draw > 0.001 ? draw : undefined} />
    </svg>
  );
};
