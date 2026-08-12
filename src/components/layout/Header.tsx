"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

const NAV_LINKS = [
  { href: "/#timeline", label: "Таймлайн" },
  { href: "/#heroes", label: "Герои" },
  { href: "/#villains", label: "Злодеи" },
  { href: "/#stones", label: "Камни" },
  { href: "/#multiverse", label: "Мультивселенная" },
  { href: "/#map", label: "Карта" },
  { href: "/#gallery", label: "Галерея" },
  { href: "/#battles", label: "Битвы" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { playHover, playClick } = useSound();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-glass py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" onMouseEnter={playHover} onClick={playClick} className="group flex items-center gap-2">
          <span className="comic-title text-3xl text-marvel-red [filter:drop-shadow(0_0_8px_rgba(237,29,36,0.8))] transition-transform group-hover:scale-105">
            MCU
          </span>
          <span className="hidden font-display text-xl tracking-widest text-marvel-white sm:inline">
            UNIVERSE
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={playHover}
              onClick={playClick}
              className="font-display text-sm tracking-wider text-marvel-white/80 transition-colors hover:text-marvel-red"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          aria-label="Открыть меню"
          onClick={() => {
            setMenuOpen((v) => !v);
            playClick();
          }}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-0.5 w-6 bg-marvel-red transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-marvel-red transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-marvel-red transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass mt-4 overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setMenuOpen(false);
                    playClick();
                  }}
                  className="border-b border-white/5 py-3 font-display text-lg tracking-wider text-marvel-white/90"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
