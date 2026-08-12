"use client";

import { useCallback } from "react";
import { sound } from "@/lib/sound";

export function useSound() {
  const playHover = useCallback(() => sound.hover(), []);
  const playClick = useCallback(() => sound.click(), []);
  const playOpen = useCallback(() => sound.open(), []);
  const playWhoosh = useCallback(() => sound.whoosh(), []);

  return { playHover, playClick, playOpen, playWhoosh };
}
