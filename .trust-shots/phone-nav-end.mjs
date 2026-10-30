import { chromium } from "../node_modules/playwright/index.mjs";
// iPhone: jump through the market nav to its last stage, shoot it, and measure the index title.
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
  const head = document.querySelector(".earlypreview-market__index-head");
  const h = head.getBoundingClientRect();
  const scene = head.closest(".earlypreview-market__scene");
  const sc = scene.getBoundingClientRect();
  const kids = [...scene.children].map((k) => `${k.className.split(" ")[0]}:${Math.round(k.getBoundingClientRect().top)}/${Math.round(k.getBoundingClientRect().height)}`);
  return JSON.stringify({ secTop: Math.round(s.getBoundingClientRect().top), trackTop: Math.round(t.getBoundingClientRect().top), pos: s.style.position, headTop: Math.round(h.top), headH: Math.round(h.height), transform: getComputedStyle(head).transform, sceneTop: Math.round(sc.top), sceneH: Math.round(sc.height), kids });
});
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-market-track").getBoundingClientRect().top + scrollY + 10));
await page.waitForTimeout(800);
const items = page.locator(".earlypreview-market__nav-item");
const n = await items.count();
await items.nth(n - 2).click();
await page.waitForTimeout(900);
await items.nth(n - 1).click();
await page.waitForTimeout(900);
console.log("index", await info());
await page.screenshot({ path: ".trust-shots/ipidx-0.jpg", type: "jpeg", quality: 70 });
await browser.close();
