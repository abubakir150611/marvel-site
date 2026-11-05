import { Easing } from "remotion";
import timeline from "./timeline.json";

/** Монтажный лист (scripts/timeline.mjs): сцены, слова озвучки и субтитры — в кадрах. */
export const RT = timeline;
export type SceneId = (typeof timeline.scenes)[number]["id"];

/** Палитра: светлый «интерфейсный» холст + сплошные цветовые поля для врезок. */
export const R = {
  canvas: "#EFECE6",
  paper: "#FFFFFF",
  row: "#F4F2EE",
  line: "#E4E0D8",
  clay: "#D97757",
  clayDeep: "#C15F3C",
  clayTint: "#F6DED3",
  green: "#2FA866",
  greenTint: "#E6F5EC",
  red: "#E8382C",
  blue: "#2D3BF0",
  amber: "#F4B63B",
  emerald: "#24A879",
  cream: "#F2EEE4",
  ink: "#141413",
  black: "#0A0C0B",
  gray: "#8A877F",
  white: "#FFFFFF",
  term: "#16161A",
};

export const RF = {
  display: "Unbounded, Manrope, sans-serif",
  serif: '"Playfair Display", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  text: "Manrope, Inter, sans-serif",
  ui: "Inter, Manrope, sans-serif",
};

/** Кривые: «пружина» для появлений с перелётом, резкая для хлёстких переходов. */
export const RE = {
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  whip: Easing.bezier(0.7, 0, 0.2, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};

export const rclamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const sceneOf = (id: SceneId) => RT.scenes.find((s) => s.id === id)!;
export const wordAt = (i: number) => RT.words[i]!.start;
export const wordEnd = (i: number) => RT.words[i]!.end;
/** Тайминги сцены относительно её начала: at(i) — кадр начала слова i, end(i) — его конца. */
export const local = (id: SceneId) => {
  const s = sceneOf(id);
  return { start: s.start, len: s.end - s.start, at: (i: number) => wordAt(i) - s.start, end: (i: number) => wordEnd(i) - s.start };
};
