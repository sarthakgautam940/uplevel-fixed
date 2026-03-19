import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#07090F",
        surface: { 1: "#0C0F18", 2: "#111520", 3: "#181D2C" },
        // Ice-blue — water, cool elements
        gold: { DEFAULT: "#8BA8C4", light: "#B8CDD9", dim: "#3A5A72" },
        accent: { DEFAULT: "#8BA8C4", light: "#B8CDD9", dim: "#3A5A72" },
        // Warm amber — fire, CTA, premium gold
        warm: { DEFAULT: "#C49A4C", light: "#E0B86A", dim: "#7A5C20" },
        water: { DEFAULT: "#1A3A52", light: "#2A5A7A" },
        text: { primary: "#EEF0F4", secondary: "#9AA4B2", dim: "#4A5568", ghost: "#1A1F2E" },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        condensed: ["'Barlow Condensed'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "drift-slow": "drift 25s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "scroll-line": "scrollLine 1.5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "fade-up": "fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "breathe": "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "100%": { transform: "translate(40px, -30px) scale(1.05)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(196,154,76,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(196,154,76,0.55)" },
        },
        scrollLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "30%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(200%)", opacity: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.01)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-warm": "linear-gradient(135deg, #C49A4C 0%, #E0B86A 100%)",
        "gradient-dark": "linear-gradient(180deg, rgba(7,9,15,0) 0%, rgba(7,9,15,0.7) 50%, rgba(7,9,15,1) 100%)",
      },
      boxShadow: {
        "glow-warm-sm": "0 0 20px rgba(196,154,76,0.2)",
        "glow-warm-md": "0 0 40px rgba(196,154,76,0.3)",
        "glow-warm-lg": "0 0 60px rgba(196,154,76,0.4)",
        "glow-cool-sm": "0 0 20px rgba(139,168,196,0.15)",
        "card": "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.4)",
        "lifted": "0 1px 0 rgba(255,255,255,0.06) inset, 0 40px 80px rgba(0,0,0,0.6)",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        elastic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
