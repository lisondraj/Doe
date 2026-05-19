import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      /**
       * True desktop/laptop — wide viewport + mouse/trackpad.
       * Excludes phones in landscape (e.g. iPhone 16 Pro Max ~932px) and touch tablets.
       */
      addVariant(
        "wide-desktop",
        "@media (min-width: 1280px) and (hover: hover) and (pointer: fine)"
      );
    }),
  ],
};

export default config;
