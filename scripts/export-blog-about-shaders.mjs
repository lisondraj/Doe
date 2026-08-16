#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "story");
const baseUrl = process.env.STORY_SHADER_BASE_URL ?? "http://127.0.0.1:3001";
const captureRoute = "/story/blog-about-shader-capture";

const targets = [
  { id: "blog-about-hero-capture", filename: "blog-about-hero-backdrop.png", minWidth: 7296 },
  { id: "blog-join-campus-hero-capture", filename: "blog-join-campus-hero-backdrop.png", minWidth: 7296 },
  { id: "blog-dusk-footer-capture", filename: "blog-dusk-footer-backdrop.png", minWidth: 7296 },
  { id: "blog-looking-ahead-capture", filename: "blog-looking-ahead-backdrop.png", minWidth: 7296 },
  { id: "blog-carousel-integrate-capture", filename: "blog-carousel-integrate-backdrop.png", minWidth: 7296 },
  { id: "blog-carousel-meet-proto-stack-2-capture", filename: "blog-carousel-meet-proto-stack-2-backdrop.png", minWidth: 7296 },
  { id: "blog-carousel-meet-proto-capture", filename: "blog-carousel-meet-proto-backdrop.png", minWidth: 7296 },
  { id: "blog-carousel-prototype-capture", filename: "blog-carousel-prototype-backdrop.png", minWidth: 7296 },
  {
    id: "blog-carousel-meet-proto-stack-1-capture",
    filename: "blog-carousel-meet-proto-stack-1-backdrop.png",
    minWidth: 7296,
  },
  { id: "blog-carousel-shortlist-capture", filename: "blog-carousel-shortlist-backdrop.png", minWidth: 7296 },
  {
    id: "blog-carousel-home-integrations-capture",
    filename: "blog-carousel-home-integrations-backdrop.png",
    minWidth: 7296,
  },
];

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

async function captureTarget(page, selector, outputPath, minWidth) {
  await waitForShaderCanvas(page, `#${selector}`, minWidth);
  const element = page.locator(`#${selector}`);
  await element.screenshot({
    path: outputPath,
    type: "png",
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
}

async function captureOneTarget(browser, target, outputPath) {
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
    await captureTarget(page, target.id, outputPath, target.minWidth);
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--ignore-gpu-blocklist"],
  });

  try {
    for (const target of targets) {
      const outputPath = path.join(outDir, target.filename);
      await captureOneTarget(browser, target, outputPath);
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
