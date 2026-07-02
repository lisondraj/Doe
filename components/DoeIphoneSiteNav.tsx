"use client";

import Link from "next/link";
import { Inter, Lora } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MOBILE_NAV_FOOTER_SLIDES,
  NAV_HREFS,
  NAV_ITEMS,
} from "@/components/doe-nav-data";
import {
  subpageNavHasButton,
  SubpageMobileNavRow,
  subpageVariantFromCtaLayout,
} from "@/components/subpage/SubpageMobileNavRow";
import { MobileNavActionRow, type MobileNavActionChrome } from "@/components/nav/MobileNavActionRow";
import {
  DOEPHONE_NAV_TRIPLE_CTA_CLASS,
  DOEPHONE_NAV_WAITLIST_CLASS,
} from "@/lib/doephone/waitlist-button";
import {
  DOEPHONE_FIXED_NAV_CONTENT_LEFT,
  DOEPHONE_FIXED_NAV_CONTENT_RIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
} from "@/lib/doephone/section-styles";
import { ABOUT_LABEL, MAIN_HOME_NAV_SHEET_ITEMS } from "@/lib/subpage/subpage-nav";
import { ABOUT_PATH, JOIN_PAGE_HREF, WAITLIST_PATH } from "@/lib/site-domains";
import {
  NAV_FOOTER_BOX_TITLE_TW,
  NAV_FOOTER_CARD_INSET,
  NAV_FOOTER_DATE_TW,
  NAV_FOOTER_OUTSIDE_INSET,
  NAV_FOOTER_OUTSIDE_TITLE_TW,
} from "@/lib/home/nav-footer-carousel-styles";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Matches second-section workflow carousel band (`app/page.tsx`). */
const narrowHorizontalInset =
  "iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))]";

const NAV_SHEET_MS = 320;
const NAV_SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function isViewportPinching(): boolean {
  const vv = window.visualViewport;
  return vv != null && vv.scale > 1.02;
}

/** Same visible viewport logic as `app/page.tsx` / blog — drives nav sheet remeasure on resize. */
function siteNavAppViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

const NAV_JOIN_ROW_GAP =
  "gap-3.5 iphone-page:gap-[clamp(0.65rem,0.48rem+0.85vmin,0.95rem)]";
const NAV_DEFAULT_ROW_GAP =
  "gap-2.5 iphone-page:gap-[clamp(0.45rem,0.35rem+0.65vmin,0.7rem)]";

export type SiteNavCtaLayout =
  | "single"
  | "triple"
  | "join-waitlist"
  | "main-home"
  | "subpage-join"
  | "subpage-about"
  | "subpage-waitlist";

export type NavSheetItem = { label: string; href: string };

function NavChromeStrip({
  navTextColor,
  mobileNavOpen,
  toggleMenu,
  pinchSafe = false,
  homeHref = "/",
  joinHref = JOIN_PAGE_HREF,
  showJoinCta = true,
  showApplyScrollCta = false,
  logoLink = true,
  showMenu = true,
  ctaLayout = "single",
  mobileNavChrome,
  navActionLinksEnabled = true,
  brandName = "Doe",
  brandFontClass,
  investorsHref,
}: {
  navTextColor: string;
  mobileNavOpen: boolean;
  toggleMenu: () => void;
  pinchSafe?: boolean;
  homeHref?: string;
  joinHref?: string;
  showJoinCta?: boolean;
  showApplyScrollCta?: boolean;
  logoLink?: boolean;
  showMenu?: boolean;
  ctaLayout?: SiteNavCtaLayout;
  mobileNavChrome?: MobileNavActionChrome;
  navActionLinksEnabled?: boolean;
  brandName?: string;
  brandFontClass?: string;
  investorsHref?: string;
}) {
  const pageInsetX = DOEPHONE_SECTION_CAROUSEL_INSET_X;
  const pageDoeLeft =
    "left-14 iphone-page:left-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";
  const pageApplyRight =
    "right-14 iphone-page:right-[max(2.35rem,calc(env(safe-area-inset-right,0px)+5.25vmin))]";
  const pageNavLeftPad =
    "pl-14 iphone-page:pl-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";
  const effectiveCtaLayout = showApplyScrollCta ? "subpage-join" : ctaLayout;
  const subpageVariant = subpageVariantFromCtaLayout(effectiveCtaLayout);
  const subpageAnchored = subpageVariant !== null && !showMenu;
  const subpageWithButton = subpageVariant !== null && subpageNavHasButton(subpageVariant);
  const subpageRight = pinchSafe ? DOEPHONE_FIXED_NAV_CONTENT_RIGHT : pageApplyRight;
  const navInsetX = subpageAnchored && subpageWithButton
    ? `${pageNavLeftPad} pr-0`
    : subpageAnchored
      ? DOEPHONE_SECTION_CAROUSEL_INSET_X
      : pinchSafe
        ? "px-11 iphone-page:px-[max(1.65rem,calc(env(safe-area-inset-left,0px)+3.8vmin))] iphone-page:pr-[max(1.65rem,env(safe-area-inset-right,0px))]"
        : "px-8 iphone-page:px-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))]";
  const doeLeft = subpageAnchored
    ? subpageWithButton
      ? pageDoeLeft
      : pinchSafe
        ? DOEPHONE_FIXED_NAV_CONTENT_LEFT
        : pageDoeLeft
    : pinchSafe
      ? "left-11 iphone-page:left-[max(1.65rem,calc(env(safe-area-inset-left,0px)+3.8vmin))]"
      : "left-8 iphone-page:left-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))]";
  const doeClassName = `absolute top-1/2 -translate-y-1/2 ${doeLeft} font-normal z-[1] min-w-0 whitespace-nowrap ${brandFontClass ?? lora.className} text-4xl iphone-page:text-[clamp(1.85rem,1.05rem+3.55vmin,3.9rem)] iphone-page:leading-none`;
  const navRightInset = pinchSafe
    ? "right-11 iphone-page:right-[max(1.65rem,env(safe-area-inset-right,0px)+3.8vmin)]"
    : "right-8 iphone-page:right-[max(1.25rem,calc(env(safe-area-inset-right,0px)+2.85vmin))]";
  const tripleCtaAnchored = ctaLayout === "triple" && !showMenu;
  const navRowGap = subpageAnchored ? NAV_JOIN_ROW_GAP : NAV_DEFAULT_ROW_GAP;
  const navStripMinH = tripleCtaAnchored
    ? "min-h-[clamp(4.35rem,3.55rem+3.15vmin,5.15rem)]"
    : "";

  return (
    <div
      className={`${navInsetX} ${navStripMinH} py-6 iphone-page:py-[clamp(0.8125rem,0.52rem+1.55vmin,1.9rem)] flex items-center relative z-10 iphone-page:gap-[clamp(0.45rem,0.35rem+0.85vmin,0.75rem)] ${subpageAnchored && subpageWithButton ? "" : "justify-end"}`}
    >
      {logoLink ? (
        <Link href={homeHref} className={`${doeClassName} transition-opacity duration-500 ease-out opacity-100`} style={{ color: navTextColor }}>
          {brandName}
        </Link>
      ) : (
        <span className={doeClassName} style={{ color: navTextColor }}>
          {brandName}
        </span>
      )}

      <div className="hidden items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_ITEMS.map((item) => (
          <span key={item} className="text-sm">
            {item}
          </span>
        ))}
      </div>

      <div
        className={`flex shrink-0 items-center ${navRowGap} ${subpageAnchored ? `absolute top-1/2 z-[2] -translate-y-1/2 ${subpageRight}` : ""} ${tripleCtaAnchored ? `absolute top-1/2 z-[2] -translate-y-1/2 ${navRightInset}` : ""}`}
      >
        {subpageVariant ? (
          <SubpageMobileNavRow variant={subpageVariant} showLinks={!showMenu || !subpageWithButton} />
        ) : ctaLayout === "main-home" || ctaLayout === "subpage-about" ? (
          <MobileNavActionRow {...mobileNavChrome} linksEnabled={navActionLinksEnabled} investorsHref={investorsHref} />
        ) : ctaLayout === "triple" ? (
          <>
            <Link href={WAITLIST_PATH} className={DOEPHONE_NAV_TRIPLE_CTA_CLASS}>
              Waitlist
            </Link>
            <Link href={joinHref} className={DOEPHONE_NAV_TRIPLE_CTA_CLASS}>
              Join Us
            </Link>
            <a href={ABOUT_PATH} className={DOEPHONE_NAV_TRIPLE_CTA_CLASS}>
              {ABOUT_LABEL}
            </a>
          </>
        ) : showJoinCta ? (
          <a href={joinHref} className={DOEPHONE_NAV_WAITLIST_CLASS}>
            Join Waitlist
          </a>
        ) : (
          <span
            className={`${DOEPHONE_NAV_WAITLIST_CLASS} invisible pointer-events-none select-none`}
            aria-hidden
          >
            Join Waitlist
          </span>
        )}

        {showMenu ? (
          <button
            type="button"
            className="flex items-center justify-center p-3 iphone-page:p-[clamp(0.625rem,0.38rem+1.35vmin,0.975rem)] rounded-xl transition-colors active:bg-black/[0.04]"
            style={{ color: navTextColor }}
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMenu}
          >
            {mobileNavOpen ? (
              <svg
                className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        ) : !tripleCtaAnchored && !subpageAnchored && showMenu ? (
          <span
            className="invisible pointer-events-none flex items-center justify-center p-3 iphone-page:p-[clamp(0.625rem,0.38rem+1.35vmin,0.975rem)]"
            aria-hidden
          >
            <svg
              className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]"
              viewBox="0 0 24 24"
              aria-hidden
            />
          </span>
        ) : null}
      </div>

      {subpageAnchored ? (
        <div
          className={`ml-auto flex shrink-0 items-center ${navRowGap} invisible pointer-events-none`}
          aria-hidden
        >
          {subpageVariant ? <SubpageMobileNavRow variant={subpageVariant} interactive={false} /> : null}
          {subpageVariant === "main" ? (
            <span className="flex items-center justify-center p-3 iphone-page:p-[clamp(0.625rem,0.38rem+1.35vmin,0.975rem)]">
              <svg
                className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]"
                viewBox="0 0 24 24"
                aria-hidden
              />
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Fixed Doe wordmark + hamburger, with the same full-screen iPhone nav sheet and
 * three-card featured carousel as the home page — solid beige chrome for subpages.
 */
export default function DoeIphoneSiteNav({
  pinchSafe = false,
  homeHref = "/",
  joinHref = JOIN_PAGE_HREF,
  showJoinCta = true,
  showApplyScrollCta = false,
  logoLink = true,
  showMenu = true,
  ctaLayout = "single",
  navSheetItems,
  mobileNavChrome,
  navActionLinksEnabled = true,
  brandName = "Doe",
  brandFontClass,
  navChromeTheme = "light",
  investorsHref,
}: {
  pinchSafe?: boolean;
  homeHref?: string;
  joinHref?: string;
  showJoinCta?: boolean;
  showApplyScrollCta?: boolean;
  logoLink?: boolean;
  showMenu?: boolean;
  ctaLayout?: SiteNavCtaLayout;
  navSheetItems?: readonly NavSheetItem[];
  mobileNavChrome?: MobileNavActionChrome;
  navActionLinksEnabled?: boolean;
  brandName?: string;
  brandFontClass?: string;
  navChromeTheme?: "light" | "dark";
  investorsHref?: string;
}) {
  const resolvedNavSheetItems: readonly NavSheetItem[] =
    navSheetItems ??
    (ctaLayout === "main-home" ||
    ctaLayout === "subpage-join" ||
    ctaLayout === "subpage-about" ||
    ctaLayout === "subpage-waitlist"
      ? MAIN_HOME_NAV_SHEET_ITEMS
      : NAV_ITEMS.map((item) => ({ label: item, href: NAV_HREFS[item] })));
  const isPhoneLayout = true;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /** Keeps the sheet mounted through the close animation. */
  const [navSheetLive, setNavSheetLive] = useState(false);
  /** Drives enter/exit opacity + slide on the sheet layer. */
  const [navSheetVisualOpen, setNavSheetVisualOpen] = useState(false);
  const [mobileNavFooterSlide, setMobileNavFooterSlide] = useState(0);
  const mobileNavFooterCarouselRef = useRef<HTMLDivElement>(null);
  /** Carousel width when the sheet first opens — `zoom` shrinks uniformly if the window gets narrower (matches home `app/page.tsx`). */
  const mobileNavFooterWidthBaselineRef = useRef(0);
  const [mobileNavFooterZoom, setMobileNavFooterZoom] = useState(1);
  const navBarRowRef = useRef<HTMLDivElement>(null);
  const [iphoneMenuTopPx, setIphoneMenuTopPx] = useState(88);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [appViewport, setAppViewport] = useState({ width: 1200, height: 800 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      setNavSheetLive(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setNavSheetVisualOpen(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setNavSheetVisualOpen(false);
    const t = window.setTimeout(() => setNavSheetLive(false), NAV_SHEET_MS);
    return () => window.clearTimeout(t);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (pinchSafe) {
      setViewportWidth(window.innerWidth);
      setAppViewport({ width: window.innerWidth, height: window.innerHeight });
      const onOrientation = () => {
        setViewportWidth(window.innerWidth);
        setAppViewport({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("orientationchange", onOrientation);
      return () => window.removeEventListener("orientationchange", onOrientation);
    }

    const tick = () => {
      if (isViewportPinching()) return;
      setViewportWidth(window.innerWidth);
      setAppViewport(siteNavAppViewportPx());
    };
    tick();
    window.addEventListener("resize", tick);
    window.addEventListener("orientationchange", tick);
    window.visualViewport?.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("resize", tick);
      window.removeEventListener("orientationchange", tick);
      window.visualViewport?.removeEventListener("resize", tick);
    };
  }, [pinchSafe]);

  useLayoutEffect(() => {
    const navEl = navBarRowRef.current;
    if (!navEl) return;

    const measure = () => {
      const raw = navEl.getBoundingClientRect().bottom;
      const px = Math.max(0, Math.floor(raw) - (pinchSafe ? 0 : 6));
      setIphoneMenuTopPx((prev) => (prev === px ? prev : px));
    };

    measure();

    if (pinchSafe) {
      let raf = 0;
      if (mobileNavOpen) {
        raf = requestAnimationFrame(measure);
      }
      const onOrientation = () => measure();
      window.addEventListener("orientationchange", onOrientation);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("orientationchange", onOrientation);
      };
    }

    let raf1 = 0;
    let raf2 = 0;
    if (mobileNavOpen) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(measure);
      });
    }
    const ro = new ResizeObserver(measure);
    ro.observe(navEl);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [mobileNavOpen, pinchSafe, ...(pinchSafe ? [] : [viewportWidth, appViewport.width, appViewport.height])]);

  useLayoutEffect(() => {
    if (!mobileNavOpen || pinchSafe) return;
    const fit = () => {
      const el = mobileNavFooterCarouselRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      if (cw <= 0) return;
      if (mobileNavFooterWidthBaselineRef.current <= 0) {
        mobileNavFooterWidthBaselineRef.current = cw;
      }
      const base = mobileNavFooterWidthBaselineRef.current;
      const z = Math.min(1, cw / base);
      setMobileNavFooterZoom((prev) => (Math.abs(prev - z) < 0.002 ? prev : z));
    };

    fit();
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(fit);
    });
    const el = mobileNavFooterCarouselRef.current;
    const ro = new ResizeObserver(fit);
    if (el) ro.observe(el);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, [mobileNavOpen, appViewport.width, appViewport.height, pinchSafe]);

  useEffect(() => {
    if (!navSheetLive) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [navSheetLive]);

  useEffect(() => {
    if (!navSheetLive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navSheetLive]);

  useEffect(() => {
    if (!mobileNavOpen) {
      setMobileNavFooterSlide(0);
      mobileNavFooterWidthBaselineRef.current = 0;
      setMobileNavFooterZoom(1);
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const id = window.setInterval(() => {
      const el = mobileNavFooterCarouselRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const len = MOBILE_NAV_FOOTER_SLIDES.length;
      const i = Math.min(len - 1, Math.max(0, Math.round(el.scrollLeft / w)));
      const next = (i + 1) % len;
      el.scrollTo({ left: next * w, behavior: "smooth" });
      setMobileNavFooterSlide(next);
    }, 4000);
    return () => window.clearInterval(id);
  }, [mobileNavOpen]);

  const navTextColor = navChromeTheme === "dark" ? "#E8EDEF" : "#000";
  const navBackground = navChromeTheme === "dark" ? "#121819" : "#F7F6F3";
  const navBorderColor = navChromeTheme === "dark" ? "#2A3538" : "#E6E6E6";
  const navSheetTransition = `opacity ${NAV_SHEET_MS}ms ${NAV_SHEET_EASE}, transform ${NAV_SHEET_MS}ms ${NAV_SHEET_EASE}`;
  const navFooterCarouselZoom = pinchSafe ? 1 : mobileNavFooterZoom;

  const mobileMenuLayerContent = navSheetLive ? (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] cursor-pointer bg-black/25"
        style={{
          opacity: navSheetVisualOpen ? 1 : 0,
          transition: `opacity ${NAV_SHEET_MS}ms ${NAV_SHEET_EASE}`,
          pointerEvents: navSheetVisualOpen ? "auto" : "none",
        }}
        aria-label="Close navigation menu"
        onClick={() => setMobileNavOpen(false)}
      />
      <div className="fixed inset-0 z-[95] pointer-events-none" role="presentation">
        {!pinchSafe ? (
          <div
            className="absolute inset-x-0 top-0 bg-[#F7F6F3] pointer-events-none"
            style={{ height: iphoneMenuTopPx }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-x-0 bottom-0 bg-[#F7F6F3] flex flex-col pointer-events-auto overflow-hidden min-h-0"
          style={{
            top: iphoneMenuTopPx,
            opacity: navSheetVisualOpen ? 1 : 0,
            transform: navSheetVisualOpen ? "translateY(0)" : "translateY(-10px)",
            transition: navSheetTransition,
            pointerEvents: navSheetVisualOpen ? "auto" : "none",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <nav className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {resolvedNavSheetItems.map((item) => (
              <div key={item.href} className="border-b border-[#E6E6E6]">
                <Link
                  href={item.href}
                  className={`flex w-full items-center text-left font-medium tracking-[-0.02em] text-gray-900 pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+12px+2.4vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] py-4 iphone-page:py-[clamp(0.65rem,0.42rem+1.35vmin,1.2rem)] active:bg-black/[0.04] transition-colors no-underline ${inter.className} text-4xl iphone-page:text-[clamp(1.52rem,0.82rem+2.92vmin,3.92rem)] iphone-page:leading-none`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="min-w-0">{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>
          <div className="shrink-0 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+10px))] iphone-page:pb-[max(0.9375rem,calc(env(safe-area-inset-bottom,0px)+clamp(10px,1.85vmin,20px)))] pt-4 iphone-page:pt-[clamp(0.75rem,0.52rem+1.05vmin,1.25rem)] border-t border-[#ECEAE6]">
            <div
              ref={mobileNavFooterCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const w = el.clientWidth;
                if (w <= 0) return;
                setMobileNavFooterSlide(
                  Math.min(
                    MOBILE_NAV_FOOTER_SLIDES.length - 1,
                    Math.max(0, Math.round(el.scrollLeft / w))
                  )
                );
              }}
              aria-label="Featured"
            >
              {MOBILE_NAV_FOOTER_SLIDES.map((slide) => (
                <div
                  key={slide.boxTitle}
                  className={`w-full min-w-full shrink-0 snap-center box-border space-y-3 py-3 px-4 ${narrowHorizontalInset} iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)] iphone-page:py-[clamp(0.75rem,0.5rem+1vmin,1.125rem)]`}
                >
                  <div
                    className="w-full space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]"
                    style={{ zoom: navFooterCarouselZoom }}
                  >
                    <div className="relative rounded-[1.375rem] iphone-page:rounded-[clamp(1.2rem,1rem+1.4vmin,2.1rem)] overflow-hidden min-h-[30rem] iphone-page:min-h-[clamp(22rem,58vmin,48rem)] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
                      <div className="absolute inset-0" style={{ background: slide.gradient }} aria-hidden />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          opacity: slide.lineOverlay.opacity,
                          mixBlendMode: slide.lineOverlay.mixBlendMode,
                          backgroundImage: slide.lineOverlay.backgroundImage,
                          backgroundSize: slide.lineOverlay.backgroundSize,
                          backgroundPosition: slide.lineOverlay.backgroundPosition,
                        }}
                        aria-hidden
                      />
                      <div className="absolute left-0 right-0 top-0 z-[4] flex justify-center gap-2.5 iphone-page:gap-[clamp(0.65rem,0.45rem+1vmin,0.95rem)] px-5 pt-10 iphone-page:pt-[clamp(2rem,1.55rem+1.95vmin,3.5rem)] pb-1">
                        {MOBILE_NAV_FOOTER_SLIDES.map((s, dotI) => (
                          <button
                            key={s.boxTitle}
                            type="button"
                            aria-label={`Show ${s.boxTitle}`}
                            aria-current={mobileNavFooterSlide === dotI ? "true" : undefined}
                            className={`h-2.5 iphone-page:h-[clamp(9px,calc(6px+0.45vmin),12px)] shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 shadow-sm ${
                              mobileNavFooterSlide === dotI
                                ? "w-8 iphone-page:w-[clamp(1.95rem,calc(1.65rem+1.9vmin),2.85rem)] bg-white opacity-95"
                                : "w-2.5 iphone-page:w-[clamp(0.625rem,calc(0.5rem+0.42vmin),0.75rem)] bg-white/45 hover:bg-white/70"
                            }`}
                            onClick={() => {
                              const el = mobileNavFooterCarouselRef.current;
                              if (!el) return;
                              const step = el.clientWidth;
                              el.scrollTo({ left: dotI * step, behavior: "smooth" });
                              setMobileNavFooterSlide(dotI);
                            }}
                          />
                        ))}
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start ${NAV_FOOTER_CARD_INSET}`}>
                        <div className={`text-white ${NAV_FOOTER_BOX_TITLE_TW}`}>
                          <span>{slide.boxTitle}</span>
                        </div>
                      </div>
                    </div>
                    <div className={NAV_FOOTER_OUTSIDE_INSET}>
                      <Link
                        href="/#students"
                        className="block w-full text-left active:opacity-80 transition-opacity no-underline"
                        onClick={() => setMobileNavOpen(false)}
                        aria-label="See what we are building"
                      >
                        <span className={NAV_FOOTER_OUTSIDE_TITLE_TW}>
                          See what we&apos;re building&nbsp;→
                        </span>
                      </Link>
                      <p className={NAV_FOOTER_DATE_TW}>
                        {slide.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  const mobileMenuLayer =
    showMenu &&
    !pinchSafe &&
    mounted &&
    isPhoneLayout &&
    navSheetLive &&
    createPortal(mobileMenuLayerContent, document.body);

  const navChromeElevated =
    showMenu &&
    !pinchSafe &&
    mounted &&
    navSheetLive &&
    createPortal(
      <header
        className="fixed top-0 left-0 right-0 z-[200] iphone-page:pt-[env(safe-area-inset-top,0px)] border-b"
        style={{
          opacity: navSheetVisualOpen ? 1 : 0.98,
          transition: navSheetTransition,
          backgroundColor: navBackground,
          borderColor: navBorderColor,
        }}
      >
        <NavChromeStrip
          navTextColor={navTextColor}
          mobileNavOpen={navSheetLive}
          toggleMenu={() => setMobileNavOpen((o) => !o)}
          pinchSafe={pinchSafe}
          homeHref={homeHref}
          joinHref={joinHref}
          showJoinCta={showJoinCta}
          showApplyScrollCta={showApplyScrollCta}
          logoLink={logoLink}
          showMenu={showMenu}
          ctaLayout={ctaLayout}
          mobileNavChrome={mobileNavChrome}
          navActionLinksEnabled={navActionLinksEnabled}
          brandName={brandName}
          brandFontClass={brandFontClass}
          investorsHref={investorsHref}
        />
      </header>,
      document.body
    );

  return (
    <>
      <nav
        ref={navBarRowRef}
        className={`${pinchSafe ? "doephone-site-nav " : ""}fixed top-0 left-0 right-0 iphone-page:pt-[env(safe-area-inset-top,0px)] ${
          navSheetLive ? "z-[200]" : "z-50"
        } ${pinchSafe ? "translate-z-0" : ""}`}
        style={{
          backgroundColor: navBackground,
          borderBottom: `1px solid ${navBorderColor}`,
          boxShadow: pinchSafe ? `0 -120px 0 120px ${navBackground}` : undefined,
          transition: "border-bottom 100ms ease-out, border-color 100ms ease-out, background-color 180ms ease-out",
        }}
      >
        <div
          className={pinchSafe ? undefined : "transition-opacity duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]"}
          style={
            pinchSafe
              ? undefined
              : {
                  opacity: navSheetLive ? 0 : 1,
                  pointerEvents: navSheetLive ? "none" : "auto",
                }
          }
          aria-hidden={pinchSafe ? undefined : navSheetLive ? true : undefined}
        >
          <NavChromeStrip
            navTextColor={navTextColor}
            mobileNavOpen={mobileNavOpen}
            toggleMenu={() => setMobileNavOpen((o) => !o)}
            pinchSafe={pinchSafe}
            homeHref={homeHref}
            joinHref={joinHref}
            showJoinCta={showJoinCta}
            showApplyScrollCta={showApplyScrollCta}
            logoLink={logoLink}
            showMenu={showMenu}
            ctaLayout={ctaLayout}
            mobileNavChrome={mobileNavChrome}
            navActionLinksEnabled={navActionLinksEnabled}
            brandName={brandName}
            brandFontClass={brandFontClass}
            investorsHref={investorsHref}
          />
        </div>
      </nav>
      {pinchSafe && showMenu ? mobileMenuLayerContent : null}
      {mobileMenuLayer}
      {navChromeElevated}
    </>
  );
}
