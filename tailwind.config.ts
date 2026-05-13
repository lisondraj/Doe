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
      /** Optional: mirrors narrow layout (≤639px) for html[data-layout]; page uses max-[639px] / min-[640px] in markup. */
      addVariant("layout-phone", `[data-layout="phone"] &`);
      addVariant("layout-desktop", `[data-layout="desktop"] &`);
    }),
  ],
};

export default config;
