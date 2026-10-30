import { chromium } from "../node_modules/playwright/index.mjs";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/earlypreview", { waitUntil: "load", timeout: 300000 });
await page.waitForTimeout(9000);
const cdp = await ctx.newCDPSession(page);
const r = () => page.evaluate(() => { const b = document.querySelectorAll(".earlypreview-beige-blank")[1] || document.querySelector(".earlypreview-beige-blank"); const x = b.getBoundingClientRect(); return { top: x.top, h: x.height }; });
// scroll to just above band 2, then fast-flick through it and screenshot right after each flick
for (let i = 0; i < 500; i++) { const x = await r(); if (x.top < 1400 && x.top > 1000) break; await page.mouse.wheel(0, Math.max(-300, Math.min(300, x.top - 1200))); await page.waitForTimeout(80); }
let n = 0;
for (const dist of [900, 700, 900, 1200]) {
  await cdp.send("Input.synthesizeScrollGesture", { x: 720, y: 450, yDistance: -dist, speed: 5000, gestureSourceType: "touch", preventFling: true });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `.trust-shots/fb-${n++}.jpg`, quality: 70, type: "jpeg" });
}
await browser.close();
