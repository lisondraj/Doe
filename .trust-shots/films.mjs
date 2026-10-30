import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 2000, height: 1200 } })).newPage();
await page.goto("http://localhost:3000/tmp-films", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(8000);
await page.screenshot({ path: ".trust-shots/films-grid.png", fullPage: true });
await browser.close();
