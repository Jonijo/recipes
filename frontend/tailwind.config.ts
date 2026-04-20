import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        paper: "#FBF8F2",
        cream: "#F3ECDC",
        ink: {
          DEFAULT: "#1C1410",
          2: "#4A3F36",
        },
        terracotta: {
          DEFAULT: "#B84A2B",
          soft: "#F1D7CA",
        },
        sage: "#5C6E3C",
        brass: "#B07527",
      },
      letterSpacing: {
        "widest-er": "0.2em",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-scale": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out both",
        "fade-scale": "fade-scale 700ms ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
