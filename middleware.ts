import { NextResponse, type NextRequest } from "next/server";

import {
  JOIN_PATH,
  isDesignersHost,
  isMarketingLandingRoot,
  isPrimaryHost,
  joinPageUrl,
  marketingLandingRewritePath,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

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

export function middleware(request: NextRequest) {
  const host = requestHostFromHeaders(request.headers);

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

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
