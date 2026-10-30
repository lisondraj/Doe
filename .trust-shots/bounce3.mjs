import { chromium } from "../node_modules/playwright/index.mjs";
const mode = process.argv[2] || "flick";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
const sel = ".earlypreview-product";
const topOf = () => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
for (let i = 0; i < 400; i++) { const t = await topOf(); if (t < 1300 && t > 1100) break; await page.mouse.wheel(0, Math.max(-400, Math.min(400, t - 1200))); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.mouse.move(720, 450);
await page.evaluate(() => {
  window.__rec = [];
  const q = (s) => document.querySelector(s);
  const t = () => {
    const sec = q(".earlypreview-product").getBoundingClientRect();
    const title = q(".earlypreview-product__title").getBoundingClientRect();
    const box = q(".earlypreview-product__box").getBoundingClientRect();
    const nav = q(".doehealth-desk2-nav, nav");
    const hd=q(".earlypreview-product__head"); window.__rec.push([performance.now() | 0, +sec.top.toFixed(1), +title.top.toFixed(1), +box.left.toFixed(1), +box.top.toFixed(1), hd.style.getPropertyValue("--y"), q(".earlypreview-product__track").style.getPropertyValue("--k")]);
    if (window.__rec.length < 6000) requestAnimationFrame(t);
  };
  requestAnimationFrame(t);
});
let d = mode === "hard" ? 400 : 120;
const k = mode === "hard" ? 0.95 : 0.93;
for (let i = 0; i < 80 && d > 3; i++) { await page.mouse.wheel(0, d); await page.waitForTimeout(16); d *= k; }
// then keep scrolling slowly so the lock advances
for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
await page.waitForTimeout(1200);
const rec = await page.evaluate(() => window.__rec);
const rows = rec.filter((r, i, a) => i === 0 || r[5] !== a[i - 1][5] || r[6] !== a[i - 1][6] || r[1] !== a[i - 1][1]);
console.log("t sec.top title.top box.left box.top --y --k");
for (const r of rows.slice(0, 80)) console.log(r.join("\t"));
console.log("ADV", JSON.stringify((await page.evaluate(() => window.__adv || [])).slice(0, 120)));
await browser.close();
