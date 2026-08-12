"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import PortalRing from "./PortalRing";
import ParticleField from "./ParticleField";

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const target = 5 - progress.current * 2.2;
    camera.position.z += (target - camera.position.z) * 0.06;
    camera.position.y += (progress.current * 0.6 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.12;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} args={[0.55, 1]}>
        <meshStandardMaterial color="#ED1D24" emissive="#ED1D24" emissiveIntensity={1.8} wireframe />
      </Icosahedron>
    </Float>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ED1D24" />
      <pointLight position={[-5, -3, -5]} intensity={1.2} color="#3B82F6" />

      <Stars radius={60} depth={40} count={3000} factor={3} saturation={0} fade speed={0.6} />
      <ParticleField count={600} radius={7} color="#ED1D24" size={0.025} />
      <ParticleField count={400} radius={5} color="#F5F5F7" size={0.015} />

      <EnergyCore />

      <PortalRing position={[-2.6, 1.1, -1.5]} color="#22C55E" scale={0.9} speed={0.8} />
      <PortalRing position={[2.8, -0.8, -2]} color="#ED1D24" scale={1.1} speed={1.2} />
      <PortalRing position={[0, -2.2, -3]} color="#8B5CF6" scale={0.7} speed={0.6} />

      <CameraRig progress={progress} />
    </>
  );
}

// Full-bleed 3D hero scene: starfield, mystic portals and a floating energy core.
// Camera dollies in as the user scrolls, driven by a ref (no re-renders per frame).
export default function HeroScene() {
  const progress = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    function onScroll() {
      const max = window.innerHeight * 1.2;
      progress.current = Math.min(window.scrollY / max, 1);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
