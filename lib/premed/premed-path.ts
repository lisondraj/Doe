import { PREMED_PATH, PRIMARY_SITE_HOST, normalizeHost } from "@/lib/site-domains";

/** Map doe.care `/` rewrite to the premed page for client-side path checks. */
export function resolvePremedAwarePath(pathname: string, host?: string): string {
  const resolvedHost =
    host ?? (typeof window !== "undefined" ? window.location.hostname : "");
  if (pathname === "/" && normalizeHost(resolvedHost) === normalizeHost(PRIMARY_SITE_HOST)) {
    return PREMED_PATH;
  }
  return pathname;
}

export function isPremedPagePath(pathname: string, host?: string): boolean {
  return resolvePremedAwarePath(pathname, host) === PREMED_PATH;
}
