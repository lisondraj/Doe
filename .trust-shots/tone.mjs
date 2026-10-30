import { chromium } from "../node_modules/playwright/index.mjs";
import { readFileSync } from "node:fs";
const browser = await chromium.launch();
const page = await browser.newPage();
const files = process.argv.slice(2);
const out = [];
for (const f of files) {
  const url = "data:image/png;base64," + readFileSync(f).toString("base64");
  const s = await page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    // bucket by lightness, average colour per bucket, for pixels that aren't the dot background
    const buckets = {};
    for (let i = 0; i < d.length; i += 4 * 3) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const L = Math.round((0.2126 * r + 0.7152 * g + 0.0722 * b) / 32) * 32;
      const k = L;
      const bk = (buckets[k] ||= { n: 0, r: 0, g: 0, b: 0 });
      bk.n++; bk.r += r; bk.g += g; bk.b += b;
    }
    const total = Object.values(buckets).reduce((a, v) => a + v.n, 0);
    return Object.entries(buckets)
      .filter(([, v]) => v.n / total > 0.03)
      .map(([L, v]) => `L${L}:${Math.round(v.r / v.n)},${Math.round(v.g / v.n)},${Math.round(v.b / v.n)}(${Math.round((100 * v.n) / total)}%)`)
      .join(" ");
  }, url);
  out.push(`${f}\n  ${s}`);
}
console.log(out.join("\n"));
await browser.close();
