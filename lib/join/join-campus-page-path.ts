import { JOIN_PATH } from "@/lib/site-domains";
import { isLocalDevHost, isPrimaryHost, normalizeHost } from "@/lib/site-domains";

/** /join campus ambassador — doe.care (and local dev) only. */
export function isJoinCampusPagePath(pathname: string, host?: string): boolean {
  if (pathname !== JOIN_PATH) return false;
  const resolvedHost =
    host ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return isPrimaryHost(resolvedHost) || isLocalDevHost(resolvedHost);
}

export function joinCampusPageHostAllowed(host: string | null | undefined): boolean {
  if (!host) return false;
  return isPrimaryHost(host) || isLocalDevHost(host);
}

export function joinCampusPageHostDeniedMessage(host: string | null | undefined): string {
  const normalized = normalizeHost(host);
  return normalized
    ? `The Campus Ambassador Program is available on doe.care only (you are on ${normalized}).`
    : "The Campus Ambassador Program is available on doe.care only.";
}
