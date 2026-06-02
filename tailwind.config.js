/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./stores/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        surface: "#F5F5F5",
        "surface-raised": "#EBEBEB",
        "surface-input": "#FAFAFA",
        border: "#E0E0E0",
        accent: "#1DB954",
        "accent-muted": "#1DB95420",
        primary: "#111111",
        secondary: "#555555",
        disabled: "#AAAAAA",
        danger: "#FF4C4C",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
      },
      fontFamily: {
        serif: ["DMSerifDisplay_400Regular"],
        sans: ["DMSans_400Regular"],
        "sans-medium": ["DMSans_500Medium"],
        "sans-bold": ["DMSans_700Bold"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
