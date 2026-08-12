import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="comic-title text-gradient-marvel text-8xl [filter:drop-shadow(0_0_30px_rgba(237,29,36,0.5))]">404</span>
      <h1 className="mt-4 font-display text-2xl tracking-widest text-white">СТРАНИЦА ИСЧЕЗЛА, КАК ПОСЛЕ ЩЕЛЧКА</h1>
      <p className="mt-3 max-w-md text-white/50">Похоже, эта страница попала под Щелчок Таноса. Вернитесь на главную, чтобы продолжить исследование вселенной.</p>
      <Link
        href="/"
        className="mt-8 rounded-full border-2 border-marvel-red bg-marvel-red/10 px-8 py-3 font-display text-sm tracking-widest text-white shadow-neon transition-transform hover:scale-105"
      >
        НА ГЛАВНУЮ
      </Link>
    </div>
  );
}
