import { NextResponse, type NextRequest } from "next/server";

import {
  isJoinHost,
  joinPageUrl,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { search } = request.nextUrl;

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  const proto = (request.headers.get("x-forwarded-proto") ?? "https") as "http" | "https";

  if (isJoinHost(host)) {
    const url = new URL(joinPageUrl(proto));
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
