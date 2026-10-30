import { chromium } from "../node_modules/playwright/index.mjs";
// Clicks bottom-nav items by label and shoots each landing: node nav.mjs label w h Label ...
const [, , label, w, h, ...items] = process.argv;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: +w, height: +h } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-market").getBoundingClientRect().top + scrollY));
await page.waitForTimeout(800);
for (const [i, item] of items.entries()) {
  await page.locator(".earlypreview-market__nav-item", { hasText: item }).first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${new URL(".", import.meta.url).pathname}${label}-${i}.jpg`, type: "jpeg", quality: 75 });
  console.log(label, i, item);
}
await browser.close();
