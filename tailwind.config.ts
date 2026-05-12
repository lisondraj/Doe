import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      /* Same rules as page.tsx isPhoneLayout — portrait large iPhones + landscape phones. */
      screens: {
        phone: {
          raw: "(max-width: 480px), ((max-height: 500px) and (min-width: 500px) and (pointer: coarse))",
        },
      },
      fontFamily: {
        ui: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
