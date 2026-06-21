import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/** Second-section workflow carousel — white in-card UI mocks only (not slide captions). */
export const suisseIntl = localFont({
  src: [
    { path: "../../fonts/suisse/SuisseIntlTrial-Light.otf", weight: "300", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Semibold.otf", weight: "600", style: "normal" },
  ],
  display: "swap",
  weight: "300",
});
export const WORKFLOW_CAROUSEL_UI_PANEL = `${suisseIntl.className} workflow-carousel-ui`;
