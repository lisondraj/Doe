"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import {
  MOBILE_NAV_FOOTER_SLIDES,
  NAV_HREFS,
  NAV_ITEMS,
} from "@/components/doe-nav-data";
import { HeroLinkedInIcon, HeroSocialIcon, HeroXIcon } from "@/components/home/icons/HeroSocialIcons";
import type { HeroSectionProps } from "@/components/home/PhoneHomeTypes";
import {
  HERO_BACKDROP_GRADIENT,
  narrowHorizontalInset,
} from "@/lib/home/hero-constants";

/** Body copy typography + choreographed reveal — literals here so Tailwind JIT emits them (`${CONST}` imported from `@/lib/home/hero-constants` is not reliably scanned). Sync with lib/home/hero-constants.ts. */
const HERO_BODY_COPY_TW =
  "text-[clamp(1.38rem,4.65vw,2.15rem)] iphone-page:text-[clamp(1.32rem,5vw,2.05rem)] font-medium text-white/[0.88] tracking-tight leading-[1.22]";
const HERO_INTRO_REVEAL_TW = "transition-[opacity,transform] duration-[1050ms] ease-out";

export function HeroSection(props: HeroSectionProps) {
  const {
    heroRevealShellRef,
    heroLogicalHeightPx,
    heroIntroTriggerFineHover,
    runHeroIntroSequence,
    navBarRowRef,
    isPhoneLayout,
    mobileNavOpen,
    showBackgroundBox,
    isDropdownOpen,
    scrollY,
    viewportHeight,
    setActiveDropdown,
    activeDropdown,
    showNavLogo,
    navTextColor,
    navTextShadow,
    loginButtonBg,
    loginButtonText,
    loginButtonShadow,
    setMobileNavOpen,
    hoveredBox,
    setHoveredBox,
    navPortalMounted,
    iphoneMenuTopPx,
    mobileNavFooterCarouselRef,
    setMobileNavFooterSlide,
    mobileNavFooterZoom,
    mobileNavFooterSlide,
    prefersReducedMotionHero,
    heroIntroPhase,
    lora,
    inter,
  } = props;

  return (
    <>
      {/* Hero Section with Dynamic Gradient */}
      <div
        ref={heroRevealShellRef}
        className="relative overflow-hidden"
        style={{
          minHeight: `${heroLogicalHeightPx}px`,
          height: `${heroLogicalHeightPx}px`,
        }}
        onPointerEnter={() => {
          if (heroIntroTriggerFineHover) runHeroIntroSequence();
        }}
      >
        {/* Footer base gradient + line mesh overlay (same as <footer>) */}
        <div className="absolute inset-0">
          <div
            className="pointer-events-none absolute inset-0"
          style={{
            background: HERO_BACKDROP_GRADIENT,
            }}
          />
          <HeroCarouselTextureOverlay />
        </div>
        {/* Navigation Bar */}
        <nav
          ref={navBarRowRef}
          className={`fixed top-0 left-0 right-0 iphone-page:pt-[env(safe-area-inset-top,0px)] ${
            isPhoneLayout && mobileNavOpen ? "z-[100]" : "z-50"
          }`}
          style={{ 
            /** Phone + open sheet: solid bar so safe-area + controls aren’t over transparent hero. */
            backgroundColor:
              isPhoneLayout && mobileNavOpen ? "#F7F6F3" : "transparent",
            /** Stable phone chrome height: reserve 1px border slot so opening menu doesn’t shift layout */
            borderBottom:
              isPhoneLayout
                ? mobileNavOpen || showBackgroundBox || isDropdownOpen
                  ? "1px solid #E6E6E6"
                  : "1px solid transparent"
                : showBackgroundBox || isDropdownOpen
                ? "1px solid #E6E6E6"
                : "none",
            transition: "border-bottom 100ms ease-out, border-color 100ms ease-out, background-color 180ms ease-out",
          }}
          onMouseLeave={() => {
            setActiveDropdown(null);
          }}
        >
          {/* Unified background box for hover dropdown */}
          {isDropdownOpen && (
            <div 
              className="absolute inset-0 transition-opacity duration-150 ease-out z-0"
              style={{ 
                backgroundColor: '#F7F6F3',
                opacity: activeDropdown ? 1 : 0,
                borderBottom: '1px solid #E6E6E6'
              }}
            />
          )}
          {/* Background box when close to second section */}
          {showBackgroundBox && !isDropdownOpen && (
            <div 
              className="absolute inset-0 transition-opacity duration-300"
              style={{ 
                backgroundColor: '#F7F6F3',
                opacity: scrollY >= viewportHeight * 0.9 
                  ? 1 
                  : (scrollY - viewportHeight * 0.85) / (viewportHeight * 0.05)
              }}
            />
          )}
          {/* Top bar */}
          <div
            className="px-8 py-6 iphone-page:py-[clamp(0.8125rem,0.52rem+1.55vmin,1.9rem)] iphone-page:px-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] flex items-center relative z-10 iphone-page:gap-[clamp(0.45rem,0.35rem+0.85vmin,0.75rem)] justify-end"
          >
            {/* Logo — opacity only (no width collapse) so it fades, not slides */}
            <h1
              className={`absolute top-1/2 -translate-y-1/2 left-8 iphone-page:left-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))] font-normal z-[1] min-w-0 whitespace-nowrap transition-opacity duration-500 ease-out ${lora.className} text-4xl iphone-page:text-[clamp(1.85rem,1.05rem+3.55vmin,3.9rem)] iphone-page:leading-none ${
                showNavLogo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!showNavLogo}
            >
              <Link
                href="/"
                className="text-inherit no-underline"
              style={
                  showNavLogo
                    ? { color: navTextColor, textShadow: navTextShadow }
                    : undefined
              }
            >
              Doe
              </Link>
            </h1>

            {/* Desktop: center Navigation Links */}
            <div className="hidden items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  href={NAV_HREFS[item]}
                  className="text-sm font-medium transition-all duration-300 bg-transparent border-none cursor-pointer hover:opacity-70 shrink-0 no-underline"
                  style={{ color: navTextColor, textShadow: navTextShadow }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop: Login */}
            <a
              href="#"
              className="hidden text-sm font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-all duration-300 shrink-0 items-center"
              style={{
                backgroundColor: loginButtonBg,
                color: loginButtonText,
                boxShadow: loginButtonShadow,
              }}
            >
              Waitlist
            </a>

            {/* iPhone: menu (replaces center links + login) */}
            <button
              type="button"
              className="flex items-center justify-center p-3 iphone-page:p-[clamp(0.625rem,0.38rem+1.35vmin,0.975rem)] rounded-xl transition-colors active:bg-white/15"
              style={{ color: navTextColor }}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => {
                setMobileNavOpen((wasOpen) => {
                  if (!wasOpen) setActiveDropdown(null);
                  return !wasOpen;
                });
              }}
            >
              {mobileNavOpen ? (
                <svg className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Dropdown Panel — desktop only (phone uses full-screen sheet; no mega panels) */}
          <div
            className={`overflow-hidden transition-all duration-150 ease-out relative z-20 ${isPhoneLayout ? "hidden" : ""}`}
            style={{
              maxHeight: activeDropdown ? "400px" : "0px",
              opacity: activeDropdown ? 1 : 0,
            }}
          >
            {/* Top border line */}
            <div className="mx-8 iphone-page:mx-4 border-t border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />

            <div className="py-8 iphone-page:py-4">
              <div 
                className={`max-w-[1400px] mx-auto px-8 iphone-page:px-4 flex ${isPhoneLayout ? "flex-col gap-3" : ""}`}
                style={{ gap: isPhoneLayout ? undefined : '24px', height: isPhoneLayout ? 'auto' : '144px' }}
                onMouseLeave={() => setHoveredBox(null)}
              >
                {(() => {
                  let labels;
                  if (activeDropdown === 'Security') {
                    labels = ['HIPAA', 'SOC 2 Type II', 'PHIPA', 'PIPA'];
                  } else if (activeDropdown === 'Students') {
                    labels = ['LADDR', '', '', ''];
                  } else if (activeDropdown === 'Company') {
                    labels = ['VISION', 'CAREERS', 'BLOG', 'INTEGRATION'];
                  } else {
                    labels = ['INBOX', 'FINANCE', 'BRAIN', 'ACADEMICS'];
                  }
                  
                  return [0, 1, 2, 3].map((i) => {
                    const isHovered = hoveredBox === i;
                    const rowFlex = isPhoneLayout
                      ? "none"
                      : hoveredBox === i
                        ? "10 1 0"
                        : hoveredBox !== null
                          ? "2 1 0"
                          : "1 1 0";
                    return (
                      <div
                        key={i}
                        className="rounded-2xl cursor-pointer relative w-full"
                        style={{
                          background: '#E5E5E5',
                          flex: rowFlex,
                          transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease, background 200ms ease',
                          opacity: isPhoneLayout ? 1 : hoveredBox !== null && hoveredBox !== i ? 0.5 : 1,
                          height: isPhoneLayout ? '92px' : '144px',
                          minHeight: isPhoneLayout ? '92px' : undefined,
                        }}
                        onMouseEnter={() => !isPhoneLayout && setHoveredBox(i)}
                        onClick={() => isPhoneLayout && setHoveredBox(isHovered ? null : i)}
                      >
                        {labels[i] && (
                          <div className="absolute bottom-3 left-6 right-6 overflow-hidden">
                            <div className="relative flex items-center" style={{ width: '100%', height: '100%' }}>
                              {/* Original text */}
                              <span 
                                className="font-medium text-black inline-block relative z-10 flex-shrink-0"
                                style={{ 
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                  fontSize: isHovered ? '16px' : '14px',
                                  transition: 'font-size 400ms ease',
                                  color: '#000000'
                                }}
                              >
                                {labels[i]}
                              </span>
                              
                              {/* Repeating text when hovered - starts after original */}
                              {isHovered && (
                                <div 
                                  className="absolute whitespace-nowrap"
                                  style={{
                                    left: `${labels[i] ? labels[i].length * 9 + 20 : 0}px`,
                                    top: '0px',
                                    opacity: 0.1
                                  }}
                                >
                                  {Array(100).fill(0).map((_, idx) => (
                                    <span 
                                      key={idx}
                                      className="font-medium text-black inline-block"
                                      style={{ 
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        fontSize: '16px',
                                        marginRight: '20px',
                                        color: '#000000'
                                      }}
                                    >
                                      {labels[i]}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Bottom border line */}
            <div className="mx-8 iphone-page:mx-4 border-b border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />
          </div>
        </nav>

        {/* iPhone: menu panel — portaled to body so it is not inside the root CSS `zoom` canvas (carousel snap + widths match blog / DoeIphoneSiteNav). */}
        {navPortalMounted &&
          isPhoneLayout &&
          mobileNavOpen &&
          createPortal(
            <>
            <button
              type="button"
              className="fixed inset-0 z-[90] cursor-pointer bg-black/25 transition-opacity duration-300 ease-out"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
            />
            {/*
              Sheet is full-screen (top:0) so CSS-zoom measurement errors can't
              create a hero-peek gap. The fixed nav (z-100 while open) sits above
              this layer; the list is padded down by iphoneMenuTopPx so content
              appears right below it.
            */}
            <div
              className="fixed inset-0 z-[95] pointer-events-none"
              role="presentation"
            >
              {/* Beige fill behind the nav chrome area — no gap possible */}
              <div
                className="absolute inset-x-0 top-0 bg-[#F7F6F3] pointer-events-none"
                style={{ height: iphoneMenuTopPx }}
                aria-hidden
              />
              <div
                className="absolute inset-x-0 bottom-0 isolate flex flex-col bg-[#F7F6F3] pointer-events-auto overflow-hidden min-h-0"
                style={{ top: iphoneMenuTopPx }}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
              >
                <nav className="relative z-[2] flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-[#F7F6F3]">
                  {NAV_ITEMS.map((item) => (
                    <div key={item} className="relative border-b border-[#E6E6E6] bg-[#F7F6F3]">
                      <Link
                        href={NAV_HREFS[item]}
                        className={`flex w-full min-w-0 items-center text-left font-medium tracking-[-0.02em] text-gray-900 pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+12px+2.4vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] py-4 iphone-page:py-[clamp(0.65rem,0.42rem+1.35vmin,1.2rem)] active:bg-black/[0.04] transition-colors no-underline ${inter.className} text-4xl iphone-page:text-[clamp(1.52rem,0.82rem+2.92vmin,3.92rem)] iphone-page:leading-none`}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <span className="min-w-0">{item}</span>
                      </Link>
                    </div>
                  ))}
                </nav>
                {/* Footer — fixed-height band so the carousel never grows into Company subpages above. */}
                <div
                  className="relative z-[1] flex min-h-0 shrink-0 flex-col overflow-x-hidden overflow-y-visible bg-[#F7F6F3] pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+10px))] iphone-page:pb-[max(0.9375rem,calc(env(safe-area-inset-bottom,0px)+clamp(10px,1.85vmin,20px)))] pt-4 iphone-page:pt-[clamp(0.75rem,0.52rem+1.05vmin,1.25rem)] border-t border-[#ECEAE6]"
                >
                  <div
                    ref={mobileNavFooterCarouselRef}
                    className="flex min-h-0 w-full overflow-x-auto overflow-y-visible snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                        className={`w-full min-w-full shrink-0 snap-center box-border space-y-3 overflow-x-clip py-3 px-4 ${narrowHorizontalInset} iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)] iphone-page:py-[clamp(0.75rem,0.5rem+1vmin,1.125rem)]`}
                      >
                        <div
                          className="w-full space-y-3 overflow-x-clip iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]"
                          style={{ zoom: mobileNavFooterZoom }}
                        >
                        <div className="relative h-[30rem] min-h-[30rem] max-h-[30rem] shrink-0 overflow-hidden rounded-[1.375rem] iphone-page:rounded-[clamp(1.2rem,1rem+1.4vmin,2.1rem)] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
                          <div
                            className="absolute inset-0"
                            style={{ background: slide.gradient }}
                            aria-hidden
                          />
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
                          <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-8 iphone-page:p-[clamp(1.35rem,0.9rem+3.1vmin,3.5rem)]">
                            <div className={`text-white ${inter.className}`}>
                              <span className="text-[3.25rem] iphone-page:text-[clamp(2.05rem,1rem+5.5vmin,4.65rem)] font-medium tracking-tight leading-none">
                                {slide.boxTitle}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Link
                            href="/#students"
                            className={`block w-full text-left active:opacity-80 transition-opacity ${inter.className}`}
                            onClick={() => setMobileNavOpen(false)}
                            aria-label="See what we are building"
                          >
                            <span className="text-[1.5rem] iphone-page:text-[clamp(1.38rem,0.88rem+2.3vmin,2.45rem)] font-medium text-gray-800 tracking-tight leading-snug no-underline">
                              See what we&apos;re building&nbsp;→
                            </span>
                          </Link>
                          <p
                            className={`mt-1.5 text-[1.0625rem] iphone-page:text-[clamp(0.98rem,0.78rem+1.15vmin,1.45rem)] font-medium tracking-tight text-gray-500 ${inter.className}`}
                          >
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
          </>,
            document.body,
          )}

        {/* Hero copy — left-aligned stack (logo, story, underlined CTA) */}
        <div
          className={`absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-start justify-center pt-[max(5.25rem,calc(env(safe-area-inset-top,0px)+4rem))] iphone-page:pt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-6 iphone-page:pb-5 ${narrowHorizontalInset}`}
        >
          <div className="flex w-full max-w-[min(100%,46rem)] translate-y-3 iphone-page:translate-y-2 flex-col items-start pl-5 sm:pl-8 md:pl-10 text-left">
            <p
              className={`font-normal leading-none tracking-tight mb-4 iphone-page:mb-3.5 ${HERO_INTRO_REVEAL_TW} will-change-transform ${lora.className} ${
                prefersReducedMotionHero || heroIntroPhase >= 1 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              }`}
              style={{
                fontSize: "clamp(8.25rem, 39vw, 18.5rem)",
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #ffffff 15%, #fafafa 34%, #f5f6f8 52%, #e2e8ee 76%, #c5cdd6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Doe
            </p>

            <div className="flex w-full flex-col items-start gap-[1.1rem] iphone-page:gap-[1.15rem]">
              <p
                className={`flex max-w-full flex-col items-start gap-0.5 ${HERO_BODY_COPY_TW} ${HERO_INTRO_REVEAL_TW} ${
                  prefersReducedMotionHero || heroIntroPhase >= 2 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                <span className="block">We&apos;re building the future</span>
                <span className="block">of AI in healthcare.</span>
              </p>

              <p
                className={`max-w-full ${HERO_BODY_COPY_TW} ${HERO_INTRO_REVEAL_TW} ${
                  prefersReducedMotionHero || heroIntroPhase >= 3 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Meet the founders,
              </p>

              <div
                className={`mt-5 iphone-page:mt-4 flex flex-wrap items-start gap-x-12 gap-y-5 sm:gap-x-16 ${HERO_INTRO_REVEAL_TW} ${
                  prefersReducedMotionHero || heroIntroPhase >= 4 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                <span className="inline-flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center gap-3">
                    <span className="text-[clamp(2.15rem,6.8vw,3.4rem)] iphone-page:text-[clamp(2rem,7vw,3.1rem)] font-medium leading-none tracking-tight text-white/[0.92]">
                      James
                    </span>
                    <span className={`inline-flex items-center gap-2 ${HERO_BODY_COPY_TW}`}>
                      <HeroSocialIcon href="https://x.com/joindoe" label="James on X">
                        <HeroXIcon />
                      </HeroSocialIcon>
                      <HeroSocialIcon href="https://www.linkedin.com/company/joindoe" label="James on LinkedIn">
                        <HeroLinkedInIcon />
                      </HeroSocialIcon>
                    </span>
                  </span>
                  <span className="text-[clamp(1.5rem,4.95vw,2.05rem)] iphone-page:text-[clamp(1.42rem,5.35vw,1.95rem)] font-normal leading-none tracking-tight text-white">
                    Medicine
                  </span>
                </span>
                <span className="inline-flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center gap-3">
                    <span className="text-[clamp(2.15rem,6.8vw,3.4rem)] iphone-page:text-[clamp(2rem,7vw,3.1rem)] font-medium leading-none tracking-tight text-white/[0.92]">
                      Matt
                    </span>
                    <span className={`inline-flex items-center gap-2 ${HERO_BODY_COPY_TW}`}>
                      <HeroSocialIcon href="https://x.com/joindoe" label="Matt on X">
                        <HeroXIcon />
                      </HeroSocialIcon>
                      <HeroSocialIcon href="https://www.linkedin.com/company/joindoe" label="Matt on LinkedIn">
                        <HeroLinkedInIcon />
                      </HeroSocialIcon>
                    </span>
                  </span>
                  <span className="text-[clamp(1.5rem,4.95vw,2.05rem)] iphone-page:text-[clamp(1.42rem,5.35vw,1.95rem)] font-normal leading-none tracking-tight text-white">
                    Engineering
                  </span>
                </span>
              </div>

              <a
                href="mailto:james@doe.care"
                className={`group mt-6 iphone-page:mt-5 inline-flex border-0 bg-transparent p-0 text-left ${HERO_BODY_COPY_TW} font-semibold text-white ${HERO_INTRO_REVEAL_TW} hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-white ${
                  prefersReducedMotionHero || heroIntroPhase >= 5
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                <span
                  className={`inline-flex items-center gap-2 underline decoration-white/70 decoration-2 underline-offset-[0.35em] group-hover:decoration-white ${
                    !prefersReducedMotionHero && heroIntroPhase >= 5 ? "animate-hero-cta-float" : ""
                  }`}
                >
                  <span>Build with us</span>
                  <svg
                    className="h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="sr-only">Opens email composer</span>
              </a>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}
