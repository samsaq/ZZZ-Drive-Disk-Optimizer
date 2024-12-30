import { nextui } from "@nextui-org/theme";
import tailwindcssMotion from "tailwindcss-motion";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        IBM: ["var(--font-IBM)"],
        DOS: ["var(--font-DOS)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), tailwindcssMotion],
};
