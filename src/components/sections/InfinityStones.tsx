"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { stones } from "@/data/stones";
import SectionHeading from "@/components/ui/SectionHeading";
import { hexToRgba } from "@/lib/utils";

const InfinityStoneMesh = dynamic(() => import("@/components/three/InfinityStoneMesh"), { ssr: false });

export default function InfinityStones() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="stones" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(139,92,246,0.1),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Артефакты силы"
          title="Камни бесконечности"
          description="Шесть сингулярностей, предшествовавших мирозданию. Каждая управляет фундаментальным аспектом реальности."
        />

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {stones.map((stone) => (
            <div
              key={stone.id}
              onMouseEnter={() => setHovered(stone.id)}
              onMouseLeave={() => setHovered(null)}
              data-cursor-hover
              className="group relative flex flex-col items-center"
            >
              <div
                className="relative h-32 w-32 rounded-2xl border transition-all sm:h-40 sm:w-40"
                style={{
                  borderColor: hexToRgba(stone.color, 0.4),
                  boxShadow: hovered === stone.id ? `0 0 40px ${hexToRgba(stone.color, 0.6)}` : `0 0 15px ${hexToRgba(stone.color, 0.15)}`,
                  background: `radial-gradient(circle at 50% 40%, ${hexToRgba(stone.color, 0.15)}, #0A0A0C 80%)`,
                }}
              >
                <InfinityStoneMesh color={stone.color} />
              </div>
              <h3 className="mt-3 text-center font-display text-sm tracking-wider text-white sm:text-base">{stone.nameRu}</h3>

              <AnimatePresence>
                {hovered === stone.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass absolute top-full z-20 mt-3 w-64 rounded-xl p-4 text-left shadow-glass"
                  >
                    <p className="text-xs font-display tracking-widest" style={{ color: stone.color }}>
                      {stone.name}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">{stone.description}</p>
                    <p className="mt-2 text-[11px] text-white/40">
                      <span className="text-white/60">Сила:</span> {stone.power}
                    </p>
                    <p className="mt-1 text-[11px] text-white/40">
                      <span className="text-white/60">Первое появление:</span> {stone.firstAppearance}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
