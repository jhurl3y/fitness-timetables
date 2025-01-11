import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-background": "var(--card-background)",
        "card-border": "var(--card-border)",
        highlight: "var(--highlight)",
        "dropdown-bg": "var(--dropdown-bg)",
      },
    },
  },
  plugins: [],
};
export default config;
