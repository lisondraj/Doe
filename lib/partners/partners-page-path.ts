import { PARTNERS_PATH, isLocalDevHost, isPrimaryHost, normalizeHost } from "@/lib/site-domains";

/** /partners clinical partners — doe.care (and local dev) only. */
export function isPartnersPagePath(pathname: string, host?: string): boolean {
  if (pathname !== PARTNERS_PATH) return false;
  const resolvedHost =
    host ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return isPrimaryHost(resolvedHost) || isLocalDevHost(resolvedHost);
}

export function partnersPageHostAllowed(host: string | null | undefined): boolean {
  if (!host) return false;
  return isPrimaryHost(host) || isLocalDevHost(host);
}

export function partnersPageHostDeniedMessage(host: string | null | undefined): string {
  const normalized = normalizeHost(host);
  return normalized
    ? `The Clinical Partners Program is available on doe.care only (you are on ${normalized}).`
    : "The Clinical Partners Program is available on doe.care only.";
}
