import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/doehealthproduct", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === "Forms");
  btn?.click();
});
await page.waitForTimeout(1200);
await page.screenshot({ path: ".trust-shots/forms-full.png" });
const names = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map((b) => b.textContent || "").filter((t) => /returned|Not sent/.test(t)).map((t) => t.replace(/\s+/g, " ").trim()),
);
console.log(names);
await browser.close();
