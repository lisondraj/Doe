import { chromium } from "playwright";
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.goto("http://localhost:3000/earlypreview", { waitUntil: "networkidle" });
const info = await pg.evaluate(() => {
  const band = document.querySelector(".earlypreview-invite-band");
  const r = band.getBoundingClientRect();
  return { h: r.height, kids: band.children.length, bg: getComputedStyle(band).backgroundColor };
});
console.log(JSON.stringify(info));
await pg.evaluate(() => document.querySelector(".earlypreview-invite-band").scrollIntoView({ block: "center" }));
await pg.waitForTimeout(800);
await pg.screenshot({ path: ".trust-shots/bottom.jpg", quality: 70 });
await b.close();
