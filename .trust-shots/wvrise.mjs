import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForSelector(".earlypreview-product", { timeout: 120000 });
await page.waitForTimeout(5000);
for (let i = 0; i < 400; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product")?.getBoundingClientRect().top ?? 9999);
  if (top <= 30) break;
  await page.mouse.wheel(0, Math.min(400, Math.max(20, top - 30)));
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1200);
let n = 0;
const shots = [];
for (const extra of [0, 12, 22]) {
  for (let i = 0; i < extra; i++) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `.trust-shots/wvr-${n}.jpg`, quality: 70, type: "jpeg" });
  shots.push(await page.evaluate((n) => {
    const q = (s) => document.querySelector(s);
    const r = (el) => { const b = el.getBoundingClientRect(); return { y: Math.round(b.y), h: Math.round(b.height) }; };
    return { n, titleOp: getComputedStyle(q(".earlypreview-product__title")).opacity, rise: getComputedStyle(q(".earlypreview-product__wave")).getPropertyValue("--wv-rise"), head: r(q(".earlypreview-product__head")), wave: r(q(".earlypreview-product__wave")), frame: r(q(".earlypreview-product__frame")) };
  }, n));
  n++;
}
console.log(JSON.stringify(shots, null, 2));
await browser.close();
