import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate(() => { const el = document.querySelector(".earlypreview-product"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); });
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(80); }
await page.waitForTimeout(2000);
await page.screenshot({ path: ".trust-shots/pill-desk-c.png" });
const c = await page.evaluate(() => Array.from(document.querySelectorAll(".earlypreview-product__ui")).map((u) => u.childElementCount));
console.log("mounted", JSON.stringify(c));
await browser.close();
