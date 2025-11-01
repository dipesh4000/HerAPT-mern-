/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ⬅️ ADD THIS LINE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ee4c7c",        // Soft feminine pink (for buttons, headings)
        "primary-dark": "#c2557dff", // Deeper pink for hover
        accent: "#fbb1b1",         // Pastel accent
        blush: "#ffe5ec",          // Used for backgrounds
        lavender: "#fff0f5",       // Used for backgrounds
        "card-border": "#ffb6b6",  // Soft pink for card borders
      },
    },
  },
  plugins: [],
};
