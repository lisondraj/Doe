import { randomBytes } from "crypto";

export function createDoeDtcToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function onboardingTokenExpiresAt(hours = 72): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function isTokenExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return true;
  return Date.parse(expiresAt) <= Date.now();
}
