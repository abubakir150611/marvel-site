"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// Renders nothing — mounts the Lenis smooth-scroll instance for the whole app.
export default function SmoothScrollProvider() {
  useSmoothScroll();
  return null;
}
