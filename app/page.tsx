import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PremedRouter } from "@/components/premed/PremedRouter";
import { BROADER_DOE_VISION_OPENING_LEDE } from "@/lib/blog/broader-doe-vision-article";
import { PREMED_PAGE_TITLE } from "@/lib/premed/premed-copy";
import {
  DOEHEALTH_PATH,
  isPrimaryHost,
  premedPageUrl,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

export const dynamic = "force-dynamic";

function resolveHost() {
  return requestHostFromHeaders(headers());
}

function isPremedHomeRequest(host: string) {
  return shouldEnforceDomainRouting(host) && isPrimaryHost(host);
}

export async function generateMetadata(): Promise<Metadata> {
  const host = resolveHost();
  if (!isPremedHomeRequest(host)) {
    return {};
  }

  return {
    title: `${PREMED_PAGE_TITLE} · Doe`,
    description: BROADER_DOE_VISION_OPENING_LEDE,
    alternates: {
      canonical: premedPageUrl(),
    },
  };
}

/**
 * Production doe.care `/` — PremedRouter rendered here natively (URL stays `/`).
 * Middleware must NOT rewrite `/` → /premed: that made the server render app/premed
 * while the client router hydrated app/page at `/`, which broke hero WebGL on iPhone
 * initial load. doehealth.care/premed keeps using app/premed/page.tsx directly.
 * Localhost and preview hosts fall through to the doehealth landing redirect.
 */
export default function HomePage() {
  const host = resolveHost();
  if (isPremedHomeRequest(host)) {
    return <PremedRouter />;
  }

  redirect(DOEHEALTH_PATH);
}
