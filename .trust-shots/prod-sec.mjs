import { chromium } from "../node_modules/playwright/index.mjs";

// node prod-sec.mjs <label> <w> <h> <phone 0|1> <goal: start | lift=<0-1> | r=<0-1> | pan=<0-1>> [p for phone]
const dir = new URL(".", import.meta.url).pathname;
const [, , label, w, h, phone, goal = "start"] = process.argv;
const browser = await chromium.launch();
const context = await browser.newContext(
  phone === "1"
    ? { viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
    : { viewport: { width: +w, height: +h } },
);
const page = await context.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(4000);
await page.evaluate(() => document.fonts.ready);

const state = () =>
  page.evaluate(() => {
    const stage = document.querySelector(".earlypreview-product__stage");
    const track = document.querySelector(".earlypreview-product__track");
    const head = document.querySelector(".earlypreview-product__head");
    const m = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
    const dist = track.scrollWidth - stage.clientWidth;
    return {
      lift: Math.abs(parseFloat(head.style.getPropertyValue("--y") || "0")) < 0.5 ? 1 : 0,
      r: parseFloat(track.style.getPropertyValue("--k") || "0"),
      pan: dist > 0 && m ? -parseFloat(m[1]) / dist : 0,
    };
  });

const [key, value] = goal.split("=");
if (phone === "1") {
  // P = progress units; 200px of page scroll per unit through the sticky track.
  await page.evaluate((progress) => {
    const track = document.querySelector(".earlypreview-product-track");
    scrollTo(0, track.getBoundingClientRect().top + scrollY + progress * 200);
  }, process.env.P ? +process.env.P : 0);
  await page.waitForTimeout(2500);
} else {
  await page.evaluate(() => {
    const section = document.querySelector(".earlypreview-product");
    scrollTo(0, section.getBoundingClientRect().top + scrollY - 30);
  });
  await page.waitForTimeout(1500);
  await page.mouse.move(+w / 2, +h / 2);
  if (key !== "start") {
    for (let i = 0; i < 600 && (await state())[key] < +value - 0.001; i++) {
      await page.mouse.wheel(0, 40);
      await page.waitForTimeout(45);
    }
  }
  await page.waitForTimeout(2500);
}
console.log(JSON.stringify(await state()));
const file = `${dir}${label}.jpg`;
await page.screenshot({ path: file, type: "jpeg", quality: 82 });
await browser.close();
console.log(file);
