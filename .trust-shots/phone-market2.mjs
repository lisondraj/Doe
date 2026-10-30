import { chromium, devices } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);
for (let i = 0; i < 300; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-market").getBoundingClientRect().top);
  if (top <= 2) break;
  await page.mouse.wheel(0, Math.min(400, top));
  await page.waitForTimeout(100);
}
await page.waitForTimeout(1500);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(2500);
console.log(await page.evaluate(() => {
  const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  const lines = [...document.querySelectorAll(".earlypreview-market__nav-line")];
  const items = [...document.querySelectorAll(".earlypreview-market__nav-item")];
  const sec = document.querySelector(".earlypreview-market");
  const nav = document.querySelector(".earlypreview-market__nav");
  const cs = getComputedStyle(nav);
  return JSON.stringify({ sec: r(sec), nav: r(nav), navLeft: cs.left, navRight: cs.right, navPadding: cs.padding, first: r(lines[0]), last: r(lines[lines.length - 1]), item0: r(items[0]), n: lines.length, skip: r(document.querySelector(".doehealth-desk2-visible__skip")), appvh: getComputedStyle(document.documentElement).getPropertyValue("--app-vh") });
}));
await browser.close();
