"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero } from "@/types";
import { useSound } from "@/hooks/useSound";

// Trading-card style portrait that tilts in 3D following the cursor.
export default function HeroCard({ hero, index }: { hero: Hero; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { playHover, playClick } = useSound();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 16 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="perspective-1000"
    >
      <Link href={`/heroes/${hero.slug}`} onMouseEnter={playHover} onClick={playClick} data-cursor-hover>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="group relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 transition-shadow duration-300 hover:shadow-neon"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 50% 30%, ${hero.color}55, #0A0A0C 75%)` }}
          />
          <div className="halftone absolute inset-0 opacity-30" />

          <div
            className="absolute left-1/2 top-10 h-28 w-28 -translate-x-1/2 rounded-full border-4"
            style={{ borderColor: hero.color, boxShadow: `0 0 30px ${hero.color}` }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-full font-display text-3xl"
              style={{ background: `linear-gradient(160deg, ${hero.color}, ${hero.accentColor})` }}
            >
              {hero.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-marvel-black via-marvel-black/80 to-transparent p-4 pt-10">
            <h3 className="comic-title text-xl text-white">{hero.name}</h3>
            <p className="text-xs text-white/50">{hero.realName}</p>
          </div>

          <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 font-display text-[10px] tracking-widest text-white/60 opacity-0 transition-opacity group-hover:opacity-100">
            Подробнее →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
