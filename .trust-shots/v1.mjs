import { chromium } from "../node_modules/playwright/index.mjs";

const dir = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/video1", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(4000);
const tabs = ["Structured data", "Communication", "Payments", "End to end"];
let n = 0;
for (const tab of tabs) {
  await page.getByText(tab, { exact: false }).first().click();
  for (const wait of [3500, 5000, 6000]) {
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${dir}v-${String(n++).padStart(2, "0")}.jpg`, type: "jpeg", quality: 60 });
  }
}
await browser.close();
