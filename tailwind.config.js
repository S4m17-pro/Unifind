/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C8102E",
          hover: "#A50D26",
          soft: "#F8E8EB",
        },
        gold: {
          DEFAULT: "#B89600",
          ink: "#6E5600",
          soft: "#F7F1D4",
        },
        canvas: "#F4F4F2",
        paper: "#FFFFFF",
        bar: "#F2F2F2",
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#4A4A4A",
          subtle: "#6B6B6B",
        },
        line: "#E2E2E0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Source Serif 4", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
