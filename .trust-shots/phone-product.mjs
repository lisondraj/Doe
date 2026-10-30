import { chromium, devices } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);

const info = await page.evaluate(() => {
  const track = document.querySelector(".earlypreview-product-track");
  const top = track.getBoundingClientRect().top + scrollY;
  return { top, height: track.offsetHeight, vh: innerHeight };
});
console.log("track", JSON.stringify(info));

async function at(label, offset) {
  await page.evaluate((y) => scrollTo(0, y), info.top + offset);
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const btn = document.querySelector(".earlypreview-product .doehealth-desk2-visible__skip");
    const sec = document.querySelector(".earlypreview-product");
    const rect = (el) => (el ? el.getBoundingClientRect() : null);
    const b = rect(btn);
    const s = rect(sec);
    return {
      skipInDom: !!btn,
      skipRect: b && { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) },
      skipDisplay: btn && getComputedStyle(btn).display,
      skipVisibility: btn && getComputedStyle(btn).visibility,
      sectionRect: s && { y: Math.round(s.y), h: Math.round(s.height) },
      innerH: innerHeight,
    };
  });
  console.log(label, JSON.stringify(r));
  await page.screenshot({ path: `.trust-shots/phone-product-${label}.png` });
}

await at("start", 20);
await at("mid", info.height * 0.35);
await at("late", info.height * 0.7);
await browser.close();
