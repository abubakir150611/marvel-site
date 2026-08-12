"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// Cinematic comic-style boot loader shown once on first paint.
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tween = gsap.to(
      { value: 0 },
      {
        value: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].value));
        },
        onComplete: () => {
          setTimeout(() => setVisible(false), 250);
        },
      }
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-marvel-black"
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="comic-title text-6xl text-marvel-red [filter:drop-shadow(0_0_20px_rgba(237,29,36,0.7))] animate-pulse-glow"
          >
            MCU
          </motion.span>
          <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-marvel-red" style={{ width: `${progress}%` }} />
          </div>
          <span className="mt-3 font-display text-xs tracking-[0.3em] text-white/40">ЗАГРУЗКА ВСЕЛЕННОЙ {progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
