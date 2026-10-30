import { chromium } from "playwright";
const b = await chromium.launch();
for (const [name, vp, mobile] of [["d", { width: 1440, height: 900 }, false], ["m", { width: 390, height: 844 }, true]]) {
  const pg = await b.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await pg.goto("http://localhost:3000/earlypreview", { waitUntil: "networkidle" });
  await pg.waitForTimeout(600);
  const info = await pg.evaluate(() => {
    const blank = document.querySelector(".earlypreview-gtm-blank");
    const band = document.querySelector(".earlypreview-invite-band");
    const f = document.querySelector("footer, .doehealth-desk2-footer");
    const r = (el) => el ? Math.round(el.getBoundingClientRect().top + scrollY) + "/" + Math.round(el.getBoundingClientRect().height) : null;
    return { blank: r(blank), blankBg: blank && getComputedStyle(blank).backgroundColor, band: r(band), bandKids: band?.children.length, footer: r(f), docH: document.documentElement.scrollHeight };
  });
  console.log(name, JSON.stringify(info));
  await pg.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: `.trust-shots/bottom2-${name}.jpg`, quality: 70 });
  await pg.close();
}
await b.close();
