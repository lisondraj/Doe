import { chromium, devices } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);

for (let i = 0; i < 200; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product-track").getBoundingClientRect().top);
  if (top <= 2) break;
  await page.mouse.wheel(0, Math.min(400, top));
  await page.waitForTimeout(120);
}
await page.waitForTimeout(800);

const rects = () =>
  page.evaluate(() => {
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom) };
    };
    const sec = document.querySelector(".earlypreview-product");
    const nav = sec.querySelector(".earlypreview-product__nav");
    const skip = sec.querySelector(".doehealth-desk2-visible__skip");
    const titles = Array.from(sec.querySelectorAll(".earlypreview-product__slide-title")).map(r);
    const boxes = Array.from(sec.querySelectorAll(".earlypreview-product__box")).map(r);
    const live = Array.from(sec.querySelectorAll(".earlypreview-product__nav-item")).map((b, i) => (b.classList.contains("is-live") ? i : -1)).filter((i) => i >= 0);
    return { innerH: innerHeight, nav: r(nav), skip: r(skip), liveItems: live, navItems: nav ? nav.children.length : 0, titleFirst: titles[0], boxFirst: boxes[0] };
  });

console.log("before", JSON.stringify(await rects()));
await page.screenshot({ path: ".trust-shots/phone-nav-0.png" });

// tap the 7th line, expect that box to come forward
await page.locator(".earlypreview-product__nav-item").nth(6).click();
await page.waitForTimeout(4500);
console.log("after tap 7", JSON.stringify(await rects()));
await page.screenshot({ path: ".trust-shots/phone-nav-6.png" });

// tap the 1st line, expect to go back
await page.locator(".earlypreview-product__nav-item").nth(0).click();
await page.waitForTimeout(4500);
console.log("after tap 1", JSON.stringify(await rects()));
await page.screenshot({ path: ".trust-shots/phone-nav-back.png" });
await browser.close();
