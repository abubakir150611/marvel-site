"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { phases, getMoviesByPhase } from "@/data/movies";
import MovieCard from "@/components/ui/MovieCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSound } from "@/hooks/useSound";

export default function Timeline() {
  const [activePhase, setActivePhase] = useState(phases[0]);
  const { playHover, playClick } = useSound();
  const moviesInPhase = getMoviesByPhase(activePhase);

  return (
    <section id="timeline" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Хроники MCU"
          title="Таймлайн MCU"
          description="От первого фильма до Саги Мультивселенной — исследуйте каждую фазу. Нажмите на карточку, чтобы перевернуть страницу комикса."
        />

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {phases.map((phase) => (
            <button
              key={phase}
              onMouseEnter={playHover}
              onClick={() => {
                setActivePhase(phase);
                playClick();
              }}
              data-cursor-hover
              className={`relative rounded-full border px-5 py-2 font-display text-sm tracking-widest transition-all ${
                activePhase === phase
                  ? "border-marvel-red bg-marvel-red text-white shadow-neon"
                  : "border-white/15 text-white/60 hover:border-marvel-red/50 hover:text-white"
              }`}
            >
              {phase}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="scrollbar-thin flex snap-x gap-6 overflow-x-auto pb-8"
          >
            {moviesInPhase.map((movie) => (
              <div key={movie.slug} className="snap-start">
                <MovieCard movie={movie} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
