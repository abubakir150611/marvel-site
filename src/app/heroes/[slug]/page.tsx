import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { heroes, getHeroBySlug } from "@/data/heroes";
import InfoList from "@/components/ui/InfoList";
import PortraitScene from "@/components/three/PortraitSceneClient";

export function generateStaticParams() {
  return heroes.map((hero) => ({ slug: hero.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);
  if (!hero) return {};
  return {
    title: hero.name,
    description: hero.bio,
    openGraph: { title: `${hero.name} | MCU Universe`, description: hero.bio },
  };
}

export default async function HeroDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);
  if (!hero) notFound();

  return (
    <article className="relative px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/#heroes" className="mb-8 inline-block font-display text-sm tracking-widest text-white/50 hover:text-marvel-red">
          ← ВСЕ ГЕРОИ
        </Link>

        <div className="comic-panel relative mb-10 h-72 overflow-hidden rounded-2xl sm:h-96">
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${hero.color}33, #0A0A0C 80%)` }} />
          <PortraitScene color={hero.color} accent={hero.accentColor} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-marvel-black via-marvel-black/60 to-transparent p-8">
            <h1 className="comic-title text-5xl text-white sm:text-7xl">{hero.name}</h1>
            <p className="mt-1 text-sm text-white/50">{hero.realName} · {hero.actor}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Первое появление</p>
            <p className="mt-1 font-display text-sm text-white">{hero.firstAppearance}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Принадлежность</p>
            <p className="mt-1 font-display text-sm text-white">{hero.affiliation}</p>
          </div>
          <div className="glass col-span-2 rounded-xl p-4 text-center sm:col-span-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Актёр</p>
            <p className="mt-1 font-display text-sm text-white">{hero.actor}</p>
          </div>
        </div>

        <div className="glass mb-10 rounded-xl p-6">
          <h2 className="font-display text-sm tracking-widest text-marvel-red">БИОГРАФИЯ</h2>
          <p className="mt-3 leading-relaxed text-white/75">{hero.bio}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoList title="Способности" items={hero.abilities} accent={hero.color} />
          <InfoList title="Оружие и снаряжение" items={hero.weapons} accent={hero.color} />
          <InfoList title="Союзники" items={hero.allies} accent="#22C55E" />
          <InfoList title="Враги" items={hero.enemies} accent="#B91C1C" />
          <InfoList title="Появления в фильмах" items={hero.appearances} accent={hero.accentColor} />
          <InfoList title="Интересные факты" items={hero.facts} accent="#D4AF37" />
        </div>
      </div>
    </article>
  );
}
