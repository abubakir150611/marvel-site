import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { villains, getVillainBySlug } from "@/data/villains";
import InfoList from "@/components/ui/InfoList";
import PortraitScene from "@/components/three/PortraitSceneClient";

export function generateStaticParams() {
  return villains.map((villain) => ({ slug: villain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const villain = getVillainBySlug(slug);
  if (!villain) return {};
  return {
    title: villain.name,
    description: villain.bio,
    openGraph: { title: `${villain.name} | MCU Universe`, description: villain.bio },
  };
}

export default async function VillainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const villain = getVillainBySlug(slug);
  if (!villain) notFound();

  return (
    <article className="relative bg-marvel-black-soft/30 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/#villains" className="mb-8 inline-block font-display text-sm tracking-widest text-white/50 hover:text-marvel-red">
          ← ВСЕ ЗЛОДЕИ
        </Link>

        <div className="comic-panel relative mb-10 h-72 overflow-hidden rounded-2xl border-2 sm:h-96" style={{ borderColor: villain.color }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${villain.color}33, #050506 85%)` }} />
          <PortraitScene color={villain.color} accent="#0A0A0C" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
            <span
              className="mb-2 inline-block rounded-full border px-3 py-0.5 font-display text-[10px] tracking-widest"
              style={{ borderColor: villain.color, color: villain.color }}
            >
              {villain.threat.toUpperCase()} УГРОЗА
            </span>
            <h1 className="comic-title text-5xl text-white sm:text-7xl">{villain.name}</h1>
            <p className="mt-1 text-sm text-white/50">{villain.realName}</p>
          </div>
        </div>

        <blockquote className="mb-10 border-l-4 pl-4 text-lg italic text-white/60" style={{ borderColor: villain.color }}>
          «{villain.quote}»
        </blockquote>

        <div className="glass mb-6 rounded-xl p-6">
          <h2 className="font-display text-sm tracking-widest" style={{ color: villain.color }}>ДОСЬЕ</h2>
          <p className="mt-3 leading-relaxed text-white/75">{villain.bio}</p>
        </div>

        <div className="glass mb-10 rounded-xl p-6">
          <h2 className="font-display text-sm tracking-widest" style={{ color: villain.color }}>ЦЕЛЬ</h2>
          <p className="mt-3 leading-relaxed text-white/75">{villain.goal}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoList title="Силы и способности" items={villain.powers} accent={villain.color} />
          <InfoList title="Появления" items={villain.appearances} accent={villain.color} />
          <InfoList title="Побеждён" items={villain.defeatedBy} accent="#22C55E" />
        </div>
      </div>
    </article>
  );
}
