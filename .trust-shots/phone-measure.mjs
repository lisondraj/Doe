import { chromium, devices } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);
for (let i = 0; i < 200; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product-track").getBoundingClientRect().top);
  if (top <= 2) break;
  await page.mouse.wheel(0, Math.min(400, top));
  await page.waitForTimeout(120);
}
await page.waitForTimeout(800);
const out = await page.evaluate(() => {
  const sec = document.querySelector(".earlypreview-product");
  const pick = (sel) => {
    const el = sec.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { sel, y: Math.round(b.y), h: Math.round(b.height), bottom: Math.round(b.bottom), pb: cs.paddingBottom, mb: cs.marginBottom };
  };
  return {
    rem: getComputedStyle(document.documentElement).fontSize,
    appVh: getComputedStyle(document.documentElement).getPropertyValue("--app-vh"),
    secStyle: { pb: getComputedStyle(sec).paddingBottom, h: getComputedStyle(sec).height, pos: getComputedStyle(sec).position },
    items: [
      pick(".earlypreview-product__head"),
      pick(".earlypreview-product__frame"),
      pick(".earlypreview-product__stage"),
      pick(".earlypreview-product__track"),
      pick(".earlypreview-product__box"),
      pick(".earlypreview-product__slide-title"),
      pick(".earlypreview-product__nav"),
      pick(".doehealth-desk2-visible__skip"),
    ],
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
