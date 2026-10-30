import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const mode = process.argv[3] || "flick";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
const topOf = () => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
// approach to ~ 1.3 screens above
for (let i = 0; i < 400; i++) {
  const t = await topOf();
  if (t < 1300 && t > 1100) break;
  await page.mouse.wheel(0, Math.max(-400, Math.min(400, t - 1200)));
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1500);
await page.mouse.move(720, 450);
await page.evaluate((s) => { window.__rec = []; const el = document.querySelector(s); const t = () => { window.__rec.push([performance.now() | 0, +el.getBoundingClientRect().top.toFixed(1), +scrollY.toFixed(1)]); if (window.__rec.length < 4000) requestAnimationFrame(t); }; requestAnimationFrame(t); }, sel);
if (mode === "hard") {
  let d = 400;
  for (let i = 0; i < 60 && d > 3; i++) { await page.mouse.wheel(0, d); await page.waitForTimeout(16); d *= 0.95; }
} else if (mode === "burst") {
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(8); }
} else if (mode === "flick") {
  // a trackpad-like flick: decaying wheel deltas every ~16ms
  let d = 120;
  for (let i = 0; i < 60 && d > 3; i++) { await page.mouse.wheel(0, d); await page.waitForTimeout(16); d *= 0.93; }
} else {
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(40); }
}
await page.waitForTimeout(1500);
const rec = await page.evaluate(() => window.__rec);
// print the frames around where top crosses small values
let started = rec.findIndex((r, i) => i > 0 && r[1] !== rec[0][1]);
const out = rec.slice(Math.max(0, started - 1)).filter((r, i, a) => i === 0 || r[1] !== a[i - 1][1]);
let min = Infinity, back = 0;
for (let i = 1; i < out.length; i++) { if (out[i][1] > out[i - 1][1] + 0.5) back++; min = Math.min(min, out[i][1]); }
console.log(sel, mode, "frames", out.length, "minTop", min, "upwardMoves", back);
console.log(out.filter((r) => r[1] < 400 && r[1] > -400).map((r) => r[1]).join(" "));
await browser.close();
