import { chromium } from "../node_modules/playwright/index.mjs";
// Past the market section, wheel on into the GTM section and log where its top lands.
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-market").getBoundingClientRect().top + scrollY));
await page.waitForTimeout(600);
await page.locator(".earlypreview-market__nav-item").last().click();
await page.waitForTimeout(600);
const gtm = ".earlypreview-market ~ * section, .earlypreview-gtm";
await page.mouse.move(720, 450);
const sel = await page.evaluate(() => {
  const all = [...document.querySelectorAll("section")];
  const m = document.querySelector(".earlypreview-market");
  const after = all.filter((s) => s.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_PRECEDING && s.className.includes("gtm"));
  window.__g = after[0];
  window.__tops = [];
  const tick = () => { if (window.__g) window.__tops.push(Math.round(window.__g.getBoundingClientRect().top)); requestAnimationFrame(tick); };
  tick();
  return after[0]?.className.split(" ")[0];
});
for (let n = 0; n < 140; n++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(30); }
await page.waitForTimeout(500);
const tops = await page.evaluate(() => window.__tops);
const near = tops.filter((t, i) => Math.abs(t) < 300 && (i === 0 || tops[i - 1] !== t));
console.log(sel, "min", Math.min(...tops), "zeros", tops.filter((t) => t === 0).length, "near:", near.slice(0, 12).join(" "));
await browser.close();
