import { PREMED_PATH } from "@/lib/site-domains";

/** Path checks for /premed. doe.care `/` is the Fall 26 landing, not premed. */
export function resolvePremedAwarePath(pathname: string, _host?: string): string {
  return pathname;
}

export function isPremedPagePath(pathname: string, host?: string): boolean {
  return resolvePremedAwarePath(pathname, host) === PREMED_PATH;
}
