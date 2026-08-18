"use client";

import { DoeHomeDesktopView } from "@/components/doehome/DoeHomeDesktopView";
import { DoeHomeMobileView } from "@/components/doehome/DoeHomeMobileView";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import "@/lib/doeinsure/doeinsure-page.css";
import "@/lib/doehome/doehome-page.css";

function DoeHomeGoldDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="doeinsure-blue-defs">
      <defs>
        <linearGradient id="doeinsure-blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#221910" />
          <stop offset="52%" stopColor="#1a1208" />
          <stop offset="100%" stopColor="#130e09" />
        </linearGradient>
        <linearGradient id="doeinsure-blue-gradient-h" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8c08e" />
          <stop offset="52%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#d4a574" stopOpacity="0.72" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DoeHomeRouter() {
  const { variant, ready } = useDoeHomePageVariant();

  if (!ready) {
    return <div className="doehome-root doeinsure-root doeinsure-root--desktop" suppressHydrationWarning />;
  }

  return variant === "desktop" ? (
    <>
      <DoeHomeGoldDefs />
      <DoeHomeDesktopView />
    </>
  ) : (
    <>
      <DoeHomeGoldDefs />
      <DoeHomeMobileView />
    </>
  );
}
