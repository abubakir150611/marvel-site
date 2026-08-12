import type { Metadata } from "next";
import Timeline from "@/components/sections/Timeline";

export const metadata: Metadata = {
  title: "Таймлайн MCU",
  description: "Полный интерактивный таймлайн Кинематографической вселенной Marvel по фазам — от Железного человека до Тайных войн.",
};

export default function TimelinePage() {
  return (
    <div className="pt-24">
      <Timeline />
    </div>
  );
}
