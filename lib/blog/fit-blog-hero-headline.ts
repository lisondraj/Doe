const MIN_FIT_SCALE = 0.68;
const MIN_FIT_PX = 17;

function measureHeadlineContentWidth(headline: HTMLElement): number {
  const lines = headline.querySelectorAll<HTMLElement>("span.block");
  if (lines.length === 0) return headline.scrollWidth;

  const prevWidth = headline.style.width;
  headline.style.width = "max-content";

  let max = 0;
  lines.forEach((line) => {
    max = Math.max(max, line.scrollWidth);
  });

  headline.style.width = prevWidth;
  return max;
}

/**
 * Shrinks the landing hero headline until both lines fit the grid cell width.
 * Counters in-app browser text inflation (LinkedIn) by measuring after render.
 */
export function fitBlogHeroHeadline(headline: HTMLElement, container: HTMLElement) {
  headline.style.fontSize = "";
  const available = container.clientWidth;
  if (available <= 0) return;

  const computed = parseFloat(getComputedStyle(headline).fontSize);
  if (!Number.isFinite(computed) || computed <= 0) return;

  if (measureHeadlineContentWidth(headline) <= available) return;

  let lo = Math.min(computed * MIN_FIT_SCALE, available / 9);
  let hi = computed;
  let best = lo;

  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    headline.style.fontSize = `${mid}px`;
    if (measureHeadlineContentWidth(headline) <= available * 0.99) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  headline.style.fontSize = `${best}px`;

  if (measureHeadlineContentWidth(headline) > available && best > MIN_FIT_PX) {
    headline.style.fontSize = `${MIN_FIT_PX}px`;
  }
}
