"use client";

import { stats } from "@/data/stats";
import { useCounter } from "@/hooks/useCounter";

function StatItem({ label, value }: { label: string; value: number }) {
  const { ref, value: current } = useCounter(value);
  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="comic-title text-gradient-marvel text-6xl sm:text-7xl">{current}</span>
      <span className="mt-2 font-display text-sm tracking-widest text-white/50">{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-marvel-black-soft/60 px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatItem key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
