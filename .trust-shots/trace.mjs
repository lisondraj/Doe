import { chromium } from "../node_modules/playwright/index.mjs";
import fs from "node:fs";
const sel = process.argv[2] || ".earlypreview-product";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
if (process.argv[3] === "nobackdrop") await page.addStyleTag({ content: "nav.desktop-home-nav, nav.doephone-site-nav { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }" });
if (process.argv[3] === "sliver") await page.addStyleTag({ content: ".earlypreview-hospital { position: relative !important; top: 2px !important; }" });
if (process.argv[3] === "novideo") await page.addStyleTag({ content: ".earlypreview-gallery video, .earlypreview-hospital video { display: none !important; }" });
if (process.argv[3] === "nohospital") await page.addStyleTag({ content: ".earlypreview-hospital { display: none !important; }" });
if (process.argv[3] === "nobox") await page.addStyleTag({ content: ".earlypreview-product__box { display: none !important; }" });
if (process.argv[3] === "nowave") await page.addStyleTag({ content: ".earlypreview-product__wave { display: none !important; }" });
if (process.argv[3] === "nocontent") await page.addStyleTag({ content: ".earlypreview-product__source { display: none !important; }" });
const cdp = await page.context().newCDPSession(page);
const events = [];
cdp.on("Tracing.dataCollected", (e) => events.push(...e.value));
await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
await page.waitForTimeout(500);
const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
await cdp.send("Tracing.end");
await done;
const by = {};
for (const e of events) {
  if (e.ph !== "X" || !e.dur) continue;
  by[e.name] = (by[e.name] || 0) + e.dur / 1000;
}
const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => `${v.toFixed(0)}ms ${k}`);
console.log(sel + "\n" + top.join("\n"));
await browser.close();
