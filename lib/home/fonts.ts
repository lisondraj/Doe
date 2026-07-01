import { DM_Sans, Inter, Lora, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Hero career carousel — lightest available Lora italic. */
export const loraItalicLight = Lora({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/** Blog meta, eyebrows, and landing card titles — neutral grotesque close to Inter/Suisse Intl with full weight support. */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

/** /proto — geometric grotesque with subtle character (not generic Inter/DM Sans). */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

/** /proto nav wordmark — round geometric sans, distinct from page body type. */
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-outfit",
});

/** Second-section workflow carousel — white in-card UI mocks only (not slide captions). */
export const suisseIntl = localFont({
  src: [
    { path: "../../fonts/suisse/SuisseIntlTrial-Light.otf", weight: "300", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-LightIt.otf", weight: "300", style: "italic" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-RegularIt.otf", weight: "400", style: "italic" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Semibold.otf", weight: "600", style: "normal" },
  ],
  display: "swap",
  weight: "300",
});

/** Light face only — reliable uniform weight for SVG numerals in orbit mocks. */
export const suisseIntlLight = localFont({
  src: [{ path: "../../fonts/suisse/SuisseIntlTrial-Light.otf", weight: "300", style: "normal" }],
  display: "swap",
  weight: "300",
});

/** Hairline face — thin symbols (e.g. +) that match Suisse light body copy. */
export const suisseIntlHairline = localFont({
  src: [{ path: "../../fonts/suisse/SuisseIntlTrial-Hairline.otf", weight: "100", style: "normal" }],
  display: "swap",
  weight: "100",
  variable: "--font-suisse-hairline",
});
export const WORKFLOW_CAROUSEL_UI_PANEL = `${suisseIntl.className} workflow-carousel-ui`;
