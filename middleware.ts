import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_AUTH_ENABLED,
  ADMIN_LOGIN_PATH,
  isAdminAllowedEmail,
} from "@/lib/admin/admin-auth";
import {
  DOEDTC_PATH,
  DOEHEALTH_BLOG_PATH,
  DOEHEALTH_DESK2_PATH,
  JOIN_PATH,
  LANDINGLAUNCH_PATH,
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
import { PREVIEW_ARTICLE_PATHS } from "@/lib/doehealth/doehealth-preview-articles";
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

/**
 * Pages linked from Desk 2's nav, banner, CTA and footer — they stay on doehealth.care instead of bouncing to `/`.
 * `/pricing` and `/earlypreview` are served here too, so doehealth.care/pricing and doehealth.care/earlypreview open those pages,
 * and so are the `/preview-<slug>` article duplicates /earlypreview links to. `/services` is served only here:
 * doe.care bounces it back to `/`.
 */
const DOEHEALTH_CARE_SUBPAGES = [
  "/about",
  "/careers",
  "/news",
  "/pricing",
  "/security",
  "/waitlist",
  "/doehealthdesk",
  "/earlypreview",
  "/services",
  ...PREVIEW_ARTICLE_PATHS,
];

export async function middleware(request: NextRequest) {
  const host = requestHostFromHeaders(request.headers);
  const { pathname } = request.nextUrl;
  const adminResponse = await handleAdminAccess(request);
  if (adminResponse) {
    return adminResponse;
  }

  if (pathname === "/voice-agent" || pathname.startsWith("/api/voice-agent/")) {
    const { response } = await createSupabaseMiddlewareClient(request);
    return applyLandingSiteHeaders(response);
  }

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  /** doehealth.care serves Desk 2 at `/`, the blog and the pages Desk 2 links to; any other page bounces back to root. */
  if (isDesignersHost(host)) {
    if (pathname === "/") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = DOEHEALTH_DESK2_PATH;
      return applyLandingSiteHeaders(NextResponse.rewrite(rewriteUrl));
    }
    const isBlog = pathname === DOEHEALTH_BLOG_PATH || pathname.startsWith(`${DOEHEALTH_BLOG_PATH}/`);
    const isDesk2Subpage = DOEHEALTH_CARE_SUBPAGES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // Files from public/ (videos, models, fonts) that the matcher doesn't already skip.
    const isFile = /\/[^/]+\.[a-z0-9]+$/i.test(pathname);
    if (isBlog || isDesk2Subpage || isFile || isAdminAppPath(pathname) || pathname === ADMIN_AUTH_CALLBACK_PATH) {
      return applyLandingSiteHeaders(NextResponse.next());
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return applyLandingSiteHeaders(NextResponse.redirect(redirectUrl));
  }

  if (isMarketingLandingRoot(host, pathname)) {
    /**
     * doe.care `/` is served natively by app/page.tsx (DoeCareFall26DeskPage).
     * Rewriting `/` to another route made the server render that tree while the
     * client hydrated app/page — keep the URL at `/` and render the landing there.
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

  if (
    (pathname === DOEDTC_PATH || pathname.startsWith(`${DOEDTC_PATH}/`)) &&
    isPrimaryHost(host)
  ) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  if (isAdminAppPath(pathname) || pathname === ADMIN_AUTH_CALLBACK_PATH) {
    return applyLandingSiteHeaders(NextResponse.next());
  }

  /**
   * doe.care also serves the pre-launch page, /earlypreview and the `/preview-<slug>` articles it links to, plus the
   * files they load from public/ (videos, models, fonts) that the matcher doesn't already skip.
   */
  if (isPrimaryHost(host)) {
    const isFile = /\/[^/]+\.[a-z0-9]+$/i.test(pathname);
    if (
      pathname === LANDINGLAUNCH_PATH ||
      pathname === "/earlypreview" ||
      pathname.startsWith("/earlypreview/") ||
      PREVIEW_ARTICLE_PATHS.includes(pathname) ||
      isFile
    ) {
      return applyLandingSiteHeaders(NextResponse.next());
    }
  }

  /** doe.care serves the pre-launch landing at `/` only — bounce any other path back to root. */
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
