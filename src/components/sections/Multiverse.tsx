"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { universes } from "@/data/universes";
import SectionHeading from "@/components/ui/SectionHeading";

const MultiversePortalScene = dynamic(() => import("@/components/three/MultiversePortalScene"), { ssr: false });

export default function Multiverse() {
  const [active, setActive] = useState<string>(universes[0].id);
  const activeUniverse = universes.find((u) => u.id === active) ?? universes[0];

  return (
    <section id="multiverse" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="За пределами известного"
          title="Мультивселенная"
          description="Каждый выбор порождает новую ветвь. Выберите портал, чтобы заглянуть в другую реальность."
        />

        <div className="relative h-[420px] w-full sm:h-[480px]">
          <MultiversePortalScene active={active} onSelect={setActive} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeUniverse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass mx-auto mt-4 max-w-2xl rounded-2xl p-6 text-center"
          >
            <h3 className="comic-title text-2xl" style={{ color: activeUniverse.color }}>
              {activeUniverse.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{activeUniverse.designation}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{activeUniverse.description}</p>
            <p className="mt-3 text-xs text-white/40">
              <span className="text-white/60">Ключевые фигуры:</span> {activeUniverse.keyFigures.join(", ")}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
