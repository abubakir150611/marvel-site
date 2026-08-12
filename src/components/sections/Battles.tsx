"use client";

import { motion } from "framer-motion";
import { battles } from "@/data/universes";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSound } from "@/hooks/useSound";

export default function Battles() {
  const { playHover } = useSound();

  return (
    <section id="battles" className="relative bg-marvel-black-soft/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Легендарные сражения"
          title="Лучшие битвы"
          description="Эпические столкновения, определившие судьбу вселенной."
        />

        <div className="flex flex-col gap-6">
          {battles.map((battle, i) => (
            <motion.div
              key={battle.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onMouseEnter={playHover}
              data-cursor-hover
              className="group relative flex h-56 items-end overflow-hidden rounded-2xl border border-white/10 sm:h-64"
            >
              <div
                className="absolute inset-0 scale-105 transition-transform duration-700 group-hover:scale-125"
                style={{ background: `radial-gradient(circle at 30% 30%, ${battle.color}66, #0A0A0C 75%)` }}
              />
              <div className="scanlines absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="h-16 w-16 rounded-full border-2 border-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-white" />
                </div>
              </div>

              <div className="relative z-10 w-full p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="comic-title text-2xl text-white sm:text-3xl">{battle.name}</h3>
                  <span className="font-display text-sm text-white/50">{battle.year}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{battle.movie}</p>
                <p className="mt-2 max-w-2xl text-sm text-white/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {battle.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
