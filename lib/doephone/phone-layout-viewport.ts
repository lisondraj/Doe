/** iPhone 14-class layout reference — matches native doe.care mobile scaling. */
export const PHONE_LAYOUT_REFERENCE_WIDTH = 390;

export const PHONE_DEVICE_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

export const PHONE_NARROW_LAYOUT_VIEWPORT = `width=${PHONE_LAYOUT_REFERENCE_WIDTH}, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover`;

export function readLayoutViewportWidth(): number {
  if (typeof document === "undefined") return PHONE_LAYOUT_REFERENCE_WIDTH;
  return Math.max(
    280,
    document.documentElement.clientWidth || window.innerWidth,
  );
}

/** Safari desktop-site mode and wide minimized desktop windows inflate layout width. */
export function shouldUseNarrowPhoneLayoutViewport(width = readLayoutViewportWidth()): boolean {
  return width > PHONE_LAYOUT_REFERENCE_WIDTH + 32;
}

export function phoneLayoutViewportContent(width = readLayoutViewportWidth()): string {
  return shouldUseNarrowPhoneLayoutViewport(width)
    ? PHONE_NARROW_LAYOUT_VIEWPORT
    : PHONE_DEVICE_VIEWPORT;
}

export function applyPhoneLayoutViewportMeta() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  meta.setAttribute("content", phoneLayoutViewportContent());
}

export function phoneLayoutViewportBootstrapScript(): string {
  const ref = PHONE_LAYOUT_REFERENCE_WIDTH;
  const narrow = PHONE_NARROW_LAYOUT_VIEWPORT;
  const device = PHONE_DEVICE_VIEWPORT;

  return `(function(){try{var m=document.querySelector('meta[name="viewport"]');if(!m)return;var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);m.setAttribute("content",w>${ref + 32}?${JSON.stringify(narrow)}:${JSON.stringify(device)});}catch(e){}})();`;
}

/** Safari Dynamic Island + bottom chrome, rubber-band overscroll gutters. */
export function phoneOverflowChromeBootstrapScript(surfaceColor = "#ede8df"): string {
  const color = JSON.stringify(surfaceColor);
  return `(function(){try{var html=document.documentElement;html.style.setProperty("--doe-page-surface",${color});html.style.setProperty("--proto-page-bg",${color});html.style.backgroundColor=${color};if(document.body)document.body.style.backgroundColor=${color};var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",${color});}catch(e){}})();`;
}
