import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const speed = Number(process.argv[3] || 2500);
const dist = Number(process.argv[4] || 1500);
const src = process.argv[5] || "mouse";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
const cdp = await ctx.newCDPSession(page);
const topOf = () => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
for (let i = 0; i < 400; i++) { const t = await topOf(); if (t < 1500 && t > 1300) break; await page.mouse.wheel(0, Math.max(-400, Math.min(400, t - 1400))); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.evaluate((s) => { window.__rec = []; const el = document.querySelector(s); const t = () => { window.__rec.push([performance.now() | 0, +el.getBoundingClientRect().top.toFixed(1), +scrollY.toFixed(1)]); if (window.__rec.length < 4000) requestAnimationFrame(t); }; requestAnimationFrame(t); }, sel);
await cdp.send("Input.synthesizeScrollGesture", { x: 720, y: 450, yDistance: -dist, speed, gestureSourceType: src, preventFling: false });
await page.waitForTimeout(2000);
const rec = await page.evaluate(() => window.__rec);
const out = rec.filter((r, i, a) => i === 0 || r[1] !== a[i - 1][1]);
let min = Infinity, up = 0;
for (let i = 1; i < out.length; i++) { if (out[i][1] > out[i - 1][1] + 0.5) up++; min = Math.min(min, out[i][1]); }
console.log(sel, src, speed, dist, "minTop", min, "upward", up);
console.log(out.filter((r) => r[1] < 500 && r[1] > -500).map((r) => `${r[1]}`).join(" "));
await browser.close();
