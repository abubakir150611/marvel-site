"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { galleryItems } from "@/data/universes";
import { GalleryItem } from "@/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSound } from "@/hooks/useSound";

const CATEGORIES: (GalleryItem["category"] | "Все")[] = ["Все", "Кадры", "Арты", "Комиксы", "Концепт-арты"];

const HEIGHT_CLASS: Record<GalleryItem["height"], string> = {
  short: "h-48",
  medium: "h-64",
  tall: "h-80",
};

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Все");
  const { playHover, playClick } = useSound();

  const items = filter === "Все" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <section id="gallery" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Визуальный архив" title="Галерея" description="Кадры, арты, комиксы и концепт-арты вселенной Marvel." />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onMouseEnter={playHover}
              onClick={() => {
                setFilter(cat);
                playClick();
              }}
              data-cursor-hover
              className={`rounded-full border px-4 py-1.5 font-display text-xs tracking-widest transition-all ${
                filter === cat ? "border-marvel-red bg-marvel-red text-white" : "border-white/15 text-white/60 hover:border-white/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              className={`halftone group relative overflow-hidden rounded-xl border border-white/10 break-inside-avoid ${HEIGHT_CLASS[item.height]}`}
              style={{ background: `linear-gradient(160deg, ${item.color[0]}, ${item.color[1]})` }}
              data-cursor-hover
            >
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <div>
                  <p className="font-display text-sm text-white">{item.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
