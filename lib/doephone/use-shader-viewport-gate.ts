"use client";

import { useEffect, useState, type RefObject } from "react";

/** Gate WebGL mounts to elements near the viewport (phone + desktop). */
export function useShaderViewportGate(
  nodeRef: RefObject<HTMLElement | null>,
  rootMargin = "85% 0px",
) {
  const [inRange, setInRange] = useState(true);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const sync = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      setInRange(rect.bottom > -vh * 0.85 && rect.top < vh * 1.85);
    };

    sync();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInRange(entry.isIntersecting);
      },
      { rootMargin, threshold: 0 },
    );
    observer.observe(node);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [nodeRef, rootMargin]);

  return inRange;
}
