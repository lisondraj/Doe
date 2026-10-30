import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/doehealthproduct", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2500);
await page.getByRole("button", { name: "Referrals", exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: ".trust-shots/ref-full.png" });
const counts = await page.evaluate(() => {
  const labels = [...document.querySelectorAll("span")].filter((s) => /^(Sent|Accepted|Scheduled|Seen)$/.test(s.textContent || ""));
  return labels.map((s) => {
    const row = s.closest("div");
    const n = row?.querySelectorAll(":scope span")[2]?.textContent;
    return `${s.textContent}:${n}`;
  });
});
console.log(counts);
await browser.close();
