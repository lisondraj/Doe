import { chromium, devices } from "../node_modules/playwright/index.mjs";
const phone = process.argv[2] === "phone";
const tag = process.argv[3] || "cap";
const want = (process.argv[4] || "3,9").split(",").map(Number);
const browser = await chromium.launch();
const ctx = await browser.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForSelector(".earlypreview-product", { timeout: 120000 });
await page.waitForTimeout(4000);
for (let i = 0; i < 400; i++) {
  const top = await page.evaluate(() => document.querySelector(".earlypreview-product")?.getBoundingClientRect().top ?? 9999);
  if (top <= (phone ? 2 : 30)) break;
  if (phone) await page.evaluate((d) => window.scrollBy(0, d), Math.min(500, Math.max(20, top - 2)));
  else await page.mouse.wheel(0, Math.min(400, Math.max(20, top - 30)));
  await page.waitForTimeout(50);
}
await page.waitForTimeout(800);
if (phone) {
  for (let k = 0; k < 80 && !(await page.evaluate(() => document.querySelectorAll(".earlypreview-product__nav-item").length)); k++) {
    await page.evaluate(() => window.scrollBy(0, 80));
    await page.waitForTimeout(80);
  }
}
const info = [];
for (const i of want) {
  if (phone) {
    await page.evaluate((i) => document.querySelectorAll(".earlypreview-product__nav-item")[i]?.click(), i);
    await page.waitForTimeout(1400);
  } else {
    for (let k = 0; k < 400; k++) {
      const left = await page.evaluate((i) => {
        const s = document.querySelectorAll(".earlypreview-product__slide")[i];
        const st = document.querySelector(".earlypreview-product__stage");
        if (!s || !st) return 9999;
        return s.getBoundingClientRect().left - st.getBoundingClientRect().left;
      }, i);
      if (left <= 8) break;
      await page.mouse.wheel(0, 50);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(900);
  }
  const box = page.locator(".earlypreview-product__slide").nth(i).locator(".earlypreview-product__box");
  const rect = await box.boundingBox();
  const vp = page.viewportSize();
  const inView = rect && rect.y >= 0 && rect.x >= 0 && rect.y + 8 < vp.height && rect.x + 8 < vp.width;
  if (inView) await page.screenshot({ path: `.trust-shots/${tag}-${i}.png`, clip: { x: rect.x, y: rect.y, width: Math.min(rect.width, vp.width - rect.x), height: Math.min(rect.height, vp.height - rect.y) } });
  else await page.screenshot({ path: `.trust-shots/${tag}-${i}.png` });
  const title = await page.locator(".earlypreview-product__slide").nth(i).locator("h3").innerText();
  const heading = await page.evaluate((i) => {
    const ui = document.querySelectorAll(".earlypreview-product__slide")[i]?.querySelector(".earlypreview-product__ui");
    if (!ui) return "";
    const texts = [...ui.querySelectorAll("span, div, h1, h2")].map((el) => (el.textContent || "").trim()).filter((t) => /^Agent /i.test(t) && t.length < 40);
    return texts[0] || "";
  }, i);
  info.push({ i, title, heading, w: Math.round(rect?.width || 0), h: Math.round(rect?.height || 0), aspect: rect ? +(rect.width / rect.height).toFixed(2) : 0 });
}
console.log(JSON.stringify(info, null, 2));
await browser.close();
