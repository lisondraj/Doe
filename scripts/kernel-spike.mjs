#!/usr/bin/env tsx
/**
 * Spike Kernel process.exec and fs on a live session.
 * Usage: KERNEL_API_KEY=... tsx scripts/kernel-spike.mjs
 */
import { Kernel } from "@onkernel/sdk";

async function main() {
  const apiKey = process.env.KERNEL_API_KEY?.trim();
  if (!apiKey) {
    console.error("KERNEL_API_KEY is required.");
    process.exit(1);
  }
  const kernel = new Kernel({ apiKey });
  const browser = await kernel.browsers.create({ timeout_seconds: 600 });
  const sessionId = browser.session_id;
  console.log("session", sessionId);

  for (const command of [
    "which soffice",
    "python3 --version",
    "which pdftoppm",
    "which qpdf",
    "ls /usr/bin | head",
  ]) {
    const result = await kernel.browsers.process.exec(sessionId, { command });
    const json = await result.json();
    console.log(command, json);
  }

  await kernel.browsers.delete(sessionId);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
