import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_AUTH_ENABLED,
  ADMIN_LOGIN_PATH,
  isAdminAllowedEmail,
} from "@/lib/admin/admin-auth";
import {
  JOIN_PATH,
  PARTNERS_PATH,
  isDesignersHost,
  isMarketingLandingRoot,
  isPrimaryHost,
  joinPageUrl,
  marketingLandingRewritePath,
  partnersPageUrl,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";
import { FEDERATED_CLINIC_INTELLIGENCE_PATH } from "@/lib/blog/federated-clinic-intelligence-article";
import { CLINIC_SPECIALTY_WORKFLOWS_PATH } from "@/lib/blog/clinic-specialty-workflows-article";
import { OUR_FOUNDER_STORY_PATH } from "@/lib/blog/our-founder-story-article";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const ADMIN_ROOT_PATH = "/admin";
const ADMIN_AUTH_CALLBACK_PATH = "/auth/callback";
const ADMIN_SIGNOUT_API_PATH = "/api/admin/auth/signout";
const ADMIN_SIGN_IN_API_PATH = "/api/admin/auth/sign-in";

const ADMIN_PUBLIC_API_PATHS = new Set([ADMIN_SIGNOUT_API_PATH, ADMIN_SIGN_IN_API_PATH]);

function applyLandingSiteHeaders(response: NextResponse) {
  /** Bust edge/browser caches of the old permanent redirect to /join. */
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate, max-age=0",
  );
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

function isAdminAppPath(pathname: string): boolean {
  return pathname === ADMIN_ROOT_PATH || pathname.startsWith(`${ADMIN_ROOT_PATH}/`);
}

function isAdminProtectedApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/admin/") && !ADMIN_PUBLIC_API_PATHS.has(pathname);
}

async function handleAdminAccess(request: NextRequest): Promise<NextResponse | null> {
  if (!ADMIN_AUTH_ENABLED) {
    return null;
  }

  const { pathname } = request.nextUrl;

  if (
    !isAdminAppPath(pathname) &&
    !isAdminProtectedApiPath(pathname) &&
    pathname !== ADMIN_AUTH_CALLBACK_PATH &&
    !ADMIN_PUBLIC_API_PATHS.has(pathname)
  ) {
    return null;
  }

  const { response, user } = await createSupabaseMiddlewareClient(request);
  const isAuthed = Boolean(user?.email && isAdminAllowedEmail(user.email));

  if (isAdminProtectedApiPath(pathname) && !isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (isAdminAppPath(pathname) && pathname !== ADMIN_LOGIN_PATH && !isAuthed) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(loginUrl));
  }

  if (pathname === ADMIN_LOGIN_PATH && isAuthed) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_ROOT_PATH;
    adminUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(adminUrl));
  }

  return applyLandingSiteHeaders(response);
}

export async function middleware(request: NextRequest) {
  const host = requestHostFromHeaders(request.headers);
  const adminResponse = await handleAdminAccess(request);
  if (adminResponse) {
    return adminResponse;
  }

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (isMarketingLandingRoot(host, pathname)) {
    /**
     * doe.care `/` is served natively by app/page.tsx (PremedRouter). Rewriting to
     * /premed made the server render app/premed while the client router still hydrated
     * app/page at `/` — a route-tree mismatch that broke hero WebGL on iPhone load.
     */
    if (isPrimaryHost(host)) {
      return applyLandingSiteHeaders(NextResponse.next());
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-doe-designers-site", "1");

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = marketingLandingRewritePath(host);
    return applyLandingSiteHeaders(
      NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      }),
    );
  }

  if (pathname === JOIN_PATH && isDesignersHost(host)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = new URL(joinPageUrl()).hostname;
    redirectUrl.pathname = JOIN_PATH;
    redirectUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(redirectUrl));
  }

  if (pathname === JOIN_PATH && isPrimaryHost(host)) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (pathname === PARTNERS_PATH && isDesignersHost(host)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = new URL(partnersPageUrl()).hostname;
    redirectUrl.pathname = PARTNERS_PATH;
    redirectUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(redirectUrl));
  }

  if (pathname === PARTNERS_PATH && isPrimaryHost(host)) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (pathname === OUR_FOUNDER_STORY_PATH && isPrimaryHost(host)) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (pathname === FEDERATED_CLINIC_INTELLIGENCE_PATH && isPrimaryHost(host)) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (pathname === CLINIC_SPECIALTY_WORKFLOWS_PATH && isPrimaryHost(host)) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (isAdminAppPath(pathname) || pathname === ADMIN_AUTH_CALLBACK_PATH) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  /** doe.care serves /premed at `/` only — bounce any other path back to root. */
  if (isPrimaryHost(host)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(redirectUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
