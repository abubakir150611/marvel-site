"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import PortalRing from "./PortalRing";
import { universes } from "@/data/universes";

const layout: [number, number, number][] = [
  [-4.4, 0.6, 0],
  [-2.1, -0.4, -1],
  [0.2, 0.8, -0.5],
  [2.4, -0.5, -1],
  [4.5, 0.5, 0],
];

interface Props {
  active: string | null;
  onSelect: (id: string) => void;
}

export default function MultiversePortalScene({ active, onSelect }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={1.5} color="#ffffff" />
      <Stars radius={50} depth={30} count={1500} factor={2.5} fade speed={0.5} />

      {universes.map((u, i) => (
        <group key={u.id} position={layout[i]}>
          <PortalRing color={u.color} scale={active === u.id ? 1.15 : 0.85} speed={active === u.id ? 1.6 : 0.7} />
          <Html center distanceFactor={9} position={[0, -1.5, 0]}>
            <button
              onClick={() => onSelect(u.id)}
              data-cursor-hover
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-display text-xs tracking-widest transition-all ${
                active === u.id
                  ? "border-marvel-red bg-marvel-red/20 text-marvel-white scale-110"
                  : "border-white/15 bg-marvel-black/70 text-marvel-white/70 hover:border-white/40"
              }`}
            >
              {u.name}
            </button>
          </Html>
        </group>
      ))}
    </Canvas>
  );
}
