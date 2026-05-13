import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

/** Transparent SVG favicon: “D” in Lora (same face as the Doe logo). */
export default async function Icon() {
  const fontBytes = await readFile(
    join(process.cwd(), "app/fonts/lora-latin-400-normal.woff2")
  );
  const font = fontBytes.toString("base64");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <style><![CDATA[
      @font-face {
        font-family: "Lora";
        font-style: normal;
        font-weight: 400;
        src: url(data:font/woff2;base64,${font}) format("woff2");
      }
    ]]></style>
  </defs>
  <text x="16" y="17" text-anchor="middle" dominant-baseline="central" font-family="Lora, serif" font-size="21" fill="#171717">D</text>
</svg>`;

  return new Response(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
