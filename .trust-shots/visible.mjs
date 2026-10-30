import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
await page.waitForTimeout(800);
const r = await page.evaluate(() => {
  const vis = (el) => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth && b.width * b.height > 0; };
  const canvases = [...document.querySelectorAll("canvas")].filter(vis).map((c) => ({ cls: c.className, w: c.width, h: c.height, parent: c.parentElement.className.toString().slice(0, 60) }));
  const anims = document.getAnimations().filter((a) => a.playState === "running" && a.effect && a.effect.target && vis(a.effect.target));
  const animTargets = anims.slice(0, 15).map((a) => `${a.effect.target.tagName.toLowerCase()}.${String(a.effect.target.className).slice(0, 50)} ${a.animationName || a.id || ""}`);
  const sections = [...document.querySelectorAll("section")].filter(vis).map((s) => String(s.className).slice(0, 60) || s.getAttribute("aria-label"));
  const hz = document.querySelector(".earlypreview-hospital");
  const hr = hz && hz.getBoundingClientRect();
  return { hospital: hr && { top: hr.top, h: hr.height, bottom: hr.bottom }, hospitalChildren: hz && hz.querySelectorAll("*").length, canvases, runningAnims: anims.length, animTargets, sections, willChange: [...document.querySelectorAll("*")].filter((el) => vis(el) && getComputedStyle(el).willChange !== "auto").length };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
