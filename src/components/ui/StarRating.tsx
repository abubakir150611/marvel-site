export default function StarRating({ rating }: { rating: number }) {
  if (!rating) {
    return <span className="font-display text-xs tracking-widest text-marvel-white/40">СКОРО</span>;
  }
  const stars = Math.round(rating / 2);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < stars ? "text-marvel-gold" : "text-white/15"}>
          ★
        </span>
      ))}
      <span className="ml-1 font-display text-sm text-marvel-white/70">{rating.toFixed(1)}</span>
    </div>
  );
}
