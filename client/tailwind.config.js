/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626", // Intense Red (red-600)
        primaryHover: "#b91c1c", // Darker Red for hover states
        darkBg: "#000000", // Pure Black for main backgrounds
        cardBg: "#111827", // Very dark gray for components/cards
        borderColor: "#1f2937", // Subtle dark border
      }
    },
  },
  plugins: [],
}