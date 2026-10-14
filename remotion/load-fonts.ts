import { loadFont as loadDmSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { continueRender, delayRender } from "remotion";

import mackinacBook from "../fonts/p22-mackinac/P22Mackinac-Book.otf";
import mackinacMedium from "../fonts/p22-mackinac/P22Mackinac-Medium.otf";

/** Match /motion4 preview typography in headless render (Next.js fonts unavailable). */
loadInter("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

loadLora("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

loadDmSans("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

/** Family name must match the `--font-p22-mackinac` fallback in remotion/video1/theme.ts. */
const mackinacHandle = delayRender("Loading P22 Mackinac");
Promise.all(
  [
    { src: mackinacBook, weight: "400" },
    { src: mackinacMedium, weight: "500" },
  ].map(({ src, weight }) => new FontFace("P22 Mackinac Pro", `url(${src}) format("opentype")`, { weight }).load()),
)
  .then((faces) => faces.forEach((face) => document.fonts.add(face)))
  .finally(() => continueRender(mackinacHandle));
