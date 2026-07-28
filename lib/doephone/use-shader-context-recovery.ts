"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Remount grain canvases after WebGL context loss — debounced to avoid remount storms. */
export function useShaderContextRecovery(
  shellRef: RefObject<HTMLElement | null>,
  active: boolean,
  onRecover: () => void,
) {
  const recoverRef = useRef(onRecover);
  recoverRef.current = onRecover;

  useEffect(() => {
    if (!active) return;

    const shell = shellRef.current;
    if (!shell) return;

    let cleanup: (() => void) | undefined;
    let debounceTimer = 0;
    let recovering = false;

    const attach = () => {
      cleanup?.();
      cleanup = undefined;

      const canvas = shell.querySelector("canvas");
      if (!canvas) return;

      const onLost = (event: Event) => {
        event.preventDefault();
        if (recovering) return;
        recovering = true;
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          recovering = false;
          recoverRef.current();
        }, 160);
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
      window.clearTimeout(debounceTimer);
    };
  }, [active, shellRef]);
}
