"use client";

import dynamic from "next/dynamic";

const PortraitScene = dynamic(() => import("./PortraitScene"), { ssr: false });

export default function PortraitSceneClient({ color, accent }: { color: string; accent: string }) {
  return <PortraitScene color={color} accent={accent} />;
}
