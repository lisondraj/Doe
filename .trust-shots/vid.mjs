import { chromium } from "../node_modules/playwright/index.mjs";

// node vid.mjs <route> <label> <sectionIndex> <seconds...>
const dir = new URL(".", import.meta.url).pathname;
const [, , route, label, section = "0", ...times] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:3000/${route}`, { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(6000);
for (let i = 0; i < +section; i++) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(800);
}
let last = 0;
for (const t of times) {
  await page.waitForTimeout((+t - last) * 1000);
  last = +t;
  const file = `${dir}${label}-${t}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 70 });
  console.log(file);
}
await browser.close();
