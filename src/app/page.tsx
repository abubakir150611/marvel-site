import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Stats from "@/components/sections/Stats";
import Heroes from "@/components/sections/Heroes";
import Villains from "@/components/sections/Villains";
import InfinityStones from "@/components/sections/InfinityStones";
import Multiverse from "@/components/sections/Multiverse";
import UniverseMap from "@/components/sections/UniverseMap";
import Gallery from "@/components/sections/Gallery";
import Battles from "@/components/sections/Battles";

export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <Stats />
      <Heroes />
      <Villains />
      <InfinityStones />
      <Multiverse />
      <UniverseMap />
      <Gallery />
      <Battles />
    </>
  );
}
