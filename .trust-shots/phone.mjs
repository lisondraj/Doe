import { chromium } from "../node_modules/playwright/index.mjs";
// iPhone: clicks the market nav through every stage and shoots each: node phone.mjs label [w h]
const [, , label, w = 390, h = 844] = process.argv;
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(3000);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-market-track").getBoundingClientRect().top + scrollY + 10));
await page.waitForTimeout(800);
const n = await page.locator(".earlypreview-market__nav-item").count();
for (let i = 0; i < n; i++) {
  await page.locator(".earlypreview-market__nav-item").nth(i).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${new URL(".", import.meta.url).pathname}${label}-${i}.jpg`, type: "jpeg", quality: 70 });
}
console.log(label, n);
await browser.close();
