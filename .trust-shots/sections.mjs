import { chromium } from "../node_modules/playwright/index.mjs";
// Lists the page's top-level blocks with their height and background, and shoots the last few.
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
const rows = await page.evaluate(() =>
  [...document.querySelector("main").children].map((el, i) => {
    const r = el.getBoundingClientRect();
    const bg = getComputedStyle(el).backgroundColor;
    const inner = el.querySelector("section") ?? el;
    return `${i} ${el.tagName} ${el.className.toString().split(" ").slice(0, 3).join(" ")} | h ${Math.round(r.height)} | bg ${bg} | inner bg ${getComputedStyle(inner).backgroundColor} | y ${Math.round(r.top + scrollY)}`;
  }),
);
console.log(rows.join("\n"));
const dir = new URL(".", import.meta.url).pathname;
const kids = await page.evaluate(() => [...document.querySelector("main").children].map((el) => Math.round(el.getBoundingClientRect().top + scrollY)));
for (const [k, y] of kids.slice(-3).entries()) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}tail-${k}.jpg`, type: "jpeg", quality: 60 });
}
await browser.close();
