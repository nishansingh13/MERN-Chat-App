/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",         // Scan the HTML file
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS, JSX, TS, and TSX files in the src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
