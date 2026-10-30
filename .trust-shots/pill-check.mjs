import { chromium, devices } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
for (const [name, ctxOpts] of [["desk", { viewport: { width: 1440, height: 900 } }], ["phone", { ...devices["iPhone 14"] }]]) {
  const page = await (await browser.newContext(ctxOpts)).newPage();
  await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
  await page.waitForTimeout(4000);
  for (let i = 0; i < 60; i++) {
    const top = await page.evaluate(() => document.querySelector(".earlypreview-product-track").getBoundingClientRect().top);
    if (top <= 2) break;
    await page.mouse.wheel(0, Math.min(400, top));
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: `.trust-shots/pill-${name}-a.png` });
  const m = await page.evaluate(() => Array.from(document.querySelectorAll(".earlypreview-product__slide-title")).slice(0, 4).map((t) => {
    const box = t.closest(".earlypreview-product__slide").querySelector(".earlypreview-product__box").getBoundingClientRect();
    const r = t.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), boxW: Math.round(box.width), overflow: Math.round(r.right - box.right), border: getComputedStyle(t).borderTopColor, bg: getComputedStyle(t).backgroundColor };
  }));
  console.log(name, JSON.stringify(m));
}
await browser.close();
