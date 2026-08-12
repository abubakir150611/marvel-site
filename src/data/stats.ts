export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export const stats: StatItem[] = [
  { label: "Фильмов", value: 38 },
  { label: "Сериалов", value: 18 },
  { label: "Героев", value: 23 },
  { label: "Злодеев", value: 13 },
  { label: "Миров и реальностей", value: 12 },
];
