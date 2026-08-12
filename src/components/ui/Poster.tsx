interface PosterProps {
  title: string;
  colors: [string, string];
  className?: string;
  compact?: boolean;
}

// Stylized comic-poster placeholder (no licensed artwork) built from
// gradients, halftone texture and the movie title in comic lettering.
export default function Poster({ title, colors, className = "", compact = false }: PosterProps) {
  return (
    <div
      className={`halftone relative flex items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(155deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rotate-12 rounded-full bg-white/10 blur-xl" />
      <span
        className={`comic-title relative z-10 p-3 leading-[0.95] text-white ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`}
      >
        {title}
      </span>
    </div>
  );
}
