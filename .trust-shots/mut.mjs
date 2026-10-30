import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
await page.evaluate(() => {
  window.__m = new Map();
  const label = (n) => (n.nodeType === 1 ? n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.split(" ").slice(0, 2).join(".") : "") : n.nodeName);
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      const key = m.type === "attributes" ? `attr:${m.attributeName}@${label(m.target)}` : `${m.type}@${label(m.target)}`;
      window.__m.set(key, (window.__m.get(key) || 0) + 1);
    }
  });
  mo.observe(document.body, { subtree: true, attributes: true, childList: true, characterData: true });
  window.__mo = mo;
});
for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
await page.waitForTimeout(500);
const res = await page.evaluate(() => { window.__mo.disconnect(); return [...window.__m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25); });
console.log(res.map(([k, v]) => `${v}\t${k}`).join("\n"));
await browser.close();
