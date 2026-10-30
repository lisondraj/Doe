import { chromium } from "../node_modules/playwright/index.mjs";
const sel = process.argv[2] || ".earlypreview-hospital";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(10000);
await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 30); }, sel);
await page.waitForTimeout(3000);
await page.mouse.move(720, 450);
const cdp = await page.context().newCDPSession(page);
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
await cdp.send("Profiler.start");
for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(40); }
const { profile } = await cdp.send("Profiler.stop");
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
const dt = profile.timeDeltas;
profile.samples.forEach((id, i) => self.set(id, (self.get(id) || 0) + (dt[i] || 0)));
const byFn = new Map();
for (const [id, t] of self) { const n = nodes.get(id); const cf = n.callFrame; const key = `${cf.functionName || "(anon)"} ${cf.url.split("/").slice(-2).join("/")}:${cf.lineNumber}`; byFn.set(key, (byFn.get(key) || 0) + t); }
const top = [...byFn.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
for (const [k, v] of top) console.log((v / 1000).toFixed(0) + "ms", k);
await browser.close();
