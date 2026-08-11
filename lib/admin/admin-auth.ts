export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_AUTH_CALLBACK_PATH = "/auth/callback";

/** Set to true to require password sign-in for /admin. */
export const ADMIN_AUTH_ENABLED = true;

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

export const ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";
export const ADMIN_LOGIN_UNAUTHORIZED_MESSAGE = "This address is not authorized for admin access.";
