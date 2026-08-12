"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const UniverseMapScene = dynamic(() => import("@/components/three/UniverseMapScene"), { ssr: false });

export default function UniverseMap() {
  return (
    <section id="map" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Навигация по вселенной"
          title="Карта вселенной Marvel"
          description="Земля, Асгард, Ваканда и другие миры — вращайте карту мышью, чтобы исследовать вселенную."
        />

        <div className="comic-panel relative h-[480px] w-full overflow-hidden rounded-2xl sm:h-[560px]">
          <UniverseMapScene />
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 font-display text-xs tracking-widest text-white/60">
            ПЕРЕТАЩИТЕ, ЧТОБЫ ВРАЩАТЬ • КОЛЕСО, ЧТОБЫ ПРИБЛИЗИТЬ
          </div>
        </div>
      </div>
    </section>
  );
}
