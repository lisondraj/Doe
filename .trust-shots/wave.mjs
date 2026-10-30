import { chromium, devices } from "../node_modules/playwright/index.mjs";
const phone = process.argv[2] === "phone";
const tag = process.argv[3] || "w";
const browser = await chromium.launch();
const ctx = await browser.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
for (let i = 0; i < 300; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product").getBoundingClientRect().top);
  if (top <= (phone ? 2 : 30)) break;
  await page.mouse.wheel(0, Math.min(400, Math.max(20, top - (phone ? 0 : 30))));
  await page.waitForTimeout(100);
}
await page.waitForTimeout(1500);
const steps = [0, 8, 14, 14, 14, 14];
let n = 0;
for (const s of steps) {
  for (let i = 0; i < s; i++) { await page.mouse.wheel(0, phone ? 60 : 40); await page.waitForTimeout(80); }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `.trust-shots/${tag}-${n++}.jpg`, quality: 70, type: "jpeg" });
}
console.log(await page.evaluate(() => { const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }; const q = (s) => document.querySelector(s); return JSON.stringify({ head: r(q(".earlypreview-product__head")), title: r(q(".earlypreview-product__title")), wave: r(q(".earlypreview-product__wave")), frame: r(q(".earlypreview-product__frame")), box: r(q(".earlypreview-product__box")), op: getComputedStyle(q(".earlypreview-product__wave")).opacity, titleOp: getComputedStyle(q(".earlypreview-product__title")).opacity }); }));
await browser.close();
