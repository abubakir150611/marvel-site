"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Core({ color, accent }: { color: string; accent: string }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.25;
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.4;
      innerRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </>
  );
}

// Large ambient 3D backdrop used behind hero/villain portrait pages.
export default function PortraitScene({ color, accent }: { color: string; accent: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={2} color={color} />
      <pointLight position={[-3, -2, -2]} intensity={1} color={accent} />
      <Sparkles count={80} scale={5} size={2} speed={0.4} color={color} />
      <Core color={color} accent={accent} />
    </Canvas>
  );
}
