import React from "react";
import { R, RF } from "../theme";

/**
 * Обозначения двух агентов. Это нарисованные символы, а не логотипы компаний:
 * Claude Code — терракотовый терминал, Codex — чёрный квадрат с фигурными скобками.
 */
export const ClaudeMark: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <rect width="48" height="48" rx="12" fill={R.clay} />
    <path d="M13 17 L20 24 L13 31" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 32 H35" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const CodexMark: React.FC<{ size?: number; invert?: boolean }> = ({ size = 48, invert }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <rect width="48" height="48" rx="12" fill={invert ? "#fff" : R.codex} />
    <text x="24" y="32" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" fontSize="22" fill={invert ? R.codex : "#fff"}>
      {"{ }"}
    </text>
  </svg>
);

/** Табличка-«чип» с текстом. */
export const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties }> = ({ children, bg = R.row, color = R.ink, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: bg, color, borderRadius: 999, padding: "12px 24px", fontFamily: RF.ui, fontWeight: 700, fontSize: 30, whiteSpace: "nowrap", ...style }}>
    {children}
  </span>
);
