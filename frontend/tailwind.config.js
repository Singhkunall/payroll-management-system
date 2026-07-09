/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00bfa5", // Your brand teal
        darkSlate: "#0a0f1a", // Deep dashboard background
        cardBg: "rgba(17, 24, 39, 0.6)", // Glassmorphism effect
      },
    },
  },
  plugins: [],
}