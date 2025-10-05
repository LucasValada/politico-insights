/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // azul bonito
        secondary: "#9333ea", // roxo
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  darkMode: "class", // habilita modo dark via class="dark"
  plugins: [],
};
