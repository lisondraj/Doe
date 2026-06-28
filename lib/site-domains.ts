/** Primary marketing site (includes /join). */
export const PRIMARY_SITE_HOST =
  process.env.PRIMARY_SITE_HOST ?? "doe.care";

/** Legacy join domain — redirects to primary /join. */
export const JOIN_SITE_HOST = process.env.JOIN_SITE_HOST ?? "doehealth.care";

export const JOIN_PATH = "/join";
export const WAITLIST_PATH = "/waitlist";
export const ABOUT_PATH = "/about";

/** @deprecated Redirects to /about */
export const INVESTORS_PATH = "/investors";

const LOCAL_DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

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

export function isJoinHost(host: string | null | undefined): boolean {
  return normalizeHost(host) === normalizeHost(JOIN_SITE_HOST);
}

export function isPrimaryHost(host: string | null | undefined): boolean {
  return normalizeHost(host) === normalizeHost(PRIMARY_SITE_HOST);
}

/** Skip cross-domain redirects on localhost and Vercel preview URLs. */
export function shouldEnforceDomainRouting(host: string | null | undefined): boolean {
  if (!host) return false;
  if (isLocalDevHost(host)) return false;
  if (isPreviewHost(host)) return false;
  return isPrimaryHost(host) || isJoinHost(host);
}

export function primarySiteOrigin(protocol: "http" | "https" = "https"): string {
  return `${protocol}://${PRIMARY_SITE_HOST}`;
}

export function joinSiteOrigin(protocol: "http" | "https" = "https"): string {
  return `${protocol}://${JOIN_SITE_HOST}`;
}

export function joinPageUrl(protocol: "http" | "https" = "https"): string {
  return `${primarySiteOrigin(protocol)}${JOIN_PATH}`;
}

export function waitlistPageUrl(protocol: "http" | "https" = "https"): string {
  return `${primarySiteOrigin(protocol)}${WAITLIST_PATH}`;
}

export function aboutPageUrl(protocol: "http" | "https" = "https"): string {
  return `${primarySiteOrigin(protocol)}${ABOUT_PATH}`;
}

/** @deprecated Use aboutPageUrl */
export function investorsPageUrl(protocol: "http" | "https" = "https"): string {
  return aboutPageUrl(protocol);
}

/**
 * Absolute join URL for links from the primary site.
 * Override with NEXT_PUBLIC_JOIN_URL in env (useful for staging).
 */
export const JOIN_PAGE_HREF =
  process.env.NEXT_PUBLIC_JOIN_URL ?? joinPageUrl();

/** Home link when rendering chrome on the join domain. */
export function primaryHomeHref(protocol: "http" | "https" = "https"): string {
  return primarySiteOrigin(protocol);
}
