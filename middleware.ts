import { NextResponse, type NextRequest } from "next/server";

import {
  DOEHEALTH_PATH,
  isDesignersHost,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

function applyDesignersSiteHeaders(response: NextResponse) {
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

  if (!shouldEnforceDomainRouting(host) || !isDesignersHost(host)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-doe-designers-site", "1");

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = DOEHEALTH_PATH;
    return applyDesignersSiteHeaders(
      NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      }),
    );
  }

  return applyDesignersSiteHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
