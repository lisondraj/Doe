import { loadFont as loadDmSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

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
