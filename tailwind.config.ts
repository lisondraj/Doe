import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
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
  plugins: [
    plugin(({ addVariant }) => {
      /** Legacy hooks if html[data-layout] is set elsewhere */
      addVariant("layout-phone", `[data-layout="phone"] &`);
      addVariant("layout-desktop", `[data-layout="desktop"] &`);
      /** Narrow viewports (< md) — real responsive mobile, not a data-attribute “force phone”. */
      addVariant("iphone-page", "@media (max-width: 767px) { & }");
    }),
  ],
};

export default config;
