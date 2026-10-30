import { chromium } from "../node_modules/playwright/index.mjs";
// For each market nav stage, lists visible pieces of the live screen that cross the bottom nav, the nav bar at the
// top, or the section's sides. node audit.mjs label w h [phone]
const [, , label, w, h, phone] = process.argv;
const browser = await chromium.launch();
const context = await browser.newContext(
  phone === "1"
    ? { viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
    : { viewport: { width: +w, height: +h } },
);
const page = await context.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(3000);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => scrollTo(0, document.querySelector(".earlypreview-market-track").getBoundingClientRect().top + scrollY + 10));
await page.waitForTimeout(800);
const items = page.locator(".earlypreview-market__nav-item");
const n = await items.count();
const dir = new URL(".", import.meta.url).pathname;
for (let i = 0; i < n; i++) {
  await items.nth(i).click();
  await page.waitForTimeout(900);
  const name = (await items.nth(i).textContent()).trim();
  const bad = await page.evaluate(() => {
    const section = document.querySelector(".earlypreview-market");
    const sec = section.getBoundingClientRect();
    const navTop = document.querySelector(".earlypreview-market__nav").getBoundingClientRect().top;
    const chrome = document.querySelector(".doehealth-desk2-chrome");
    const topLimit = chrome ? chrome.getBoundingClientRect().bottom : 0;
    const scene = [...document.querySelectorAll(".earlypreview-market__scene")].find((s) => s.classList.contains("is-live"));
    if (!scene) return ["no live scene"];
    const shown = (el) => {
      let o = 1;
      for (let e = el; e && e !== section; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.visibility === "hidden" || cs.display === "none") return 0;
        o *= parseFloat(cs.opacity);
      }
      return o;
    };
    const out = [];
    for (const el of scene.querySelectorAll("*")) {
      if (el.children.length && !(el instanceof SVGSVGElement)) continue;
      if (el.closest("svg") && !(el instanceof SVGSVGElement)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || shown(el) < 0.05) continue;
      const issues = [];
      if (r.bottom > navTop + 1) issues.push(`bottom ${Math.round(r.bottom - navTop)}px into nav`);
      if (r.top < topLimit - 1) issues.push(`top ${Math.round(topLimit - r.top)}px under nav bar`);
      if (r.right > sec.right + 1 && !el.closest(".earlypreview-market__pages")) issues.push(`right +${Math.round(r.right - sec.right)}px`);
      if (r.left < sec.left - 1 && !el.closest(".earlypreview-market__pages")) issues.push(`left -${Math.round(sec.left - r.left)}px`);
      if (issues.length) out.push(`${(el.className?.baseVal ?? el.className).toString().split(" ")[0] || el.tagName} "${(el.textContent || "").trim().slice(0, 24)}": ${issues.join(", ")}`);
    }
    return out;
  });
  await page.screenshot({ path: `${dir}${label}-${i}.jpg`, type: "jpeg", quality: 65 });
  console.log(`${label} ${name}: ${bad.length ? "\n  " + bad.slice(0, 6).join("\n  ") : "ok"}`);
}
await browser.close();
