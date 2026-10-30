import { chromium } from "../node_modules/playwright/index.mjs";

const dir = new URL(".", import.meta.url).pathname;
const [, , route, label, scrolls = "0"] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:3000${route}`, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(5000);
const ys = scrolls.split(",").map(Number);
for (let k = 0; k < ys.length; k++) {
  await page.evaluate((y) => scrollTo(0, y), ys[k]);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}${label}-${k}.jpg`, type: "jpeg", quality: 70 });
}
await browser.close();
