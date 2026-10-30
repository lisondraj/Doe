import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ args: ["--enable-gpu-rasterization"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);

async function measure(label, sectionSel, wheels) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 30);
  }, sectionSel);
  await page.waitForTimeout(1500);
  await page.mouse.move(720, 450);
  await page.evaluate(() => {
    window.__frames = [];
    const tick = (t) => {
      window.__frames.push(t);
      if (window.__frames.length < 4000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  for (let i = 0; i < wheels; i++) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const f = window.__frames;
    const gaps = [];
    for (let i = 1; i < f.length; i++) gaps.push(f[i] - f[i - 1]);
    gaps.sort((a, b) => a - b);
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const long = gaps.filter((g) => g > 50).length;
    return { frames: f.length, meanMs: +mean.toFixed(1), p95Ms: +gaps[Math.floor(gaps.length * 0.95)].toFixed(1), over50ms: long };
  });
  console.log(label, JSON.stringify(r));
}

await measure("product", ".earlypreview-product", 60);
await measure("market", ".earlypreview-market", 60);
await browser.close();
