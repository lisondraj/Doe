import { NextResponse, type NextRequest } from "next/server";

import {
  JOIN_PATH,
  isJoinHost,
  isPrimaryHost,
  joinPageUrl,
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
    // doehealth.care/join is canonical — serve it directly.
    // Any other path on doehealth.care (including /) redirects to /join.
    if (pathname === JOIN_PATH) {
      return NextResponse.next();
    }
    const url = new URL(joinPageUrl(proto));
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  if (isPrimaryHost(host)) {
    // doe.care/join (and /waitlist) redirect to the canonical doehealth.care/join.
    if (
      pathname === JOIN_PATH ||
      pathname.startsWith(JOIN_PATH + "/") ||
      pathname === "/waitlist" ||
      pathname.startsWith("/waitlist/")
    ) {
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
