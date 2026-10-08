import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DoeCareFall26DeskPage } from "@/components/doe-carefall26-desk/DoeCareFall26DeskPage";
import { DOECAREFALL26_DESK_HERO_DEK } from "@/lib/doecarefall26/doecarefall26-desk-hero-copy";
import {
  DOEHEALTH_PATH,
  isPrimaryHost,
  primarySiteOrigin,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

import "@/lib/doecarefall26/doecarefall26-desk.css";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

function resolveHost() {
  return requestHostFromHeaders(headers());
}

function isPrimaryHomeRequest(host: string) {
  return shouldEnforceDomainRouting(host) && isPrimaryHost(host);
}

export async function generateMetadata(): Promise<Metadata> {
  const host = resolveHost();
  if (!isPrimaryHomeRequest(host)) {
    return {};
  }

  return {
    title: "Doe",
    description: DOECAREFALL26_DESK_HERO_DEK[0],
    alternates: {
      canonical: primarySiteOrigin(),
    },
  };
}

/**
 * Production doe.care `/` — Fall 26 landing rendered here natively (URL stays `/`).
 * Middleware must NOT rewrite `/` to /doecarefall26: that would render one route
 * tree on the server while the client hydrates app/page at `/`.
 * Localhost and preview hosts fall through to the doehealth landing redirect.
 */
export default function HomePage() {
  const host = resolveHost();
  if (isPrimaryHomeRequest(host)) {
    const ua = headers().get("user-agent") ?? "";
    const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
    return <DoeCareFall26DeskPage initialVariant={initialVariant} />;
  }

  redirect(DOEHEALTH_PATH);
}
