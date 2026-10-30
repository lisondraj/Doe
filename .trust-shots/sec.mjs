import { chromium, devices } from "../node_modules/playwright/index.mjs";
const phone = process.argv[2] === "phone";
const tag = process.argv[3] || "sec";
const browser = await chromium.launch();
const ctx = await browser.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForSelector(".earlypreview-compliance", { timeout: 120000 });
await page.waitForTimeout(4000);
const approach = async () => {
  for (let i = 0; i < 500; i++) {
    const top = await page.evaluate(() => document.querySelector(".earlypreview-compliance")?.getBoundingClientRect().top ?? 9999);
    if (top <= (phone ? 2 : 30)) return top;
    if (phone) await page.evaluate((d) => window.scrollBy(0, d), Math.min(500, Math.max(20, top)));
    else await page.mouse.wheel(0, Math.min(400, Math.max(20, top - 30)));
    await page.waitForTimeout(phone ? 40 : 70);
  }
  return await page.evaluate(() => document.querySelector(".earlypreview-compliance")?.getBoundingClientRect().top ?? 9999);
};
let top = await approach();
if (phone) {
  for (let k = 0; k < 40 && !(await page.evaluate(() => document.querySelector(".earlypreview-compliance .earlypreview-market__nav-item"))); k++) {
    await page.evaluate(() => window.scrollBy(0, 80));
    await page.waitForTimeout(60);
  }
}
const n = await page.evaluate(() => document.querySelectorAll(".earlypreview-compliance .earlypreview-market__nav-item").length);
const shots = [];
for (let i = 0; i < n; i++) {
  await page.evaluate((i) => document.querySelectorAll(".earlypreview-compliance .earlypreview-market__nav-item")[i].click(), i);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.trust-shots/${tag}-${i}.jpg`, quality: 68, type: "jpeg" });
  shots.push(await page.evaluate(() => document.querySelector(".earlypreview-compliance .earlypreview-market__scene.is-live h2")?.innerText || ""));
}
console.log(JSON.stringify({ top: Math.round(top), shots }, null, 2));
await browser.close();
