import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0a0f",
        accent: "#00d4ff",
        "accent-purple": "#7b61ff",
      },
    },
  },
  plugins: [],
} satisfies Config;
