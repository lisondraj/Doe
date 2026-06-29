"use client";

import { useLayoutEffect, useState } from "react";

import { isDesignersPageContext } from "@/lib/designers/designers-page-context";

/** Non-linked nav chrome — resolved client-side so SSR matches doe.care exactly. */
export function useDesignersStaticNav() {
  const [staticNav, setStaticNav] = useState(false);

  useLayoutEffect(() => {
    setStaticNav(isDesignersPageContext());
  }, []);

  return staticNav;
}
