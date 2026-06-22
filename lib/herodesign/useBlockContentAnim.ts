import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Wait for the box's own hover-in transition (0.75s) to finish before content appears.
const CONTENT_START_DELAY_MS = 780;

/**
 * Drives staggered content-row animations inside a workflow block.
 *
 * Pass a monotonically-increasing `delaySec` per row. Each row fades + slides
 * in after that delay relative to when the card shell appeared.
 *
 * Usage:
 *   const row = useBlockContentAnim(revealed);
 *   <div style={row(0)}>first row</div>
 *   <div style={row(0.65)}>second row</div>
 *   <div style={row(1.3)}>third row</div>
 */
export function useBlockContentAnim(revealed: boolean) {
  const wasRevealedOnMount = useRef(revealed);
  const [animate, setAnimate] = useState(revealed);

  useEffect(() => {
    if (wasRevealedOnMount.current) return;
    if (!revealed) return;
    const t = setTimeout(() => setAnimate(true), CONTENT_START_DELAY_MS);
    return () => clearTimeout(t);
  }, [revealed]);

  return function row(delaySec: number): CSSProperties {
    if (wasRevealedOnMount.current) return {};
    return {
      opacity:   animate ? 1 : 0,
      transform: animate ? "none" : "translateY(7px)",
      transition: animate
        ? `opacity 0.75s ease ${delaySec}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delaySec}s`
        : "none",
    };
  };
}
