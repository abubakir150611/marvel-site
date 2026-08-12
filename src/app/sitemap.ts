import type { MetadataRoute } from "next";
import { heroes } from "@/data/heroes";
import { villains } from "@/data/villains";

const siteUrl = "https://mcu-universe.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/timeline`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const heroRoutes: MetadataRoute.Sitemap = heroes.map((hero) => ({
    url: `${siteUrl}/heroes/${hero.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const villainRoutes: MetadataRoute.Sitemap = villains.map((villain) => ({
    url: `${siteUrl}/villains/${villain.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...heroRoutes, ...villainRoutes];
}
