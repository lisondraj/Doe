import { chromium } from "../node_modules/playwright/index.mjs";

// node at.mjs <label> <w> <h> <phone 0|1> <selector> [offsetPx] [path]
const dir = new URL(".", import.meta.url).pathname;
const [, , label, w, h, phone, selector, offset = "0", path = "/earlypreview"] = process.argv;
const browser = await chromium.launch();
const context = await browser.newContext(
  phone === "1"
    ? { viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
    : { viewport: { width: +w, height: +h } },
);
const page = await context.newPage();
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => document.fonts.ready);
if (selector !== "-") {
  await page.evaluate(([sel, off]) => {
    const el = document.querySelector(sel);
    scrollTo(0, el.getBoundingClientRect().top + scrollY + off);
  }, [selector, +offset]);
}
await page.waitForTimeout(2200);
const file = `${dir}${label}.jpg`;
await page.screenshot({ path: file, type: "jpeg", quality: 80 });
await browser.close();
console.log(file);
