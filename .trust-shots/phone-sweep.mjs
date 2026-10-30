import { chromium, devices } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);

// bring the product track's top to the top of the screen, scrolling in steps so lazy sections mount
for (let i = 0; i < 200; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product-track").getBoundingClientRect().top);
  if (top <= 2) break;
  await page.mouse.wheel(0, Math.min(400, top));
  await page.waitForTimeout(120);
}
await page.waitForTimeout(800);

for (let i = 0; i < 30; i++) {
  const r = await page.evaluate(() => {
    const t = document.querySelector(".earlypreview-product-track");
    const sec = document.querySelector(".earlypreview-product");
    const btn = sec?.querySelector(".doehealth-desk2-visible__skip");
    const b = btn?.getBoundingClientRect();
    return {
      trackTop: Math.round(t.getBoundingClientRect().top),
      trackH: t.offsetHeight,
      secTop: Math.round(sec.getBoundingClientRect().top),
      skip: b ? `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}` : null,
    };
  });
  console.log(i, JSON.stringify(r));
  if (i === 3) await page.screenshot({ path: ".trust-shots/phone-sweep-3.png" });
  if (i === 14) await page.screenshot({ path: ".trust-shots/phone-sweep-14.png" });
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(250);
}
await browser.close();
