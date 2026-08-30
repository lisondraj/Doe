#!/usr/bin/env node

/**
 * One-time helper to register the Doe DTC Linq webhook subscription.
 *
 * Usage:
 *   LINQ_API_KEY=... DOEDTC_PUBLIC_ORIGIN=https://doe.care node scripts/setup-doedtc-linq-webhook.mjs
 */

const apiKey = process.env.LINQ_API_KEY;
const origin = (process.env.DOEDTC_PUBLIC_ORIGIN ?? "https://doe.care").replace(/\/$/, "");

if (!apiKey) {
  console.error("Missing LINQ_API_KEY.");
  process.exit(1);
}

const targetUrl = `${origin}/api/doedtc/linq?version=2026-02-03`;

const response = await fetch("https://api.linqapp.com/api/partner/v3/webhook-subscriptions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    target_url: targetUrl,
    subscribed_events: ["message.received"],
  }),
});

const body = await response.text();
if (!response.ok) {
  console.error(`Webhook subscription failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log("Doe DTC Linq webhook subscription created.");
console.log(`Target URL: ${targetUrl}`);
console.log(body);

try {
  const parsed = JSON.parse(body);
  if (parsed.signing_secret) {
    console.log("\nSave this secret as LINQ_WEBHOOK_SECRET (shown once):");
    console.log(parsed.signing_secret);
  }
} catch {
  // body already printed
}
