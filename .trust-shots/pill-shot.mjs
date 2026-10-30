import { chromium, devices } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
for (const [name, ctxOpts] of [["desk", { viewport: { width: 1440, height: 900 } }], ["phone", { ...devices["iPhone 14"] }]]) {
  const page = await (await browser.newContext(ctxOpts)).newPage();
  await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
  await page.waitForTimeout(12000);
  for (let i = 0; i < 80; i++) {
    const top = await page.evaluate(() => document.querySelector(".earlypreview-product-track").getBoundingClientRect().top);
    if (top <= 2) break;
    await page.mouse.wheel(0, Math.min(400, top));
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(1500);
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(150); }
  await page.waitForTimeout(1500);
  const c = await page.evaluate(() => Array.from(document.querySelectorAll(".earlypreview-product__ui")).map((u) => u.childElementCount));
  console.log(name, "mounted", JSON.stringify(c));
  await page.screenshot({ path: `.trust-shots/pill-${name}-b.png` });
  await page.close();
}
await browser.close();
