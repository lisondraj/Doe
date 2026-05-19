"use client";

import { useEffect } from "react";

/** Block iOS Safari pinch gestures so only vertical/horizontal pan (scroll/swipe) is allowed. */
export function useDisablePinchGestures(): void {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", block, { passive: false });
    document.addEventListener("gesturechange", block, { passive: false });
    document.addEventListener("gestureend", block, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", block);
      document.removeEventListener("gesturechange", block);
      document.removeEventListener("gestureend", block);
    };
  }, []);
}
