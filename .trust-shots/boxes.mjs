import { chromium } from "../node_modules/playwright/index.mjs";
const which = (process.argv[2] || "6,7,9,10").split(",").map(Number);
const vw = Number(process.argv[3] || 1440), vh = Number(process.argv[4] || 900);
const tag = process.argv[5] || "desk";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: vw, height: vh } })).newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 700)); });
page.on("pageerror", (e) => console.log("PAGEERR", String(e).slice(0, 700)));
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate(() => { const el = document.querySelector(".earlypreview-product"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); });
await page.waitForTimeout(3000);
await page.mouse.move(vw / 2, vh / 2);
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(70); }
await page.waitForTimeout(1500);
for (const idx of which) {
  for (let s = 0; s < 120; s++) {
    const left = await page.evaluate((k) => document.querySelectorAll(".earlypreview-product__slide")[k].getBoundingClientRect().left, idx);
    const stageLeft = await page.evaluate(() => document.querySelector(".earlypreview-product__stage").getBoundingClientRect().left);
    if (Math.abs(left - stageLeft) < 30) break;
    await page.mouse.wheel(0, left > stageLeft ? 30 : -30);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1500);
  const r = await page.evaluate((k) => { const b = document.querySelectorAll(".earlypreview-product__box")[k].getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, idx);
  await page.screenshot({ path: `.trust-shots/box-${tag}-${idx}.png`, clip: { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(vw, r.w + 16), height: Math.min(vh - Math.max(0, r.y - 8), r.h + 90) } });
  console.log(idx, JSON.stringify(r));
}
await browser.close();
