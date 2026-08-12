"use client";

import { villains } from "@/data/villains";
import VillainCard from "@/components/ui/VillainCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Villains() {
  return (
    <section id="villains" className="relative bg-marvel-black-soft/40 px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Тёмная энциклопедия"
          title="Злодеи"
          description="Величайшие угрозы, с которыми когда-либо сталкивались герои MCU — от локальных мстителей до разрушителей вселенных."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {villains.map((villain, i) => (
            <VillainCard key={villain.slug} villain={villain} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
