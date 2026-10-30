import { chromium, devices } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(7000);
const sel = ".earlypreview-product";
const topOf = () => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
for (let i = 0; i < 400; i++) { const t = await topOf(); if (t < 900 && t > 700) break; await page.mouse.wheel(0, Math.max(-400, Math.min(400, t - 800))); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.evaluate(() => {
  window.__rec = [];
  const q = (s) => document.querySelector(s);
  const t = () => {
    const sec = q(".earlypreview-product").getBoundingClientRect();
    const tr = q(".earlypreview-product-track").getBoundingClientRect();
    const title = q(".earlypreview-product__title").getBoundingClientRect();
    const box = q(".earlypreview-product__box").getBoundingClientRect();
    window.__rec.push([performance.now() | 0, +scrollY.toFixed(1), +tr.top.toFixed(1), +sec.top.toFixed(1), +title.top.toFixed(1), +box.top.toFixed(1), +box.left.toFixed(1)]);
    if (window.__rec.length < 6000) requestAnimationFrame(t);
  };
  requestAnimationFrame(t);
});
for (let i = 0; i < 70; i++) { await page.mouse.wheel(0, 30); await page.waitForTimeout(50); }
await page.waitForTimeout(1500);
const rec = await page.evaluate(() => window.__rec);
console.log("t scrollY track.top sec.top title.top box.top box.left");
let prev = null;
for (const r of rec) { if (!prev || r.slice(1).join() !== prev.slice(1).join()) console.log(r.join("\t")); prev = r; }
await browser.close();
