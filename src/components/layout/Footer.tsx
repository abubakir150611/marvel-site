"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

const SOCIALS = [
  { name: "X", href: "https://x.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "Discord", href: "https://discord.com" },
];

const FOOTER_LINKS = [
  { title: "Вселенная", links: [{ label: "Таймлайн", href: "/#timeline" }, { label: "Карта", href: "/#map" }, { label: "Мультивселенная", href: "/#multiverse" }] },
  { title: "Персонажи", links: [{ label: "Герои", href: "/#heroes" }, { label: "Злодеи", href: "/#villains" }] },
  { title: "Медиа", links: [{ label: "Галерея", href: "/#gallery" }, { label: "Битвы", href: "/#battles" }] },
];

export default function Footer() {
  const { playHover, playClick } = useSound();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-marvel-red/20 bg-marvel-black-soft">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <motion.span
              initial={{ opacity: 0.6 }}
              whileInView={{ opacity: 1 }}
              className="comic-title inline-block text-4xl text-marvel-red [filter:drop-shadow(0_0_10px_rgba(237,29,36,0.7))]"
            >
              MCU
            </motion.span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-marvel-white/60">
              Неофициальный фан-портал, посвящённый Кинематографической вселенной Marvel. Сделано с любовью к комиксам и кино.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-lg tracking-widest text-marvel-white">{group.title}</h4>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onMouseEnter={playHover}
                      onClick={playClick}
                      className="text-sm text-marvel-white/60 transition-colors hover:text-marvel-red"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-marvel-white/40">
            © {new Date().getFullYear()} MCU Universe. Все права на персонажей принадлежат Marvel Studios. Фан-проект.
          </p>
          <div className="flex gap-4">
            {SOCIALS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor-hover
                className="flex h-10 w-10 items-center justify-center rounded-full border border-marvel-red/30 text-xs font-display tracking-wide text-marvel-white/70 transition-all hover:border-marvel-red hover:text-marvel-red hover:shadow-neon"
              >
                {social.name.slice(0, 2)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
