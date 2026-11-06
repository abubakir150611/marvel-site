import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { R, RE, RF, rclamp } from "../theme";

/**
 * «Интерфейсный» словарь ролика: светлый холст, белые окна с кнопками-светофором,
 * терракотовые кнопки, курсор с кликами, строки файлов и зелёные галочки.
 * Всё нарисовано кодом — это иллюстрация интерфейса, а не снимок чужого продукта.
 */

/** Светлый холст с точечной сеткой и мягкой виньеткой. */
export const Canvas: React.FC<{ children?: React.ReactNode; color?: string }> = ({ children, color = R.canvas }) => (
  <div style={{ position: "absolute", inset: 0, background: color, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(20,20,19,0.13) 1.6px, transparent 1.8px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 100%)",
      }}
    />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(255,255,255,0.55), transparent 70%)" }} />
    {children}
  </div>
);

/** Зерно плёнки поверх кадра: четыре текстуры по кругу, едва заметно. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile(`fx/grain-${Math.floor(frame / 2) % 4}.jpg`)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity, mixBlendMode: "overlay", pointerEvents: "none" }}
    />
  );
};

/** Заголовок раздела, как в референсе: красный кружок с номером, жирное название, серая подпись. */
export const SectionTitle: React.FC<{ n: string; title: string; sub?: string; at: number; top?: number; dark?: boolean }> = ({ n, title, sub, at, top = 300, dark }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...rclamp, easing: RE.out });
  const c = interpolate(frame, [at, at + 10], [0, 1], { ...rclamp, easing: RE.pop });
  const sp = interpolate(frame, [at + 5, at + 17], [0, 1], { ...rclamp, easing: RE.out });
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 99,
            background: R.red,
            color: R.white,
            display: "grid",
            placeItems: "center",
            fontFamily: RF.display,
            fontWeight: 800,
            fontSize: 34,
            scale: c,
            boxShadow: "0 8px 20px rgba(232,56,44,0.35)",
          }}
        >
          {n}
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 6 }}>
          <div style={{ fontFamily: RF.display, fontWeight: 800, fontSize: 60, letterSpacing: "-0.03em", color: dark ? R.white : R.ink, translate: `0 ${(1 - p) * 110}%`, lineHeight: 1.1 }}>
            {title}
          </div>
        </div>
      </div>
      {sub && (
        <div style={{ fontFamily: RF.text, fontWeight: 700, fontSize: 34, color: dark ? "rgba(255,255,255,0.7)" : R.gray, marginTop: 10, opacity: sp, translate: `0 ${(1 - sp) * 20}px` }}>
          {sub}
        </div>
      )}
    </div>
  );
};

/** Нажатие: окно чуть «проседает» и наклоняется в момент клика (как в референсе). */
export const pressTilt = (frame: number, clicks: number[]) => {
  let s = 0;
  for (const c of clicks) {
    const t = frame - c;
    if (t >= 0 && t < 16) s = Math.max(s, Math.sin((t / 16) * Math.PI) * (1 - t / 22));
  }
  return { scale: 1 - s * 0.035, rx: s * 9, ry: -s * 7 };
};

/** Белое окно приложения со «светофором» и заголовком. */
export const Win: React.FC<{
  title: string;
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  clicks?: number[];
  dark?: boolean;
  icon?: React.ReactNode;
  pad?: number;
}> = ({ title, width, children, style, clicks = [], dark, icon, pad = 28 }) => {
  const frame = useCurrentFrame();
  const t = pressTilt(frame, clicks);
  return (
    <div style={{ position: "absolute", width, perspective: 1600, ...style }}>
      <div
        style={{
          background: dark ? R.term : R.paper,
          borderRadius: 34,
          padding: pad,
          paddingTop: 22,
          boxShadow: dark
            ? "0 40px 90px rgba(10,12,11,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset"
            : "0 40px 90px rgba(60,50,35,0.16), 0 6px 18px rgba(60,50,35,0.08), 0 0 0 1px rgba(20,20,19,0.04)",
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.scale})`,
          transformOrigin: "50% 60%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 18, height: 18, borderRadius: 99, background: c, display: "inline-block" }} />
          ))}
          <span style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 10, fontFamily: RF.ui, fontWeight: 600, fontSize: 26, color: dark ? "rgba(255,255,255,0.55)" : R.gray }}>
            {icon}
            {title}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Появление элемента: выезд снизу с пружиной. */
export const Appear: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; dur?: number }> = ({ at, children, style, dy = 40, dur = 10 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...rclamp, easing: RE.pop });
  return <div style={{ opacity: interpolate(frame, [at, at + 4], [0, 1], rclamp), translate: `0 ${(1 - p) * dy}px`, scale: 0.92 + 0.08 * p, ...style }}>{children}</div>;
};

/** Серая строка-«плашка»: иконка, текст, справа подпись. */
export const Row: React.FC<{ icon?: React.ReactNode; text: React.ReactNode; meta?: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties; mono?: boolean }> = ({
  icon,
  text,
  meta,
  bg = R.row,
  color = R.ink,
  style,
  mono,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: bg,
      borderRadius: 20,
      padding: "20px 24px",
      fontFamily: mono ? RF.mono : RF.ui,
      fontWeight: mono ? 500 : 700,
      fontSize: 32,
      color,
      ...style,
    }}
  >
    {icon}
    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
    {meta && <span style={{ fontFamily: RF.mono, fontSize: 26, color: R.gray, fontWeight: 500 }}>{meta}</span>}
  </div>
);

/** Зелёная галочка в круге; at — кадр, когда «щёлкает». */
export const Check: React.FC<{ at?: number; size?: number; color?: string }> = ({ at = -999, size = 44, color = R.green }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 8], [0, 1], { ...rclamp, easing: RE.pop });
  const d = interpolate(frame, [at + 2, at + 10], [1, 0], rclamp);
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={{ scale: s, flexShrink: 0 }}>
      <circle cx="22" cy="22" r="22" fill={color} />
      <path d="M12 22.5 L19 29 L32 15" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={d} />
    </svg>
  );
};

/** Красный крестик в круге. */
export const Cross: React.FC<{ at?: number; size?: number }> = ({ at = -999, size = 44 }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 8], [0, 1], { ...rclamp, easing: RE.pop });
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={{ scale: s, flexShrink: 0 }}>
      <circle cx="22" cy="22" r="22" fill="#E9E5DE" />
      <path d="M15 15 L29 29 M29 15 L15 29" stroke="#B4AFA6" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Терракотовая кнопка. Если задан progress (0…1) — превращается в полосу выполнения
 * с подписью «label… NN%», как в референсе.
 */
export const Btn: React.FC<{ label: string; progress?: number; busy?: string; done?: string; style?: React.CSSProperties; color?: string }> = ({
  label,
  progress,
  busy,
  done,
  style,
  color = R.clay,
}) => {
  const working = progress !== undefined && progress > 0 && progress < 1;
  const finished = progress !== undefined && progress >= 1 && done;
  const text = finished ? done : working ? `${busy ?? label} ${Math.round(progress * 100)}%` : label;
  return (
    <div
      style={{
        position: "relative",
        height: 92,
        borderRadius: 22,
        background: working ? R.clayTint : color,
        overflow: "hidden",
        boxShadow: working ? "none" : `0 10px 24px ${color}55`,
        ...style,
      }}
    >
      {working && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: color }} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: RF.ui,
          fontWeight: 800,
          fontSize: 34,
          color: working ? R.ink : R.white,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Ключевые точки курсора: кадр и координаты (в системе родителя). click — щелчок в этой точке. */
export type CursorKey = { f: number; x: number; y: number; click?: boolean };

/** Курсор-стрелка, плавно движется по ключевым точкам, на кликах — «вдавливается» и даёт круг. */
export const Cursor: React.FC<{ keys: CursorKey[]; hideBefore?: number; hideAfter?: number; scale?: number }> = ({ keys, hideBefore = -1, hideAfter = 1e9, scale = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < hideBefore || frame > hideAfter) return null;
  let x = keys[0]!.x;
  let y = keys[0]!.y;
  for (let k = 0; k < keys.length - 1; k++) {
    const a = keys[k]!;
    const b = keys[k + 1]!;
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], { ...rclamp, easing: RE.inOut });
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const clickFrames = keys.filter((k) => k.click).map((k) => k.f);
  const last = clickFrames.filter((c) => frame >= c).pop();
  const t = last === undefined ? 99 : frame - last;
  const press = t < 6 ? 1 - Math.abs(t - 2) / 4 : 0;
  const ring = t < 14 ? t / 14 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", scale }}>
      {t < 14 && (
        <div
          style={{
            position: "absolute",
            left: -40 * ring - 6,
            top: -40 * ring - 6,
            width: 80 * ring + 12,
            height: 80 * ring + 12,
            borderRadius: 999,
            border: `5px solid ${R.clay}`,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg width="54" height="64" viewBox="0 0 27 32" style={{ scale: 1 - press * 0.18, transformOrigin: "0 0", filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.3))" }}>
        <path d="M2 1.5 L2 26 L8.2 20.4 L12.3 30 L16.6 28.2 L12.6 18.8 L21 18.6 Z" fill="#141413" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Печать текста по буквам между кадрами from и to (+ мигающая каретка, пока печатается). */
export const typed = (text: string, frame: number, from: number, to: number) => {
  const n = Math.round(interpolate(frame, [from, to], [0, text.length], rclamp));
  return text.slice(0, n);
};

export const Caret: React.FC<{ color?: string; h?: number }> = ({ color = R.ink, h = 38 }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 4, height: h, background: color, marginLeft: 4, verticalAlign: "middle", opacity: Math.floor(frame / 8) % 2 ? 0.15 : 1 }} />;
};

/** Значок файла (контур листа с подписью расширения). */
export const FileIcon: React.FC<{ ext?: string; color?: string; size?: number }> = ({ ext = "tsx", color = R.blue, size = 40 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 40 46" style={{ flexShrink: 0 }}>
    <path d="M6 2 H26 L36 12 V42 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 V4 a2 2 0 0 1 2 -2 Z" fill="#fff" stroke="#CFCAC0" strokeWidth="2.5" />
    <path d="M26 2 V12 H36" fill="none" stroke="#CFCAC0" strokeWidth="2.5" />
    <rect x="0" y="24" width="30" height="13" rx="3" fill={color} />
    <text x="15" y="34" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#fff">
      {ext}
    </text>
  </svg>
);

/** Иконка «чат» (облачко) и «терминал» (>_) — нарисованные символы, не логотипы. */
export const ChatGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = R.clay }) => (
  <svg width={size} height={size} viewBox="0 0 34 34">
    <path d="M5 6 h24 a3 3 0 0 1 3 3 v13 a3 3 0 0 1 -3 3 H14 l-7 6 v-6 H5 a3 3 0 0 1 -3 -3 V9 a3 3 0 0 1 3 -3 Z" fill={color} />
  </svg>
);
export const TermGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = R.ink }) => (
  <svg width={size} height={size} viewBox="0 0 34 34">
    <rect x="1" y="4" width="32" height="26" rx="5" fill={color} />
    <path d="M8 12 L13 17 L8 22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 23 H25" stroke={R.clay} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
