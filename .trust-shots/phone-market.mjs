import { chromium, devices } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);
const sel = process.argv[2] || ".earlypreview-market";
for (let i = 0; i < 300; i++) {
  const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
  if (top <= 2) break;
  await page.mouse.wheel(0, Math.min(400, top));
  await page.waitForTimeout(100);
}
await page.waitForTimeout(1500);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(2500);
await page.screenshot({ path: ".trust-shots/phone-market.png" });
console.log(await page.evaluate((s) => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const sec = document.querySelector(s);
  return JSON.stringify({ innerH: innerHeight, nav: r(sec.querySelector("[class*=__nav]")), skip: r(sec.querySelector("[class*=skip]")), skipClass: sec.querySelector("[class*=skip]")?.className });
}, sel));
await browser.close();
