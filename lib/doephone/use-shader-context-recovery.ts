"use client";

import { useEffect, type RefObject } from "react";

/** Remount grain canvases after mobile WebGL context loss (black fill). */
export function useShaderContextRecovery(
  shellRef: RefObject<HTMLElement | null>,
  active: boolean,
  onRecover: () => void,
) {
  useEffect(() => {
    if (!active) return;

    const shell = shellRef.current;
    if (!shell) return;

    let cleanup: (() => void) | undefined;

    const attach = () => {
      cleanup?.();
      cleanup = undefined;

      const canvas = shell.querySelector("canvas");
      if (!canvas) return;

      const onLost = (event: Event) => {
        event.preventDefault();
        onRecover();
      };

      canvas.addEventListener("webglcontextlost", onLost, false);
      cleanup = () => canvas.removeEventListener("webglcontextlost", onLost, false);
    };

    attach();

    const observer = new MutationObserver(() => {
      attach();
    });
    observer.observe(shell, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [active, onRecover, shellRef]);
}
