#!/usr/bin/env node

/**
 * One-time helper to configure the Doe iMessage contact card (name + profile photo).
 *
 * Usage:
 *   LINQ_API_KEY=... \
 *   DOEDTC_LINQ_PHONE_NUMBER=+19492830865 \
 *   DOEDTC_PUBLIC_ORIGIN=https://doe.care \
 *   node scripts/setup-doedtc-linq-contact-card.mjs
 */

const apiKey = process.env.LINQ_API_KEY;
const phoneNumber = process.env.DOEDTC_LINQ_PHONE_NUMBER;
const origin = (process.env.DOEDTC_PUBLIC_ORIGIN ?? "https://doe.care").replace(/\/$/, "");
const imageUrl =
  process.env.DOEDTC_CONTACT_CARD_IMAGE_URL?.trim() || `${origin}/images/doe-contact-card.png?v=20260830b`;

if (!apiKey) {
  console.error("Missing LINQ_API_KEY.");
  process.exit(1);
}

if (!phoneNumber) {
  console.error("Missing DOEDTC_LINQ_PHONE_NUMBER (E.164, e.g. +19492830865).");
  process.exit(1);
}

async function request(method, body) {
  const response = await fetch("https://api.linqapp.com/api/partner/v3/contact_card", {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} failed (${response.status}): ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

try {
  let result;
  try {
    result = await request("POST", {
      phone_number: phoneNumber,
      first_name: "Doe",
      image_url: imageUrl,
    });
    console.log("Created Doe contact card.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("2014") && !message.toLowerCase().includes("already exists")) {
      throw error;
    }
    result = await request("PATCH", {
      phone_number: phoneNumber,
      first_name: "Doe",
      image_url: imageUrl,
    });
    console.log("Updated existing Doe contact card.");
  }

  console.log(JSON.stringify(result, null, 2));
  console.log(`\nImage URL: ${imageUrl}`);
  console.log("Contact card is configured. It will be shared into chats after the first outbound message.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
