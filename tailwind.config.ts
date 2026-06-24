import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        script: ["var(--font-dancing)", "cursive"],
        cinzel: ["var(--font-cinzel)", "serif"],
      },
      colors: {
        maroon: {
          50:  "#fdf2f2",
          100: "#fce4e4",
          200: "#f9b8b8",
          300: "#f48a8a",
          400: "#e85555",
          500: "#c62828",
          600: "#a01010",
          700: "#800000",
          800: "#6b0000",
          900: "#550000",
          950: "#2d0000",
        },
        gold: {
          50:  "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#f5c518",
          500: "#d4af37",
          600: "#b8962e",
          700: "#92740f",
          800: "#78600c",
          900: "#5a4a0a",
          950: "#332a04",
        },
        saffron: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea6c00",
          700: "#c05800",
          800: "#9a4600",
          900: "#7c3800",
          950: "#431d00",
        },
        haldi: {
          50:  "#fefce8",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f0c040",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        ivory: "#FDF5E6",
      },
      backgroundImage: {
        "marathi-gradient":  "linear-gradient(135deg, #FDF5E6 0%, #fefce8 50%, #fff7ed 100%)",
        "marathi-dark":      "linear-gradient(135deg, #1a0505 0%, #1a0a00 50%, #0d0900 100%)",
        "maroon-gold":       "linear-gradient(135deg, #800000 0%, #a01010 50%, #c49b27 100%)",
        "gold-shimmer":      "linear-gradient(90deg, #d4af37, #f5c518, #d4af37, #b8962e, #d4af37)",
        "saffron-burst":     "linear-gradient(135deg, #f97316, #ea6c00, #c05800)",
        "paithani":          "linear-gradient(135deg, #800000 0%, #6b0000 40%, #d4af37 100%)",
      },
      animation: {
        shimmer:      "shimmer 3s linear infinite",
        "fade-in":    "fadeIn 0.5s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        float:        "float 5s ease-in-out infinite",
        "diya-glow":  "diyaGlow 2s ease-in-out infinite",
        "spin-slow":  "spin 8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition: "400% 0" },
        },
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
          "50%":      { transform: "translateY(-8px)" },
        },
        diyaGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212,175,55,0.4), 0 0 30px rgba(212,175,55,0.2)" },
          "50%":      { boxShadow: "0 0 25px rgba(212,175,55,0.7), 0 0 50px rgba(212,175,55,0.4)" },
        },
      },
      boxShadow: {
        maroon:    "0 4px 24px rgba(128, 0, 0, 0.25)",
        "maroon-lg":"0 10px 50px rgba(128, 0, 0, 0.35)",
        gold:      "0 4px 24px rgba(212, 175, 55, 0.3)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
