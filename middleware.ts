import { NextResponse, type NextRequest } from "next/server";

import {
  DESIGNERS_PATH,
  isDesignersHost,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  if (isDesignersHost(host) && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = DESIGNERS_PATH;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
