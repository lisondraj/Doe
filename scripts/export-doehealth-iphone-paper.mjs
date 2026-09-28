#!/usr/bin/env node
/**
 * Capture /doehealth iPhone above-the-fold DOM (banner, nav, hero) with computed
 * inline styles for Paper MCP. Shader canvases → local PNG + paper-asset:// URLs.
 *
 * Usage: node scripts/export-doehealth-iphone-paper.mjs [--url=http://localhost:3000/doehealth]
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const VIEWPORT = { width: 390, height: 844 };
const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "scripts", "paper-dumps");
const ASSET_DIR = join(OUT_DIR, "doehealth-iphone-assets");
const OUT_HTML = join(OUT_DIR, "doehealth-iphone-viewport.html");

const urlArg = process.argv.find((a) => a.startsWith("--url="))?.split("=")[1];
const url = urlArg ?? "http://localhost:3000/doehealth";

/** Computed props Paper needs for layout fidelity (skip animation noise). */
const STYLE_PROPS = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "align-items",
  "align-self",
  "justify-content",
  "gap",
  "row-gap",
  "column-gap",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "box-sizing",
  "overflow",
  "overflow-x",
  "overflow-y",
  "opacity",
  "transform",
  "transform-origin",
  "pointer-events",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-width",
  "border-style",
  "border-color",
  "border-top-width",
  "border-top-style",
  "border-top-color",
  "border-bottom-width",
  "border-bottom-style",
  "border-bottom-color",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "box-shadow",
  "filter",
  "backdrop-filter",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration-line",
  "text-decoration-color",
  "text-underline-offset",
  "white-space",
  "webkit-text-fill-color",
  "background-clip",
  "webkit-background-clip",
  "-webkit-text-fill-color",
];

const INLINE_SCRIPT = `
(() => {
  const STYLE_PROPS = ${JSON.stringify(STYLE_PROPS)};
  const SKIP_TAGS = new Set(["SCRIPT", "NOSCRIPT", "STYLE", "LINK", "META", "HEAD"]);
  let canvasIndex = 0;

  function styleFromComputed(el) {
    const cs = getComputedStyle(el);
    let style = "";
    for (const prop of STYLE_PROPS) {
      const val = cs.getPropertyValue(prop);
      if (!val || val === "none" || val === "normal" || val === "auto") continue;
      if (prop === "font-family" && val.includes("undefined")) continue;
      style += prop + ":" + val + ";";
    }
    return style;
  }

  function cloneWithStyles(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent ?? "";
      if (!t.trim()) return null;
      return document.createTextNode(t);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const src = /** @type {HTMLElement} */ (node);
    const tag = src.tagName;
    if (SKIP_TAGS.has(tag)) return null;

    let el;
    if (tag === "CANVAS") {
      const canvas = /** @type {HTMLCanvasElement} */ (src);
      const rect = canvas.getBoundingClientRect();
      el = document.createElement("img");
      el.setAttribute("alt", "");
      el.setAttribute("data-canvas-index", String(canvasIndex++));
      try {
        el.setAttribute("data-canvas-data", canvas.toDataURL("image/png"));
      } catch {
        el = document.createElement("div");
      }
      if (el instanceof HTMLImageElement) {
        el.setAttribute(
          "style",
          styleFromComputed(src) +
            "width:" + rect.width + "px;height:" + rect.height + "px;object-fit:cover;",
        );
      }
      return el;
    }

    if (tag === "SVG") {
      el = src.cloneNode(true);
      if (el instanceof Element) {
        el.setAttribute("style", styleFromComputed(src));
      }
      return el;
    }

    el = document.createElement(tag);
    for (const attr of src.attributes) {
      const name = attr.name;
      if (name === "class" || name === "style" || name.startsWith("on")) continue;
      if (name === "href") {
        el.setAttribute("data-href", attr.value);
        continue;
      }
      el.setAttribute(name, attr.value);
    }
    el.setAttribute("style", styleFromComputed(src));

    for (const child of src.childNodes) {
      const cloned = cloneWithStyles(child);
      if (cloned) el.appendChild(cloned);
    }
    return el;
  }

  const banner = document.querySelector(".doehealth-top-banner");
  const nav = document.querySelector(".doephone-mobile-root--doehealth nav.doephone-site-nav");
  const hero = document.querySelector(".doephone-mobile-root--doehealth .doephone-hero-section");
  if (!nav || !hero) throw new Error("Missing nav or hero");

  const shell = document.createElement("div");
  shell.setAttribute("layer-name", "doehealth iPhone viewport");
  shell.setAttribute(
    "style",
    "box-sizing:border-box;display:flex;flex-direction:column;width:390px;height:844px;overflow:hidden;position:relative;background-color:#FAF0D8;",
  );

  if (banner) {
    const b = cloneWithStyles(banner);
    if (b) shell.appendChild(b);
  }
  const n = cloneWithStyles(nav);
  if (n) shell.appendChild(n);
  const h = cloneWithStyles(hero);
  if (h) {
    h.setAttribute("style", (h.getAttribute("style") ?? "") + "flex:1 1 auto;min-height:0;");
    shell.appendChild(h);
  }

  const canvases = [];
  shell.querySelectorAll("img[data-canvas-data]").forEach((img) => {
    canvases.push({
      index: img.getAttribute("data-canvas-index"),
      data: img.getAttribute("data-canvas-data"),
    });
    img.removeAttribute("data-canvas-data");
  });

  return { html: shell.outerHTML, canvases };
})()
`;

async function main() {
  await mkdir(ASSET_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });

  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForSelector(".doephone-mobile-root--doehealth", { timeout: 60_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForSelector(".doephone-hero-section", { timeout: 30_000 });
  await page.waitForTimeout(2500);

  const { html: rawHtml, canvases } = await page.evaluate(INLINE_SCRIPT);
  await browser.close();

  let html = rawHtml;
  for (const { index, data } of canvases) {
    if (!data?.startsWith("data:image")) continue;
    const b64 = data.replace(/^data:image\/png;base64,/, "");
    const filePath = join(ASSET_DIR, `canvas-${index}.png`);
    await writeFile(filePath, Buffer.from(b64, "base64"));
    const assetUrl = `paper-asset://${filePath}`;
    html = html.replace(
      new RegExp(`(<img[^>]*data-canvas-index="${index}"[^>]*)(>)`, "i"),
      `$1 src="${assetUrl}"$2`,
    );
  }
  html = html.replace(/ data-canvas-index="\\d+"/g, "");

  const grainTilePath = join(ASSET_DIR, "proto-grain-tile.png");
  try {
    const grainRes = await fetch(new URL("/proto-grain-tile.png", url));
    if (grainRes.ok) {
      await writeFile(grainTilePath, Buffer.from(await grainRes.arrayBuffer()));
      html = html.replaceAll(
        `${new URL(url).origin}/proto-grain-tile.png`,
        `paper-asset://${grainTilePath}`,
      );
    }
  } catch {
    /* grain tile optional */
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_HTML, html, "utf8");
  console.log(`Wrote ${OUT_HTML} (${html.length} chars, ${canvases.length} canvases)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
