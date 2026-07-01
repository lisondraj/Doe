"use client";

import { useLayoutEffect } from "react";

import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";
import { vbAppViewportPx } from "@/lib/home/vertical-bento";

/** Proto — keep `--app-vw` / `--app-vh` tied to layout width (stable viewport can restore stale widths). */
export function useProtoViewportMetrics(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const apply = () => {
      applyPhoneLayoutViewportMeta();
      const layoutW = Math.max(280, document.documentElement.clientWidth);
      const { height } = vbAppViewportPx();
      const html = document.documentElement;
      html.style.setProperty("--app-vw", `${layoutW}px`);
      html.style.setProperty("--app-vh", `${Math.max(Math.round(height), 320)}px`);
    };

    apply();
    const raf = requestAnimationFrame(apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, [enabled]);
}
