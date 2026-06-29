"use client";

import { useLayoutEffect, useState } from "react";

import { isDesignersHost } from "@/lib/site-domains";

/** Non-linked nav chrome — resolved client-side so SSR matches doe.care exactly. */
export function useDesignersStaticNav() {
  const [staticNav, setStaticNav] = useState(false);

  useLayoutEffect(() => {
    setStaticNav(
      isDesignersHost(window.location.hostname) ||
        window.location.pathname === "/designers",
    );
  }, []);

  return staticNav;
}
