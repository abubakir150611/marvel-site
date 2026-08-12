"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Movie } from "@/types";
import Poster from "./Poster";
import StarRating from "./StarRating";
import { useSound } from "@/hooks/useSound";

// Comic-page style card: flips open to reveal details, like turning a page.
export default function MovieCard({ movie }: { movie: Movie }) {
  const [open, setOpen] = useState(false);
  const { playOpen, playHover } = useSound();

  return (
    <div className="perspective-1000 h-80 w-56 shrink-0 sm:h-96 sm:w-64">
      <motion.div
        className="preserve-3d relative h-full w-full cursor-pointer"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => {
          setOpen((v) => !v);
          playOpen();
        }}
        onMouseEnter={playHover}
        data-cursor-hover
      >
        {/* Front — poster */}
        <div className="comic-panel backface-hidden absolute inset-0 flex flex-col">
          <Poster title={movie.title} colors={movie.posterColor} className="h-full w-full" />
          <div className="absolute top-2 left-2 rounded bg-marvel-black/80 px-2 py-0.5 font-display text-xs tracking-widest text-marvel-white">
            {movie.year}
          </div>
          <div className="absolute top-2 right-2 rounded bg-marvel-red px-2 py-0.5 font-display text-xs tracking-widest text-white">
            {movie.type}
          </div>
        </div>

        {/* Back — details */}
        <div className="comic-panel backface-hidden absolute inset-0 flex flex-col justify-between overflow-y-auto bg-marvel-black-soft p-4 [transform:rotateY(180deg)]">
          <div>
            <h3 className="comic-title text-xl leading-tight text-marvel-red">{movie.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-marvel-white/40">{movie.originalTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-marvel-white/75">{movie.description}</p>
          </div>
          <div className="space-y-2">
            {movie.heroes.length > 0 && (
              <p className="text-xs text-marvel-white/50">
                <span className="text-marvel-white/80">Герои:</span> {movie.heroes.join(", ")}
              </p>
            )}
            <p className="text-xs text-marvel-white/50">
              <span className="text-marvel-white/80">Режиссёр:</span> {movie.director}
            </p>
            <StarRating rating={movie.rating} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
