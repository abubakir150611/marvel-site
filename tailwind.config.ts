import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        marvel: {
          red: "#ED1D24",
          "red-dark": "#B0060F",
          black: "#0A0A0C",
          "black-soft": "#121214",
          white: "#F5F5F7",
          gold: "#D4AF37",
        },
        stone: {
          space: "#3B82F6",
          mind: "#FACC15",
          reality: "#EF4444",
          power: "#8B5CF6",
          time: "#22C55E",
          soul: "#F97316",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        comic: ["var(--font-comic)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(237,29,36,0.18) 0%, rgba(10,10,12,0) 70%)",
        "grid-pattern":
          "linear-gradient(rgba(237,29,36,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(237,29,36,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        neon: "0 0 5px rgba(237,29,36,0.6), 0 0 20px rgba(237,29,36,0.4), 0 0 40px rgba(237,29,36,0.2)",
        "neon-white": "0 0 5px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 16s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        flicker: "flicker 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.4)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 22%, 24%, 55%": { opacity: "0.4" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
