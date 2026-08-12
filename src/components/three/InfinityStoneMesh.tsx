"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Gem({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
      meshRef.current.rotation.x += delta * 0.25;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.2}
          transmission={0.4}
          thickness={1.2}
          clearcoat={1}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

// Small standalone canvas rendering a single glowing, rotating infinity stone.
export default function InfinityStoneMesh({ color }: { color: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 1.6]} gl={{ alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={2} color={color} />
      <pointLight position={[-2, -1, 1]} intensity={1} color="#ffffff" />
      <Gem color={color} />
    </Canvas>
  );
}
