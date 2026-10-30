import { chromium, devices } from "../node_modules/playwright/index.mjs";
const phone = process.argv[2] === "phone";
const tag = process.argv[3] || "b";
const browser = await chromium.launch();
const ctx = await browser.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(8000);
const rect = () => page.evaluate(() => { const b = document.querySelector(".earlypreview-beige-blank").getBoundingClientRect(); return { top: b.top, h: b.height, vh: innerHeight }; });
// walk down by wheel until the band's top is at the given viewport y, then shoot
async function toTop(y) {
  for (let i = 0; i < 400; i++) {
    const r = await rect();
    if (Math.abs(r.top - y) < 30) return r;
    await page.mouse.wheel(0, Math.max(-200, Math.min(200, r.top - y)));
    await page.waitForTimeout(90);
  }
  return rect();
}
const out = [];
for (const [i, y] of [[0, phone ? 120 : 110], [1, phone ? 60 : 60], [2, phone ? 0 : -20]]) {
  const r = await toTop(y);
  await page.waitForTimeout(1800);
  out.push(r);
  await page.screenshot({ path: `.trust-shots/${tag}-${i}.jpg`, quality: 70, type: "jpeg" });
}
// bottom edge: band bottom at ~ 60% of viewport
for (const [i, frac] of [[3, 0.75], [4, 0.45]]) {
  for (let k = 0; k < 400; k++) {
    const r = await rect();
    const bottom = r.top + r.h;
    const want = r.vh * frac;
    if (Math.abs(bottom - want) < 30) break;
    await page.mouse.wheel(0, Math.max(-200, Math.min(200, bottom - want)));
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.trust-shots/${tag}-${i}.jpg`, quality: 70, type: "jpeg" });
}
console.log(JSON.stringify(out));
await browser.close();
