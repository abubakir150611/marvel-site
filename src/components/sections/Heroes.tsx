"use client";

import { useState } from "react";
import { heroes } from "@/data/heroes";
import HeroCard from "@/components/ui/HeroCard";
import SectionHeading from "@/components/ui/SectionHeading";

const PAGE_SIZE = 12;

export default function Heroes() {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <section id="heroes" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="База данных"
          title="Герои"
          description={`${heroes.length} защитников Земли и мультивселенной. Наведите курсор на карточку, чтобы почувствовать её объём.`}
        />

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {heroes.slice(0, visible).map((hero, i) => (
            <HeroCard key={hero.slug} hero={hero} index={i} />
          ))}
        </div>

        {visible < heroes.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              data-cursor-hover
              className="rounded-full border border-white/20 px-8 py-3 font-display text-sm tracking-widest text-white/80 transition-all hover:border-marvel-red hover:text-marvel-red"
            >
              ПОКАЗАТЬ ЕЩЁ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
