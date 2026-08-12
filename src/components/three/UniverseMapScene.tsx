"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line, Stars } from "@react-three/drei";
import { locations } from "@/data/universes";

function LocationNode({
  loc,
  active,
  onSelect,
}: {
  loc: (typeof locations)[number];
  active: boolean;
  onSelect: (id: string | null) => void;
}) {
  return (
    <group position={loc.position}>
      <mesh
        onPointerOver={() => onSelect(loc.id)}
        onPointerOut={() => onSelect(null)}
        scale={active ? 1.4 : 1}
      >
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color={loc.color} emissive={loc.color} emissiveIntensity={active ? 2.5 : 1.4} toneMapped={false} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.28, 0]} occlude>
        <div
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-display text-xs tracking-wider transition-all ${
            active ? "border-marvel-red bg-marvel-black/90 text-marvel-white scale-110" : "border-white/10 bg-marvel-black/60 text-marvel-white/70"
          }`}
        >
          {loc.name}
        </div>
      </Html>
    </group>
  );
}

export default function UniverseMapScene() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.6} color="#ED1D24" />
      <pointLight position={[-4, -2, -3]} intensity={1} color="#3B82F6" />
      <Stars radius={40} depth={30} count={1200} factor={2} fade speed={0.4} />

      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>

      {locations.map((loc) => (
        <group key={loc.id}>
          {loc.id !== "earth" && (
            <Line points={[[0, 0, 0], loc.position]} color={loc.color} transparent opacity={0.25} lineWidth={1} />
          )}
          <LocationNode loc={loc} active={active === loc.id} onSelect={setActive} />
        </group>
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
