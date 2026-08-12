"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"}`}
    >
      <span className="mb-3 rounded-full border border-marvel-red/40 bg-marvel-red/10 px-4 py-1 font-display text-xs tracking-[0.3em] text-marvel-red">
        {eyebrow}
      </span>
      <h2 className="section-heading text-gradient-marvel text-4xl sm:text-5xl md:text-6xl">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl text-balance text-marvel-white/60">{description}</p>
      )}
    </motion.div>
  );
}
