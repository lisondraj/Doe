#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "doehealth");
const baseUrl = process.env.STORY_SHADER_BASE_URL ?? "http://127.0.0.1:3001";
const captureRoute = "/story/blog-about-shader-capture";

const target = {
  id: "doehealth-home-hero-capture",
  filename: "doehealth-home-hero-backdrop.png",
  minWidth: 7296,
};

async function waitForShaderCanvas(page, selector, minWidth) {
  await page.waitForSelector(`${selector} canvas`, { timeout: 120_000 });
  await page.waitForFunction(
    ({ sel, minCanvasWidth }) => {
      const canvas = document.querySelector(`${sel} canvas`);
      if (!(canvas instanceof HTMLCanvasElement)) return false;
      return canvas.width >= minCanvasWidth && canvas.height >= 16;
    },
    { sel: selector, minCanvasWidth: minWidth },
    { timeout: 120_000 },
  );
  await page.waitForTimeout(2000);
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--ignore-gpu-blocklist"],
  });

  const context = await browser.newContext({
    viewport: { width: 7800, height: 12000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}${captureRoute}?only=${target.id}`, {
      waitUntil: "networkidle",
      timeout: 180_000,
    });
    await waitForShaderCanvas(page, `#${target.id}`, target.minWidth);
    const outputPath = path.join(outDir, target.filename);
    await page.locator(`#${target.id}`).screenshot({
      path: outputPath,
      type: "png",
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
    console.log(`Wrote ${outputPath}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
