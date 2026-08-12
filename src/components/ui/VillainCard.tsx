"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Villain } from "@/types";
import { useSound } from "@/hooks/useSound";

// Dark-styled encyclopedia entry card for the Villains section.
export default function VillainCard({ villain, index }: { villain: Villain; index: number }) {
  const { playHover, playClick } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <Link href={`/villains/${villain.slug}`} onMouseEnter={playHover} onClick={playClick} data-cursor-hover>
        <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-marvel-black-soft p-5 transition-all hover:border-marvel-red/40">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
            style={{ background: villain.color }}
          />
          <div className="mb-3 flex items-center justify-between">
            <span
              className="rounded-full border px-2.5 py-0.5 font-display text-[10px] tracking-widest"
              style={{ borderColor: villain.color, color: villain.color }}
            >
              {villain.threat === "Cosmic" && "КОСМИЧЕСКАЯ УГРОЗА"}
              {villain.threat === "Multiversal" && "МУЛЬТИВСЕЛЕНСКАЯ УГРОЗА"}
              {villain.threat === "Global" && "ГЛОБАЛЬНАЯ УГРОЗА"}
              {villain.threat === "Planetary" && "ПЛАНЕТАРНАЯ УГРОЗА"}
              {villain.threat === "Regional" && "ЛОКАЛЬНАЯ УГРОЗА"}
            </span>
          </div>
          <h3 className="comic-title text-2xl text-white">{villain.name}</h3>
          <p className="mt-1 text-xs text-white/40">{villain.realName}</p>
          <p className="mt-3 line-clamp-3 text-sm text-white/60">{villain.bio}</p>
          <p className="mt-4 text-xs italic text-white/30">«{villain.quote}»</p>
        </div>
      </Link>
    </motion.div>
  );
}
