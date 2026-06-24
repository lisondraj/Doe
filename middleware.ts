import { NextResponse, type NextRequest } from "next/server";

import {
  JOIN_PATH,
  isJoinHost,
  isPrimaryHost,
  joinPageUrl,
  primarySiteOrigin,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  const proto = (request.headers.get("x-forwarded-proto") ?? "https") as "http" | "https";

  if (isJoinHost(host)) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = JOIN_PATH;
      return NextResponse.redirect(url, 308);
    }

    if (!pathname.startsWith(JOIN_PATH)) {
      const url = new URL(pathname, primarySiteOrigin(proto));
      url.search = search;
      return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
  }

  if (isPrimaryHost(host)) {
    if (pathname === JOIN_PATH || pathname.startsWith(`${JOIN_PATH}/`)) {
      const url = new URL(joinPageUrl(proto));
      url.search = search;
      return NextResponse.redirect(url, 308);
    }

    if (pathname === "/waitlist" || pathname.startsWith("/waitlist/")) {
      const url = new URL(joinPageUrl(proto));
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
