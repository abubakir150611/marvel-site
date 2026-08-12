// Core domain types shared across the MCU site

export type StoneColor = "space" | "mind" | "reality" | "power" | "time" | "soul";

export interface Hero {
  slug: string;
  name: string;
  realName: string;
  bio: string;
  abilities: string[];
  weapons: string[];
  allies: string[];
  enemies: string[];
  appearances: string[];
  facts: string[];
  color: string; // primary accent color (hex) used for glow / 3D material
  accentColor: string; // secondary accent
  actor: string;
  firstAppearance: string;
  affiliation: string;
}

export interface Villain {
  slug: string;
  name: string;
  realName: string;
  bio: string;
  goal: string;
  powers: string[];
  threat: "Planetary" | "Cosmic" | "Multiversal" | "Global" | "Regional";
  appearances: string[];
  defeatedBy: string[];
  color: string;
  quote: string;
}

export type Phase = "Фаза 1" | "Фаза 2" | "Фаза 3" | "Фаза 4" | "Фаза 5" | "Фаза 6";

export interface Movie {
  slug: string;
  title: string;
  originalTitle: string;
  year: number;
  phase: Phase;
  type: "Фильм" | "Сериал";
  description: string;
  rating: number; // 0-10
  heroes: string[];
  director: string;
  boxOffice?: string;
  runtime?: string;
  posterColor: [string, string]; // gradient pair for placeholder poster
}

export interface InfinityStoneData {
  id: StoneColor;
  name: string;
  nameRu: string;
  color: string;
  glowColor: string;
  power: string;
  location: string;
  firstAppearance: string;
  description: string;
}

export interface Universe {
  id: string;
  name: string;
  designation: string;
  description: string;
  color: string;
  keyFigures: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  realm: string;
  color: string;
  position: [number, number, number];
}

export interface Battle {
  slug: string;
  name: string;
  movie: string;
  year: number;
  description: string;
  combatants: string[];
  outcome: string;
  color: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Кадры" | "Арты" | "Комиксы" | "Концепт-арты";
  color: [string, string];
  height: "short" | "medium" | "tall";
}
