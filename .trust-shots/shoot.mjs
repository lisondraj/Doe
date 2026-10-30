import { chromium } from "../node_modules/playwright/index.mjs";

const [, , section, label, w, h, phone, ps = "1.6,3.6,5.6,7.5"] = process.argv;
const dir = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const files = [];
for (const p of ps.split(",")) {
  await page.goto(`http://localhost:3000/trust-preview?s=${section}&p=${p}${phone === "1" ? "&phone=1" : ""}`, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(600);
  await page.evaluate(() => document.fonts.ready);
  const file = `${dir}${label}-${p}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 72 });
  files.push(file);
}
await browser.close();
console.log(files.join("\n"));
