import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.addInitScript(() => {
  window.__cc = new Map();
  const orig = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...a) {
    const c = this.canvas;
    const key = (c.className || "canvas") + " | " + (c.parentElement?.className || "").toString().slice(0, 60) + " | " + (c.closest("section")?.className || "").toString().slice(0, 50) + " " + c.width + "x" + c.height;
    window.__cc.set(key, (window.__cc.get(key) || 0) + 1);
    return orig.apply(this, a);
  };
});
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
await page.evaluate(() => window.__cc.clear());
const t0 = Date.now();
for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
const ms = Date.now() - t0;
const res = await page.evaluate(() => [...window.__cc.entries()]);
console.log(sel, "window ms", ms);
for (const [k, v] of res) console.log(v, k);
await browser.close();
