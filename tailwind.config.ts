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
      /** Forces phone/iPhone breakpoints even on wide viewports (see layout.tsx data-doeforvc-always-phone). */
      addVariant("iphone-page", 'html[data-doeforvc-always-phone="true"] &');
    }),
  ],
};

export default config;
