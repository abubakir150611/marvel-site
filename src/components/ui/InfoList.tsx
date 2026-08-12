interface InfoListProps {
  title: string;
  items: string[];
  accent?: string;
}

export default function InfoList({ title, items, accent = "#ED1D24" }: InfoListProps) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm tracking-widest" style={{ color: accent }}>
        {title.toUpperCase()}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-white/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
