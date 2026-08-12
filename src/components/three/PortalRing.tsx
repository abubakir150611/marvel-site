"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PortalRingProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

// Doctor Strange-style rotating energy portal built from stacked emissive tori.
export default function PortalRing({
  position = [0, 0, 0],
  color = "#ED1D24",
  scale = 1,
  speed = 1,
}: PortalRingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.15 * speed;
    if (innerRef.current) innerRef.current.rotation.z -= delta * 0.35 * speed;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.03, 16, 100, Math.PI * 1.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
