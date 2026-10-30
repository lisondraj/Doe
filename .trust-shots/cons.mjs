import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log(m.type(), m.text().slice(0, 600)); });
page.on("pageerror", (e) => console.log("pageerror", String(e).slice(0, 600)));
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(8000);
await browser.close();
