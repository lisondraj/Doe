"use client";

import { type RefObject, useEffect } from "react";

/**
 * Two-line titles on /doehealthdesk2. Each title is marked `data-fit-two-lines`, and each of its
 * children is one line that never wraps. This hook sets the title's font size so its widest line
 * fills the title's width, so it stays on two lines at every browser and phone size.
 */
const TITLE_SELECTOR = "[data-fit-two-lines]";

/** Text width is linear in font size, so one measurement at the current size gives the fit. */
function widestLine(title: HTMLElement): number {
  const range = document.createRange();
  let widest = 0;
  for (const line of Array.from(title.children)) {
    range.selectNodeContents(line);
    widest = Math.max(widest, range.getBoundingClientRect().width);
  }
  range.detach();
  return widest;
}

function fitTitle(title: HTMLElement) {
  if (title.clientWidth === 0 || title.children.length === 0) return;

  const style = getComputedStyle(title);
  const available = title.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const size = parseFloat(style.fontSize);
  const widest = widestLine(title);
  if (available <= 0 || widest <= 0 || size <= 0) return;

  // A hair under the exact fit so rounding never pushes a line onto a second row.
  const next = size * (available / widest) * 0.995;
  if (Math.abs(next - size) < 0.25) return;
  title.style.fontSize = `${next}px`;
}

export function useDoeHealthDesk2FitTitles(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let frame = 0;
    const fitAll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>(TITLE_SELECTOR).forEach(fitTitle);
      });
    };

    const observed = new WeakSet<Element>();
    const resizeObserver = new ResizeObserver(fitAll);
    const observeTitles = () => {
      root.querySelectorAll(TITLE_SELECTOR).forEach((title) => {
        if (observed.has(title)) return;
        observed.add(title);
        resizeObserver.observe(title);
      });
    };

    // Titles mount and change text as scenes scroll in (the find wheel rotates its lines).
    const mutationObserver = new MutationObserver(() => {
      observeTitles();
      fitAll();
    });
    mutationObserver.observe(root, { childList: true, subtree: true, characterData: true });

    observeTitles();
    fitAll();
    window.addEventListener("resize", fitAll);
    document.fonts?.addEventListener("loadingdone", fitAll);
    void document.fonts?.ready.then(fitAll);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", fitAll);
      document.fonts?.removeEventListener("loadingdone", fitAll);
    };
  }, [rootRef]);
}
