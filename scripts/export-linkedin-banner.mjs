#!/usr/bin/env node
/**
 * Export /linkedin at 2400×1254 — freezes preview-identical WebGL pixels (minPixelRatio 2 @ 1200×627),
 * then composites caption at 2×. Matches /linkedin background exactly.
 * Usage: node scripts/export-linkedin-banner.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const LINKEDIN_FRAME_WIDTH = 1200;
const LINKEDIN_FRAME_HEIGHT = 627;
const LINKEDIN_EXPORT_SCALE = 2;
const LINKEDIN_EXPORT_WIDTH = LINKEDIN_FRAME_WIDTH * LINKEDIN_EXPORT_SCALE;
const LINKEDIN_EXPORT_HEIGHT = LINKEDIN_FRAME_HEIGHT * LINKEDIN_EXPORT_SCALE;

const suffixArg = process.argv.find((arg) => arg.startsWith("--suffix="))?.split("=")[1];
const OUT_DIR = join(process.cwd(), "exports", "linkedin");
const OUT_BASENAME = suffixArg
  ? `doe-linkedin-banner-${LINKEDIN_EXPORT_WIDTH}x${LINKEDIN_EXPORT_HEIGHT}-${suffixArg}`
  : `doe-linkedin-banner-${LINKEDIN_EXPORT_WIDTH}x${LINKEDIN_EXPORT_HEIGHT}`;
const OUT_FILE = join(OUT_DIR, `${OUT_BASENAME}.png`);

const url = "http://localhost:3000/linkedin";

async function waitForPreviewShader(page) {
  await page.waitForSelector(".linkedin-page__frame", { state: "visible", timeout: 60_000 });
  await page.waitForFunction(
    ({ frameWidth, frameHeight, exportWidth, exportHeight }) => {
      const frame = document.querySelector(".linkedin-page__frame");
      const canvas = document.querySelector(".linkedin-page__shader canvas");
      if (!frame || !canvas) return false;
      const { width, height } = frame.getBoundingClientRect();
      return (
        Math.round(width) === frameWidth &&
        Math.round(height) === frameHeight &&
        canvas.width >= exportWidth &&
        canvas.height >= exportHeight
      );
    },
    {
      frameWidth: LINKEDIN_FRAME_WIDTH,
      frameHeight: LINKEDIN_FRAME_HEIGHT,
      exportWidth: LINKEDIN_EXPORT_WIDTH,
      exportHeight: LINKEDIN_EXPORT_HEIGHT,
    },
    { timeout: 60_000 },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(1500);
}

/** Freeze WebGL pixels, expand frame to 2400×1254, scale caption 2× from bottom-right. */
async function prepareExportComposite(page) {
  await page.evaluate(
    ({ exportWidth, exportHeight, exportScale }) => {
      const canvas = document.querySelector(".linkedin-page__shader canvas");
      const shader = document.querySelector(".linkedin-page__shader");
      const frame = document.querySelector(".linkedin-page__frame");
      const pageEl = document.querySelector(".linkedin-page");
      const caption = document.querySelector(".linkedin-caption");

      if (!(canvas instanceof HTMLCanvasElement) || !(shader instanceof HTMLElement) || !frame || !pageEl || !caption) {
        throw new Error("LinkedIn export elements not found");
      }

      const mount = shader.paperShaderMount;
      mount?.render(performance.now());

      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl.length < 10_000) {
        throw new Error("Shader canvas export was empty — check preserveDrawingBuffer");
      }

      shader.replaceChildren();
      const img = document.createElement("img");
      img.src = dataUrl;
      img.width = canvas.width;
      img.height = canvas.height;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.display = "block";
      shader.appendChild(img);

      pageEl.style.position = "relative";
      pageEl.style.inset = "auto";
      pageEl.style.display = "block";
      pageEl.style.background = "transparent";
      pageEl.style.overflow = "hidden";
      pageEl.style.width = `${exportWidth}px`;
      pageEl.style.height = `${exportHeight}px`;

      frame.style.width = `${exportWidth}px`;
      frame.style.height = `${exportHeight}px`;
      frame.style.maxWidth = "none";
      frame.style.aspectRatio = "auto";

      caption.style.transform = `scale(${exportScale})`;
      caption.style.transformOrigin = "100% 100%";
    },
    {
      exportWidth: LINKEDIN_EXPORT_WIDTH,
      exportHeight: LINKEDIN_EXPORT_HEIGHT,
      exportScale: LINKEDIN_EXPORT_SCALE,
    },
  );

  await page.setViewportSize({ width: LINKEDIN_EXPORT_WIDTH, height: LINKEDIN_EXPORT_HEIGHT });
  await page.waitForFunction(() => {
    const img = document.querySelector(".linkedin-page__shader img");
    return img instanceof HTMLImageElement && img.complete && img.naturalWidth >= 2400;
  });
  await page.waitForTimeout(600);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: LINKEDIN_FRAME_WIDTH, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log(`Loading ${url} (preview shader → ${LINKEDIN_EXPORT_WIDTH}×${LINKEDIN_EXPORT_HEIGHT}) …`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await waitForPreviewShader(page);
  await prepareExportComposite(page);

  const frame = page.locator(".linkedin-page__frame");
  const png = await frame.screenshot({ type: "png", animations: "disabled", scale: "css" });
  await writeFile(OUT_FILE, png);

  await browser.close();

  console.log(`Exported ${LINKEDIN_EXPORT_WIDTH}×${LINKEDIN_EXPORT_HEIGHT} PNG`);
  console.log(OUT_FILE);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
