import { chromium } from "../node_modules/playwright/index.mjs";
// Wheels down from the hero into the market lock and logs the section's top every frame, to catch an overshoot.
const [, , step = 100] = process.argv;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
await page.mouse.move(720, 450);
await page.evaluate(() => {
  window.__tops = [];
  const s = document.querySelector(".earlypreview-market");
  const tick = () => { window.__tops.push(Math.round(s.getBoundingClientRect().top)); requestAnimationFrame(tick); };
  tick();
});
for (let n = 0; n < 30; n++) { await page.mouse.wheel(0, +step); await page.waitForTimeout(40); }
await page.waitForTimeout(400);
const tops = await page.evaluate(() => window.__tops);
const near = tops.filter((t, i) => t < 400 && (i === 0 || tops[i - 1] !== t));
console.log(`step ${step}: min top ${Math.min(...tops)}, path near the lock: ${near.join(" ")}`);
await browser.close();
