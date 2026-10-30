import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-product";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
const cdp = await page.context().newCDPSession(page);
let last = 0; const samples = [];
cdp.on("LayerTree.layerTreeDidChange", (e) => { last = (e.layers || []).length; samples.push(last); });
await cdp.send("LayerTree.enable");
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(60); }
await page.waitForTimeout(500);
const max = Math.max(...samples, 0);
const sorted = [...samples].sort((a, b) => a - b);
console.log(sel, JSON.stringify({ changes: samples.length, last, max, median: sorted[Math.floor(sorted.length / 2)] }));
await browser.close();
