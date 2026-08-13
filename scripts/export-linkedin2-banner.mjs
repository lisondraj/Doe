#!/usr/bin/env node
/**
 * Export /linkedin2 at 2400×1254 — 2× capture of the 1200×627 preview frame.
 * Usage: node scripts/export-linkedin2-banner.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const FRAME_WIDTH = 1200;
const FRAME_HEIGHT = 627;
const EXPORT_SCALE = 2;
const EXPORT_WIDTH = FRAME_WIDTH * EXPORT_SCALE;
const EXPORT_HEIGHT = FRAME_HEIGHT * EXPORT_SCALE;

const suffixArg = process.argv.find((arg) => arg.startsWith("--suffix="))?.split("=")[1];
const OUT_DIR = join(process.cwd(), "exports", "linkedin");
const OUT_BASENAME = suffixArg
  ? `doe-linkedin2-banner-${EXPORT_WIDTH}x${EXPORT_HEIGHT}-${suffixArg}`
  : `doe-linkedin2-banner-${EXPORT_WIDTH}x${EXPORT_HEIGHT}`;
const OUT_FILE = join(OUT_DIR, `${OUT_BASENAME}.png`);

const url = "http://localhost:3000/linkedin2";

async function waitForFrame(page) {
  await page.waitForSelector(".linkedin2-page__frame", { state: "visible", timeout: 60_000 });
  await page.waitForFunction(
    ({ frameWidth, frameHeight }) => {
      const frame = document.querySelector(".linkedin2-page__frame");
      if (!frame) return false;
      const { width, height } = frame.getBoundingClientRect();
      return Math.round(width) === frameWidth && Math.round(height) === frameHeight;
    },
    { frameWidth: FRAME_WIDTH, frameHeight: FRAME_HEIGHT },
    { timeout: 60_000 },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(1500);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: FRAME_WIDTH, height: 800 },
    deviceScaleFactor: EXPORT_SCALE,
  });
  const page = await context.newPage();

  console.log(`Loading ${url} (${EXPORT_WIDTH}×${EXPORT_HEIGHT}) …`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await waitForFrame(page);

  const frame = page.locator(".linkedin2-page__frame");
  const png = await frame.screenshot({ type: "png", animations: "disabled", scale: "device" });
  await writeFile(OUT_FILE, png);

  await browser.close();

  console.log(`Exported ${EXPORT_WIDTH}×${EXPORT_HEIGHT} PNG`);
  console.log(OUT_FILE);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
