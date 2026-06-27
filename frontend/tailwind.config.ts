import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in":    "fadeIn 0.5s ease-out both",
        "slide-up":   "slideUp 0.5s ease-out both",
        "slide-up-d": "slideUp 0.5s 0.15s ease-out both",
        "float":      "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "aurora-1":   "aurora1 12s ease-in-out infinite",
        "aurora-2":   "aurora2 15s ease-in-out infinite",
        "aurora-3":   "aurora3 10s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "scan":       "scan 2s linear infinite",
        "bounce-dot": "bounceDot 1.2s ease-in-out infinite",
        "spin-slow":  "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        aurora1: {
          "0%, 100%": { transform: "translate(0px, 0px)   scale(1)" },
          "33%":      { transform: "translate(60px, -40px) scale(1.2)" },
          "66%":      { transform: "translate(-40px, 30px) scale(0.85)" },
        },
        aurora2: {
          "0%, 100%": { transform: "translate(0px, 0px)   scale(1)" },
          "33%":      { transform: "translate(-60px, 50px) scale(1.15)" },
          "66%":      { transform: "translate(50px, -30px) scale(0.9)" },
        },
        aurora3: {
          "0%, 100%": { transform: "translate(0px, 0px)  scale(1)" },
          "50%":      { transform: "translate(40px, 60px) scale(1.25)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px 2px rgba(124,58,237,0.35)" },
          "50%":      { boxShadow: "0 0 24px 6px rgba(124,58,237,0.65), 0 0 48px 10px rgba(124,58,237,0.2)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        scan: {
          "0%":   { top: "-2px", opacity: "0" },
          "5%":   { opacity: "1" },
          "95%":  { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%":            { transform: "scale(1.1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
