"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { resetDocumentScroll } from "@/lib/navigation/reset-document-scroll";

/** Client navigations should land at the top unless the URL carries a hash target. */
export function RouteScrollReset() {
  const pathname = usePathname();
  const skipNextResetRef = useRef(false);

  useLayoutEffect(() => {
    const onPopState = () => {
      skipNextResetRef.current = true;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (skipNextResetRef.current) {
      skipNextResetRef.current = false;
      return;
    }

    if (window.location.hash.length > 1) return;

    resetDocumentScroll();

    // Next.js can restore scroll one frame after the route commit.
    const raf = window.requestAnimationFrame(() => {
      resetDocumentScroll();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
