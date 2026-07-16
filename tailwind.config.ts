/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Bitcount Grid Double", "system-ui"],
        body: ["Bitcount Prop Single", "system-ui"],
        sans: ["Barrio", "system-ui"],
        display: ["Bangers", "system-ui"],
        "sans-alt": ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
