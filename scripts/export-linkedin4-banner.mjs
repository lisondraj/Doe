#!/usr/bin/env node
/**
 * Export /linkedin4 at 2400×1254 — captures at the same ~1024px preview width as the
 * in-browser frame (matching manual screenshots), then scales to LinkedIn dimensions.
 * Usage: node scripts/export-linkedin4-banner.mjs [--suffix=N] [--preview-width=1024]
 */
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { chromium } from "playwright";

const execFileAsync = promisify(execFile);

const DESIGN_FRAME_WIDTH = 1200;
const DESIGN_FRAME_HEIGHT = 627;
const DEFAULT_PREVIEW_WIDTH = 1024;
const EXPORT_WIDTH = 2400;
const EXPORT_HEIGHT = 1254;

const suffixArg = process.argv.find((arg) => arg.startsWith("--suffix="))?.split("=")[1];
const previewWidthArg = process.argv.find((arg) => arg.startsWith("--preview-width="))?.split("=")[1];
const PREVIEW_WIDTH = previewWidthArg ? Number(previewWidthArg) : DEFAULT_PREVIEW_WIDTH;
const PREVIEW_HEIGHT = Math.round((PREVIEW_WIDTH * DESIGN_FRAME_HEIGHT) / DESIGN_FRAME_WIDTH);
const EXPORT_SCALE = EXPORT_WIDTH / PREVIEW_WIDTH;

const OUT_DIR = join(process.cwd(), "exports", "linkedin");
const OUT_BASENAME = suffixArg
  ? `doe-linkedin4-banner-${EXPORT_WIDTH}x${EXPORT_HEIGHT}-${suffixArg}`
  : `doe-linkedin4-banner-${EXPORT_WIDTH}x${EXPORT_HEIGHT}`;
const OUT_FILE = join(OUT_DIR, `${OUT_BASENAME}.png`);

const url = "http://localhost:3000/linkedin4";

async function waitForFrame(page) {
  await page.waitForSelector(".linkedin4-page__frame", { state: "visible", timeout: 60_000 });
  await page.waitForFunction(
    ({ previewWidth }) => {
      const frame = document.querySelector(".linkedin4-page__frame");
      if (!frame) return false;
      const { width } = frame.getBoundingClientRect();
      return Math.abs(Math.round(width) - previewWidth) <= 1;
    },
    { previewWidth: PREVIEW_WIDTH },
    { timeout: 60_000 },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(1500);
}

async function normalizeExportDimensions(filePath) {
  try {
    await execFileAsync("sips", ["-z", String(EXPORT_HEIGHT), String(EXPORT_WIDTH), filePath, "--out", filePath]);
  } catch {
    // sips is macOS-only; skip if unavailable — screenshot should already be within ~2px.
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT + 120 },
    deviceScaleFactor: EXPORT_SCALE,
  });
  const page = await context.newPage();

  console.log(
    `Loading ${url} (preview ${PREVIEW_WIDTH}×${PREVIEW_HEIGHT} → ${EXPORT_WIDTH}×${EXPORT_HEIGHT}, scale ${EXPORT_SCALE.toFixed(4)}) …`,
  );
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await waitForFrame(page);

  const frame = page.locator(".linkedin4-page__frame");
  const png = await frame.screenshot({ type: "png", animations: "disabled", scale: "device" });
  await writeFile(OUT_FILE, png);
  await normalizeExportDimensions(OUT_FILE);

  await browser.close();

  console.log(`Exported ${EXPORT_WIDTH}×${EXPORT_HEIGHT} PNG`);
  console.log(OUT_FILE);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
