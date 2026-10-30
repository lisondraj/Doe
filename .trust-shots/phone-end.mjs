import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(3000);
const info = () => page.evaluate(() => {
  const s = document.querySelector(".earlypreview-market"), t = s.parentElement;
  const r = s.getBoundingClientRect(), tr = t.getBoundingClientRect();
  return { secTop: Math.round(r.top), secH: Math.round(r.height), trackTop: Math.round(tr.top), trackH: Math.round(tr.height), vh: innerHeight, pos: s.style.position, y: Math.round(scrollY) };
});
// Natural scroll to just before the end of the track.
await page.evaluate(() => { const t = document.querySelector(".earlypreview-market-track"); scrollTo(0, t.getBoundingClientRect().top + scrollY + t.offsetHeight - document.querySelector(".earlypreview-market").offsetHeight - 40); });
await page.waitForTimeout(600);
console.log("near end", await info());
await page.evaluate(() => scrollBy(0, 60));
await page.waitForTimeout(800);
console.log("after end", await info());
await page.screenshot({ path: ".trust-shots/ipend-0.jpg", type: "jpeg", quality: 70 });
await browser.close();
