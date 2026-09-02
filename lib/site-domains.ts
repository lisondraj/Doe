/** Primary marketing site — `/` serves PremedRouter natively via app/page.tsx (default: doe.care). */
export const PRIMARY_SITE_HOST =
  process.env.PRIMARY_SITE_HOST ?? "doe.care";

/** Full doehealth site — `/` rewrites to /doehealth; all other routes allowed (default: doehealth.care). */
export const DESIGNERS_SITE_HOST =
  process.env.DESIGNERS_SITE_HOST ?? process.env.JOIN_SITE_HOST ?? "doehealth.care";

/** @deprecated Use DESIGNERS_SITE_HOST */
export const JOIN_SITE_HOST = DESIGNERS_SITE_HOST;

export const JOIN_PATH = "/join";
export const PARTNERS_PATH = "/partners";
export const WAITLIST_PATH = "/waitlist";
export const HIRING_PATH = "/hiring";
export const PITCHDECK_PATH = "/pitchdeck";
export const ABOUT_PATH = "/about";
export const PREMED_PATH = "/premed";
export const PROTO_INVEST_PATH = "/proto-invest";
export const DESIGNERS_PATH = "/designers";
/** Editable landing served at doehealth.care root via middleware rewrite. */
export const DOEHEALTH_PATH = "/doehealth";
/** Specialty insurance for healthcare AI companies. */
export const DOEINSURE_PATH = "/doeinsure";
/** Doe clinic AI platform landing — Insure-style marketing page. */
export const DOEHOME_PATH = "/doehomepage";
/** Consumer health AI companion — iMessage-first DTC product. */
export const DOEDTC_PATH = "/doedtc";
/** Alternate DTC landing — scroll-driven framed hero. */
export const DOEDTC2_PATH = "/doedtc2";

/** Former primary home — Voice Agents hero (preview at /legacymain). */
export const LEGACY_MAIN_PATH = "/legacymain";

const LOCAL_DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

/** Resolve host from Next request/server headers (Vercel may use x-forwarded-host). */
export function requestHostFromHeaders(
  headers: Headers | { get(name: string): string | null },
): string {
  const raw =
    headers.get("x-forwarded-host") ??
    headers.get("x-vercel-forwarded-host") ??
    headers.get("host") ??
    "";

  return raw.split(",")[0]?.trim() ?? "";
}

/** Strip port + www for host comparisons. */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0].toLowerCase().replace(/^www\./, "");
}

export function isLocalDevHost(host: string | null | undefined): boolean {
  return LOCAL_DEV_HOSTS.has(normalizeHost(host));
}

export function isPreviewHost(host: string | null | undefined): boolean {
  const h = normalizeHost(host);
  return h.endsWith(".vercel.app");
}

export function isDesignersHost(host: string | null | undefined): boolean {
  return normalizeHost(host) === normalizeHost(DESIGNERS_SITE_HOST);
}

export function isDesignersRequest(
  headers: Headers | { get(name: string): string | null },
): boolean {
  return isDesignersHost(requestHostFromHeaders(headers));
}

/** @deprecated Use isDesignersHost */
export function isJoinHost(host: string | null | undefined): boolean {
  return isDesignersHost(host);
}

export function isPrimaryHost(host: string | null | undefined): boolean {
  return normalizeHost(host) === normalizeHost(PRIMARY_SITE_HOST);
}

/** doe.care or doehealth.care site root — URL stays `/`, content from landing rewrite. */
export function isMarketingLandingRoot(
  host: string | null | undefined,
  pathname: string,
): boolean {
  return pathname === "/" && (isPrimaryHost(host) || isDesignersHost(host));
}

/** doe.care `/` — URL stays `/`, PremedRouter from app/page.tsx. */
export function isPremedMarketingRoot(
  host: string | null | undefined,
  pathname: string,
): boolean {
  return pathname === "/" && isPrimaryHost(host);
}

/** doehealth.care `/` — URL stays `/`, content from /doehealth rewrite. */
export function isDoeHealthMarketingRoot(
  host: string | null | undefined,
  pathname: string,
): boolean {
  return pathname === "/" && isDesignersHost(host);
}

/** Middleware rewrite target for doehealth.care `/` (doe.care `/` uses app/page.tsx). */
export function marketingLandingRewritePath(host: string | null | undefined): string {
  return isPrimaryHost(host) ? PREMED_PATH : DOEHEALTH_PATH;
}

/** Skip cross-domain redirects on localhost and Vercel preview URLs. */
export function shouldEnforceDomainRouting(host: string | null | undefined): boolean {
  if (!host) return false;
  if (isLocalDevHost(host)) return false;
  if (isPreviewHost(host)) return false;
  return isPrimaryHost(host) || isDesignersHost(host);
}

export function primarySiteOrigin(protocol: "http" | "https" = "https"): string {
  return `${protocol}://${PRIMARY_SITE_HOST}`;
}

export function joinSiteOrigin(protocol: "http" | "https" = "https"): string {
  return `${protocol}://${DESIGNERS_SITE_HOST}`;
}

export function designersSiteOrigin(protocol: "http" | "https" = "https"): string {
  return joinSiteOrigin(protocol);
}

export function designersPageUrl(protocol: "http" | "https" = "https"): string {
  return `${designersSiteOrigin(protocol)}${DOEHEALTH_PATH}`;
}

export function doeHealthPageUrl(protocol: "http" | "https" = "https"): string {
  return `${designersSiteOrigin(protocol)}${DOEHEALTH_PATH}`;
}

export function premedPageUrl(protocol: "http" | "https" = "https"): string {
  return primarySiteOrigin(protocol);
}

export function joinPageUrl(protocol: "http" | "https" = "https"): string {
  return `${designersSiteOrigin(protocol)}${JOIN_PATH}`;
}

export function partnersPageUrl(protocol: "http" | "https" = "https"): string {
  return `${primarySiteOrigin(protocol)}${PARTNERS_PATH}`;
}

export function waitlistPageUrl(protocol: "http" | "https" = "https"): string {
  return `${designersSiteOrigin(protocol)}${WAITLIST_PATH}`;
}

export function aboutPageUrl(protocol: "http" | "https" = "https"): string {
  return `${designersSiteOrigin(protocol)}${ABOUT_PATH}`;
}

/**
 * Absolute join URL for links from the doehealth site.
 * Override with NEXT_PUBLIC_JOIN_URL in env (useful for staging).
 */
export const JOIN_PAGE_HREF =
  process.env.NEXT_PUBLIC_JOIN_URL ?? joinPageUrl();

/** Home link when rendering chrome on the doehealth site. */
export function primaryHomeHref(protocol: "http" | "https" = "https"): string {
  return designersSiteOrigin(protocol);
}
