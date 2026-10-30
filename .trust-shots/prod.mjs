import { chromium } from "../node_modules/playwright/index.mjs";

const dir = new URL(".", import.meta.url).pathname;
const tabs = ["Index", "Services", "Providers", "Agent permissions", "Integrations", "Forms", "Schedule", "Calendar", "Voice", "Referrals", "Payments"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/doehealthproduct", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(6000);
for (const tab of tabs) {
  if (tab !== "Index") await page.evaluate((t) => document.querySelector(`button[aria-label="${t}"]`).click(), tab);
  await page.waitForTimeout(900);
  const file = `${dir}prod-${tab.replace(/\s+/g, "-").toLowerCase()}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 75 });
  console.log(file);
}
await browser.close();
