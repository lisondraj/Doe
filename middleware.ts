import { NextResponse, type NextRequest } from "next/server";

import { shouldEnforceDomainRouting } from "@/lib/site-domains";

export function middleware(_request: NextRequest) {
  const host = _request.headers.get("host") ?? "";

  if (!shouldEnforceDomainRouting(host)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
