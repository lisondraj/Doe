import { NextResponse, type NextRequest } from "next/server";

import {
  isDesignersHost,
  requestHostFromHeaders,
  shouldEnforceDomainRouting,
} from "@/lib/site-domains";

export function middleware(request: NextRequest) {
  const host = requestHostFromHeaders(request.headers);

  if (!shouldEnforceDomainRouting(host) || !isDesignersHost(host)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  /** Bust edge/browser caches of the old permanent redirect to /join. */
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate, max-age=0",
  );
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
