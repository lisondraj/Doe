import { chromium } from "../node_modules/playwright/index.mjs";

const dir = new URL(".", import.meta.url).pathname;
const [, , label, w, h, phone, target = ".earlypreview-market__seed-metric"] = process.argv;
const browser = await chromium.launch();
const context = await browser.newContext(
  phone === "1"
    ? { viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
    : { viewport: { width: +w, height: +h } },
);
const page = await context.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(3000);
await page.evaluate(() => document.fonts.ready);

const lastMetricE = () =>
  page.evaluate((target) => {
    const [pick, prop = "--e"] = target.split("#");
    const [selector, at] = pick.split("@");
    const items = document.querySelectorAll(selector);
    const last = items[at === undefined ? items.length - 1 : +at];
    return last ? parseFloat(getComputedStyle(last).getPropertyValue(prop) || "0") : -1;
  }, target);

if (phone === "1") {
  const y = await page.evaluate((progress) => {
    const track = document.querySelector(".earlypreview-market-track");
    const run = parseFloat(getComputedStyle(track).getPropertyValue("--market-run"));
    return track.getBoundingClientRect().top + scrollY + (progress ? progress * 200 : run * 0.97);
  }, process.env.P ? +process.env.P : 0);
  await page.evaluate((top) => scrollTo(0, top), y);
  await page.waitForTimeout(1500);
} else {
  await page.evaluate(() => {
    const section = document.querySelector(".earlypreview-market");
    scrollTo(0, section.getBoundingClientRect().top + scrollY - 40);
  });
  await page.waitForTimeout(800);
  await page.mouse.move(w / 2, h / 2);
  for (let i = 0; i < 400 && (await lastMetricE()) < 0.999; i++) {
    await page.mouse.wheel(0, 60);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(800);
}
console.log("e", await lastMetricE());
const file = `${dir}${label}.jpg`;
await page.screenshot({ path: file, type: "jpeg", quality: 80 });
await browser.close();
console.log(file);
