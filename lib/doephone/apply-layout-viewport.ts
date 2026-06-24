import { phoneCanvasZoom } from "@/lib/doephone/phone-canvas-zoom";
import { resolveLayoutWidth } from "@/lib/doephone/resolve-layout-width";

const PINCH_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

/** Apply locked layout + canvas zoom vars to `<html>` (bootstrap + hook). */
export function applyLayoutViewportToDocument(options?: { updateViewportMeta?: boolean }) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const { layoutW, browserVw, needsViewportPin } = resolveLayoutWidth();
  const canvasZoom = phoneCanvasZoom(layoutW);
  const root = document.documentElement;

  root.style.setProperty("--layout-w", `${layoutW}px`);
  root.style.setProperty("--browser-vw", `${browserVw}px`);
  root.style.setProperty("--phone-canvas-zoom", `${canvasZoom}`);
  root.style.setProperty("--app-vw", `${layoutW}px`);

  if (needsViewportPin) {
    root.setAttribute("data-layout-corrected", "true");
  } else {
    root.removeAttribute("data-layout-corrected");
  }

  const vv = window.visualViewport;
  const innerH = window.innerHeight;
  const height = Math.round(Math.max(innerH, vv?.height ?? 0));
  const appVh =
    canvasZoom > 0 && canvasZoom < 0.999 ? Math.round(height / canvasZoom) : height;
  root.style.setProperty("--app-vh", `${appVh}px`);

  if (!options?.updateViewportMeta) return;

  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;

  if (needsViewportPin) {
    meta.setAttribute(
      "content",
      `width=${layoutW}, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover`,
    );
  } else {
    meta.setAttribute("content", PINCH_VIEWPORT);
  }
}

export { phoneCanvasZoom };
