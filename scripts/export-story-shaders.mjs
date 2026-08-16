#!/usr/bin/env node
/**
 * Export story team + Meet Doe modal shader posters at full WebGL resolution.
 * Usage: node scripts/export-story-shaders.mjs
 * Requires dev server at http://localhost:3000
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT_DIR = join(process.cwd(), "public", "story", "shaders");
const port = process.env.PORT ?? process.env.STORY_EXPORT_PORT ?? "3000";
const url = `http://localhost:${port}/story/shader-export`;

const EXPORT_IDS = [
  "team-james",
  "team-matthew",
  "meet-doe-slide-1",
  "meet-doe-slide-2",
  "meet-doe-slide-3",
  "meet-doe-slide-4",
  "genome-top-left",
  "genome-bottom-right",
  "pulse-tall-left",
  "pulse-wide-bottom",
  "fabric-tall-left",
  "float-top-right",
  "float-mid-left",
  "roadmap-front-desk",
  "roadmap-prior-auth",
  "roadmap-results",
  "goals-arr-hero",
];

async function waitForShaders(page) {
  await page.waitForSelector("[data-story-shader-export]", { state: "visible", timeout: 60_000 });
  await page.waitForFunction(
    () => {
      const frames = document.querySelectorAll("[data-story-shader-export]");
      if (frames.length < 17) return false;
      return [...frames].every((frame) => frame.querySelector("canvas"));
    },
    { timeout: 60_000 },
  );
  await page.waitForTimeout(2000);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 2600, height: 9000 } });

  console.log(`Loading ${url} …`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await waitForShaders(page);

  for (const exportId of EXPORT_IDS) {
    const frame = page.locator(`[data-story-shader-export="${exportId}"]`);
    const outFile = join(OUT_DIR, `${exportId}.png`);
    const png = await frame.screenshot({ type: "png", animations: "disabled" });
    await writeFile(outFile, png);
    console.log(`Exported ${exportId} → ${outFile}`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
