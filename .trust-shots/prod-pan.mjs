import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(5000);
await page.evaluate(() => {
  const el = document.querySelector(".earlypreview-product");
  scrollTo(0, el.getBoundingClientRect().top + scrollY - 30);
});
await page.waitForTimeout(1500);
await page.mouse.move(720, 450);
const shots = [0, 25, 60];
let n = 0;
for (const target of shots) {
  while (n < target) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(60);
    n++;
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `.trust-shots/prodpan-${target}.jpg`, type: "jpeg", quality: 80 });
}
const counts = await page.evaluate(() =>
  Array.from(document.querySelectorAll(".earlypreview-product__slide")).map((li) => li.querySelector(".earlypreview-product__ui")?.childElementCount ?? 0),
);
console.log("mounted children per box:", JSON.stringify(counts));
await browser.close();
