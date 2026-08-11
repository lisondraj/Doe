export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_AUTH_CALLBACK_PATH = "/auth/callback";

/** Only these emails may access /admin. Checked server-side on every protected request. */
export const ADMIN_ALLOWED_EMAILS = ["jameslisondra@hotmail.com"] as const;

export type AdminAllowedEmail = (typeof ADMIN_ALLOWED_EMAILS)[number];

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminAllowedEmail(email: string | null | undefined): email is AdminAllowedEmail {
  if (!email) return false;
  return (ADMIN_ALLOWED_EMAILS as readonly string[]).includes(normalizeAdminEmail(email));
}

/** Generic copy — do not reveal whether an address is on the allowlist. */
export const ADMIN_LOGIN_EMAIL_SENT_MESSAGE =
  "If this address is authorized, a sign-in code is on its way.";

export const ADMIN_LOGIN_INVALID_CODE_MESSAGE = "That code is invalid or expired. Request a new one.";
export const ADMIN_LOGIN_UNAUTHORIZED_MESSAGE = "This address is not authorized for admin access.";
