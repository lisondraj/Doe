import { chromium, devices } from "../node_modules/playwright/index.mjs";
const phone = process.argv[2] === "phone";
const tag = process.argv[3] || "cmp";
const browser = await chromium.launch();
const ctx = await browser.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
for (let i = 0; i < 300; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product").getBoundingClientRect().top);
  if (top <= (phone ? 2 : 30)) break;
  await page.mouse.wheel(0, Math.min(400, Math.max(20, top - (phone ? 0 : 30))));
  await page.waitForTimeout(100);
}
await page.waitForTimeout(1500);
const n = await page.evaluate(() => document.querySelectorAll(".earlypreview-product__slide").length);
const info = [];
for (let i = 0; i < n; i++) {
  if (phone) {
    await page.evaluate((i) => document.querySelectorAll(".earlypreview-product__nav-item")[i].click(), i);
    await page.waitForTimeout(1800);
  } else {
    // pan until this box is at the stage's left edge
    for (let k = 0; k < 600; k++) {
      const left = await page.evaluate((i) => {
        const s = document.querySelectorAll(".earlypreview-product__slide")[i];
        const st = document.querySelector(".earlypreview-product__stage");
        return s.getBoundingClientRect().left - st.getBoundingClientRect().left;
      }, i);
      if (left <= 2 || i === n - 1 && k > 0 && left < 400) break;
      await page.mouse.wheel(0, 60);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(1500);
  }
  const box = page.locator(".earlypreview-product__slide").nth(i).locator(".earlypreview-product__box");
  if (phone) await box.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const rect = await box.boundingBox();
  await page.screenshot({ path: `.trust-shots/${tag}-${i}.png`, clip: rect });
  info.push({ i, w: Math.round(rect.width), h: Math.round(rect.height), title: await page.locator(".earlypreview-product__slide").nth(i).locator("h3").innerText() });
}
console.log(JSON.stringify(info));
await browser.close();
