"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export default function Hero() {
  const { playClick, playWhoosh } = useSound();

  function scrollToTimeline() {
    playWhoosh();
    playClick();
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-marvel-black">
      <HeroScene />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-marvel-black" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-4 font-display text-xs text-marvel-red sm:text-sm"
        >
          MARVEL CINEMATIC UNIVERSE
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="comic-title text-gradient-marvel text-[15vw] leading-[0.85] sm:text-7xl md:text-8xl lg:text-9xl [filter:drop-shadow(0_0_30px_rgba(237,29,36,0.5))]"
        >
          MCU
          <br />
          UNIVERSE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 max-w-xl text-balance text-sm text-marvel-white/60 sm:text-base"
        >
          Полная хроника Кинематографической вселенной Marvel: фазы, герои, злодеи,
          камни бесконечности и бесконечное множество миров.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={scrollToTimeline}
          data-cursor-hover
          className="group relative mt-10 overflow-hidden rounded-full border-2 border-marvel-red bg-marvel-red/10 px-8 py-4 font-display text-sm tracking-widest text-white shadow-neon transition-transform hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">ИССЛЕДОВАТЬ КВМ ↓</span>
          <span className="absolute inset-0 -translate-x-full bg-marvel-red transition-transform duration-500 group-hover:translate-x-0" />
        </motion.button>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-marvel-white/40"
      >
        <div className="h-9 w-5 rounded-full border-2 border-marvel-white/30 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-marvel-red" />
        </div>
      </motion.div>
    </section>
  );
}
