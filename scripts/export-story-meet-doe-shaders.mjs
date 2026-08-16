#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "story");
const baseUrl = process.env.STORY_SHADER_BASE_URL ?? "http://127.0.0.1:3001";
const captureRoute = "/story/meet-doe-shader-capture";

const CAPTURE_WIDTH = 7680;
const CAPTURE_HEIGHT = Math.round((CAPTURE_WIDTH * 1.333333) / 2.35);
const MIN_CANVAS_WIDTH = Math.floor(CAPTURE_WIDTH * 0.95);

const targets = [
  { id: "story-meet-doe-slide-01-capture", filename: "meet-doe-slide-01-backdrop.png" },
  { id: "story-meet-doe-slide-02-capture", filename: "meet-doe-slide-02-backdrop.png" },
  { id: "story-meet-doe-slide-03-capture", filename: "meet-doe-slide-03-backdrop.png" },
  { id: "story-meet-doe-slide-04-capture", filename: "meet-doe-slide-04-backdrop.png" },
];

async function waitForShaderCanvas(page, selector) {
  await page.waitForSelector(`${selector} canvas`, { timeout: 120_000 });
  await page.waitForFunction(
    ({ sel, minWidth }) => {
      const canvas = document.querySelector(`${sel} canvas`);
      if (!(canvas instanceof HTMLCanvasElement)) return false;
      return canvas.width >= minWidth && canvas.height >= 16;
    },
    { sel: selector, minWidth: MIN_CANVAS_WIDTH },
    { timeout: 120_000 },
  );
  await page.waitForTimeout(2500);
}

async function captureTarget(page, selector, outputPath) {
  await waitForShaderCanvas(page, `#${selector}`);
  const element = page.locator(`#${selector}`);
  await element.screenshot({
    path: outputPath,
    type: "png",
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--ignore-gpu-blocklist"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: CAPTURE_WIDTH + 160, height: CAPTURE_HEIGHT * 4 + 480 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${captureRoute}`, { waitUntil: "networkidle", timeout: 180_000 });

    for (const target of targets) {
      const outputPath = path.join(outDir, target.filename);
      await captureTarget(page, target.id, outputPath);
      console.log(`Wrote ${outputPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
