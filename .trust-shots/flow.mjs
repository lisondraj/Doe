import { chromium } from "../node_modules/playwright/index.mjs";
// Desktop page flow around the market section: hero, market locked, skip, the beige band under the nav.
const [, , label, w = 1440, h = 900] = process.argv;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: +w, height: +h } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(2500);
const dir = new URL(".", import.meta.url).pathname;
const shot = async (i) => page.screenshot({ path: `${dir}${label}-${i}.jpg`, type: "jpeg", quality: 70 });
const info = () => page.evaluate(() => {
  const m = document.querySelector(".earlypreview-market");
  const prev = m.parentElement.previousElementSibling;
  const next = m.parentElement.nextElementSibling;
  return JSON.stringify({ marketTop: Math.round(m.getBoundingClientRect().top), prev: prev?.className.split(" ")[0], next: next?.className.split(" ").slice(0, 2).join(" ") });
});
console.log("order", await info());
await page.mouse.move(+w / 2, +h / 2);
// Wheel down from the hero into the lock.
for (let n = 0; n < 80; n++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(30); }
await page.waitForTimeout(700);
console.log("locked?", await info());
await shot(0);
// Skip to the end, then scroll on past the section.
await page.locator(".doehealth-desk2-visible__skip").click();
await page.waitForTimeout(500);
for (let n = 0; n < 40; n++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(30); }
await page.waitForTimeout(1200);
console.log("after", await info());
await shot(1);
await page.waitForTimeout(2500);
console.log("band", await page.evaluate(() => {
  const b = document.querySelector(".earlypreview-beige-blank");
  const at = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  const hero = document.querySelector(".doehealth-desk2-hero-stack").getBoundingClientRect();
  return JSON.stringify({ cls: b.className, top: Math.round(b.getBoundingClientRect().top), bg: getComputedStyle(b).backgroundColor, y: Math.round(scrollY), heroTop: Math.round(hero.top), heroH: Math.round(hero.height), at: at?.className?.toString().slice(0, 80), atParents: [...(function* () { let e = at; for (let i = 0; i < 6 && e; i++, e = e.parentElement) yield e.className?.toString().split(" ")[0]; })()] });
}));
await shot(2);
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-beige-blank").getBoundingClientRect().top + scrollY));
await page.waitForTimeout(1500);
await shot(3);
await browser.close();
