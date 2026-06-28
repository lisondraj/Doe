"use client";

import { Lora } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { NAV_HREFS } from "@/components/doe-nav-data";
import { DoePhoneDesktopBuildSection } from "@/components/doephone/DoePhoneDesktopBuildSection";
import { DoePhoneDesktopReceptionSection } from "@/components/doephone/DoePhoneDesktopReceptionSection";
import { DoePhoneDesktopIntegrationsSection } from "@/components/doephone/DoePhoneDesktopIntegrationsSection";
import { DoePhoneDesktopBillingSection } from "@/components/doephone/DoePhoneDesktopBillingSection";
import { DoePhoneDesktopDocumentsWorkflowSection } from "@/components/doephone/DoePhoneDesktopDocumentsWorkflowSection";
import { DoePhoneDesktopCohortWatchSection } from "@/components/doephone/DoePhoneDesktopCohortWatchSection";
import { DoePhoneDesktopIntelligenceSection } from "@/components/doephone/DoePhoneDesktopIntelligenceSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DesktopMainNavCta } from "@/components/home/DesktopMainNavCta";
import { DesktopNavEmailButton } from "@/components/nav/DesktopNavEmailButton";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_DESKTOP_PAGE_MARGIN_X,
  DESKTOP_HOME_PANEL_BAND_H,
} from "@/lib/doephone/section-styles";

/** Set true to restore mega-menu hover panels (kept in codebase). */
const DESKTOP_NAV_DROPDOWN_ENABLED = false;

/** Desktop hero: wheel delta budgets this much × viewport height to complete zoom (~same range as legacy 280vh driver minus one screen). */
const DESKTOP_HERO_WHEEL_ZOOM_RATIO = 1.8;

/**
 * Desktop hero wheel normalization 0→3: backdrop zoom+Doe scrub [0,1]; mission type [1,2];
 * reserved scroll budget [2,3] before page unlock.
 */
const DESKTOP_HERO_SCROLL_LINEAR_COMPLETE = 3;

/** Local Suisse Intl trial faces — scoped to hero triage preview typography. */
const suisseIntl = localFont({
  src: [
    { path: "../../fonts/suisse/SuisseIntlTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "../../fonts/suisse/SuisseIntlTrial-Semibold.otf", weight: "600", style: "normal" },
  ],
  display: "swap",
});

const DESKTOP_NAV_ITEMS = [
  { label: "Features", href: NAV_HREFS.Features },
  { label: "Team", href: NAV_HREFS.Team },
  { label: "Blog", href: NAV_HREFS.Blog },
  { label: "Vision", href: NAV_HREFS["Our Vision"] },
] as const;

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DESKTOP_FOOTER_GRADIENT = `
  radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
  radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  linear-gradient(to right, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%),
  linear-gradient(to left, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%)
`;

const dropdownContent: Record<string, { items: { title: string; desc: string }[]; featured?: { title: string; desc: string } }> = {
  Features: {
    items: [
      { title: "AI Diagnosis", desc: "Frontier models to assist clinical decision-making." },
      { title: "Patient Records", desc: "Unified health records accessible anywhere." },
      { title: "Care Pathways", desc: "Automated, evidence-based care planning." },
      { title: "Telemedicine", desc: "Connect patients and providers instantly." },
    ],
    featured: { title: "Doe Platform", desc: "The end-to-end AI layer for modern healthcare delivery." },
  },
  Security: {
    items: [
      { title: "HIPAA Compliance", desc: "Built from the ground up for healthcare data laws." },
      { title: "End-to-End Encryption", desc: "All data encrypted in transit and at rest." },
      { title: "Access Controls", desc: "Role-based permissions for every team." },
      { title: "Audit Logs", desc: "Full traceability of every action taken." },
    ],
    featured: { title: "Trust Center", desc: "Our commitment to the highest security standards in healthcare." },
  },
  Students: {
    items: [
      { title: "Med School Prep", desc: "AI-guided study plans tailored to your timeline." },
      { title: "Clinical Simulations", desc: "Practice real scenarios with AI patients." },
      { title: "Mentorship", desc: "Connect with experienced physicians worldwide." },
      { title: "Residency Tools", desc: "Resources to navigate your residency journey." },
    ],
    featured: { title: "Doe for Students", desc: "Empowering the next generation of healthcare professionals." },
  },
  Company: {
    items: [
      { title: "About Us", desc: "Our mission to reimagine global healthcare." },
      { title: "Careers", desc: "Join a team building the future of medicine." },
      { title: "Press", desc: "Latest news and media resources." },
      { title: "Contact", desc: "Get in touch with our team." },
    ],
    featured: { title: "Our Story", desc: "Founded to bring frontier AI to the patients who need it most." },
  },
};

export function DesktopHome() {
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const [carouselSectionOpacity, setCarouselSectionOpacity] = useState(0);
  const [carouselSectionTranslateY, setCarouselSectionTranslateY] = useState(40);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [slidingBoxesOpacity, setSlidingBoxesOpacity] = useState(0);
  const [slidingBoxesTranslateY, setSlidingBoxesTranslateY] = useState(40);
  /**
   * Desktop hero wheel normalization 0→3: backdrop zoom+Doe scrub on [0,1], typed mission on [1,2],
   * AI prompt card on [2,3].
   * Page scroll unlocks only once this reaches DESKTOP_HERO_SCROLL_LINEAR_COMPLETE.
   */
  const [desktopHeroScrollLinear, setDesktopHeroScrollLinear] = useState(1);
  const desktopHeroWheelLinearRef = useRef(1);
  const desktopHeroScrollReleasedRef = useRef(true);
  const [desktopHeroScrollReleased, setDesktopHeroScrollReleased] = useState(true);

  const releaseDesktopHeroScroll = () => {
    desktopHeroScrollReleasedRef.current = true;
    setDesktopHeroScrollReleased(true);
  };

  /**
   * Mid-page reload / scroll restoration: hero state resets but the window may already be
   * scrolled, so the wheel gate never opens and `documentElement` stays overflow hidden.
   */
  useLayoutEffect(() => {
    const mqPhone = window.matchMedia("(max-width: 639px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const unlockIfDocumentAlreadyScrolled = () => {
      if (mqPhone.matches || mqReduce.matches) return;
      if (desktopHeroScrollReleasedRef.current) return;
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y <= 8) return;
      desktopHeroWheelLinearRef.current = DESKTOP_HERO_SCROLL_LINEAR_COMPLETE;
      setDesktopHeroScrollLinear(DESKTOP_HERO_SCROLL_LINEAR_COMPLETE);
      releaseDesktopHeroScroll();
    };

    unlockIfDocumentAlreadyScrolled();
    const t0 = window.setTimeout(unlockIfDocumentAlreadyScrolled, 0);
    const t1 = window.setTimeout(unlockIfDocumentAlreadyScrolled, 100);
    window.addEventListener("load", unlockIfDocumentAlreadyScrolled);
    window.addEventListener("pageshow", unlockIfDocumentAlreadyScrolled);
    window.addEventListener("scroll", unlockIfDocumentAlreadyScrolled, { passive: true });
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.removeEventListener("load", unlockIfDocumentAlreadyScrolled);
      window.removeEventListener("pageshow", unlockIfDocumentAlreadyScrolled);
      window.removeEventListener("scroll", unlockIfDocumentAlreadyScrolled);
    };
  }, []);

  /** Breakpoint synced with carousel/phone UX — declare before hero hooks that read it */
  const [isPhoneLayout, setIsPhoneLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const updateLayout = () => {
      setIsPhoneLayout(mq.matches);
    };
    updateLayout();
    mq.addEventListener("change", updateLayout);
    window.addEventListener("resize", updateLayout);
    return () => {
      mq.removeEventListener("change", updateLayout);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  /** Lock page scroll until desktop hero zoom finishes (wheel drives zoom without advancing layout). */
  useLayoutEffect(() => {
    const mqPhone = window.matchMedia("(max-width: 639px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyScrollLockOverlay = () => {
      const noLock = mqPhone.matches || mqReduce.matches || desktopHeroScrollReleasedRef.current;
      document.documentElement.style.overflow = noLock ? "" : "hidden";
    };

    const syncMediaOpensGate = () => {
      if (mqPhone.matches || mqReduce.matches) {
        releaseDesktopHeroScroll();
      }
      applyScrollLockOverlay();
    };

    syncMediaOpensGate();

    mqPhone.addEventListener("change", syncMediaOpensGate);
    mqReduce.addEventListener("change", syncMediaOpensGate);
    return () => {
      mqPhone.removeEventListener("change", syncMediaOpensGate);
      mqReduce.removeEventListener("change", syncMediaOpensGate);
      document.documentElement.style.overflow = "";
    };
  }, [desktopHeroScrollReleased]);

  /** Wheel deltas advance hero zoom linearly until release; prevents scrolling into section 2 early. */
  useLayoutEffect(() => {
    if (desktopHeroScrollReleasedRef.current) return undefined;

    const mqPhone = window.matchMedia("(max-width: 639px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const budgetPx = () =>
      DESKTOP_HERO_SCROLL_LINEAR_COMPLETE * DESKTOP_HERO_WHEEL_ZOOM_RATIO * Math.max(1, window.innerHeight);

    const applyWheelLinear = (linear: number) => {
      const maxLin = DESKTOP_HERO_SCROLL_LINEAR_COMPLETE;
      const clampedLinear = Math.min(maxLin, Math.max(0, linear));
      desktopHeroWheelLinearRef.current = clampedLinear;
      setDesktopHeroScrollLinear(clampedLinear);
      if (clampedLinear >= maxLin - 1e-5) {
        releaseDesktopHeroScroll();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (desktopHeroScrollReleasedRef.current || mqPhone.matches || mqReduce.matches) {
        return;
      }

      const b = budgetPx();
      const sy = window.scrollY;
      const lin = desktopHeroWheelLinearRef.current;

      // Rewind zoom with wheel-up while pinned to top of document
      if (e.deltaY < 0 && sy < 3 && lin > 0) {
        e.preventDefault();
        applyWheelLinear(lin + e.deltaY / b);
        return;
      }

      // Consume wheel through zoom phase + typed mission phase (same budget length as legacy single phase)
      if (e.deltaY > 0 && sy < 3 && lin < DESKTOP_HERO_SCROLL_LINEAR_COMPLETE - 1e-5) {
        e.preventDefault();
        applyWheelLinear(lin + e.deltaY / b);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as AddEventListenerOptions);
    };
  }, [desktopHeroScrollReleased]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Second section — carousel fade-in and slide-up
      if (secondSectionRef.current) {
        const rect = secondSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;

        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.55;
        const distance = startPoint - endPoint;

        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);

          setSlidingBoxesOpacity(clampedProgress);
          setSlidingBoxesTranslateY(40 * (1 - clampedProgress));
        } else if (sectionTop < endPoint) {
          setSlidingBoxesOpacity(1);
          setSlidingBoxesTranslateY(0);
        } else {
          setSlidingBoxesOpacity(0);
          setSlidingBoxesTranslateY(40);
        }
      }
      
      // Calculate carousel section fade-in and slide-up animation
      if (carouselSectionRef.current) {
        const rect = carouselSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Start animation when section enters viewport (when top is at 85% of viewport)
        // Complete animation when section is at 60% from top of viewport
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.6;
        const distance = startPoint - endPoint;
        
        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          // Section is in animation range
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);
          
          // Fade in: 0 to 1
          setCarouselSectionOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setCarouselSectionTranslateY(40 * (1 - clampedProgress));
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setCarouselSectionOpacity(1);
          setCarouselSectionTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setCarouselSectionOpacity(0);
          setCarouselSectionTranslateY(40);
        }
      }

    };

    // Set initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  /** Match beige nav backdrop: fade in scrolling down ~85→90vh, fade out symmetrically upward */
  const HERO_NAV_FADE_START_RATIO = 0.85;
  const HERO_NAV_FADE_RANGE_RATIO = 0.05;
  const heroNavRevealUnclamped =
    (scrollY - viewportHeight * HERO_NAV_FADE_START_RATIO) /
    (viewportHeight * HERO_NAV_FADE_RANGE_RATIO);
  const heroNavReveal = Math.min(Math.max(heroNavRevealUnclamped, 0), 1);

  const showNavShadow =
    scrollY > 100 &&
    scrollY < viewportHeight * (HERO_NAV_FADE_START_RATIO + HERO_NAV_FADE_RANGE_RATIO);

  const showBackgroundBox = scrollY >= viewportHeight * HERO_NAV_FADE_START_RATIO;
  const isOnHero = scrollY < viewportHeight * HERO_NAV_FADE_START_RATIO;
  const isDropdownOpen = DESKTOP_NAV_DROPDOWN_ENABLED && activeDropdown !== null;
  const navOnWhiteBar = scrollY >= viewportHeight * HERO_NAV_FADE_START_RATIO;
  const navTextColor = navOnWhiteBar ? "#000" : "#fff";
  const navTextShadow = showNavShadow && isOnHero ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";
  const loginButtonBg = navOnWhiteBar ? "#000" : "#fff";
  const loginButtonText = navOnWhiteBar ? "#fff" : "#000";
  const loginButtonShadow = showNavShadow && isOnHero ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";

  /** White nav on the orange hero until the cream section bar takes over. */
  const desktopHeroNavChrome = !isPhoneLayout && !navOnWhiteBar;

  const heroNavRevealPainted = Math.max(
    heroNavReveal,
    desktopHeroNavChrome ? 1 : 0,
  );

  const heroNavPointerOk = desktopHeroNavChrome || heroNavReveal >= 0.04;
  const heroNavInk = desktopHeroNavChrome ? "#ffffff" : navTextColor;
  const heroNavShadowResolved = desktopHeroNavChrome
    ? "0 1px 3px rgba(0, 0, 0, 0.28)"
    : navTextShadow;
  const heroWaitlistBg = desktopHeroNavChrome ? "#ffffff" : loginButtonBg;
  const heroWaitlistFg = desktopHeroNavChrome ? "#000000" : loginButtonText;
  const heroWaitlistShadow = desktopHeroNavChrome
    ? "0 2px 6px rgba(0, 0, 0, 0.12)"
    : loginButtonShadow;
  const heroCtaDivider = desktopHeroNavChrome
    ? "rgba(0, 0, 0, 0.12)"
    : "rgba(255, 255, 255, 0.22)";
  const heroMailBg = desktopHeroNavChrome ? "transparent" : "#000000";
  const heroMailFg = "#ffffff";
  const heroMailBorder = desktopHeroNavChrome ? "rgba(255, 255, 255, 0.35)" : undefined;

  return (
    <div className="relative overflow-x-hidden" style={{ backgroundColor: '#F7F6F3' }}>
      {/* Hero — same gradient + headline as /doephone mobile */}
      {/* z-[40]: stack above later sections (z-10) so fixed nav isn’t painted under carousel / gradients */}
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection variant="desktop" />

        {/* Navigation Bar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-[50] transition-opacity duration-300 ease-out ${
            !heroNavPointerOk ? 'pointer-events-none' : ''
          }`}
          style={{
            opacity: DESKTOP_NAV_DROPDOWN_ENABLED && isDropdownOpen ? 1 : heroNavRevealPainted,
            backgroundColor: 'transparent',
            borderBottom:
              !desktopHeroNavChrome &&
              navOnWhiteBar &&
              (showBackgroundBox || isDropdownOpen)
                ? '1px solid #E6E6E6'
                : 'none',
            transition: 'opacity 280ms ease-out, border-bottom 100ms ease-out',
          }}
          onMouseLeave={DESKTOP_NAV_DROPDOWN_ENABLED ? () => setActiveDropdown(null) : undefined}
        >
          <>
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
          {/* Background box when close to second section — hide during mission-type nav */}
          {showBackgroundBox && !isDropdownOpen && !desktopHeroNavChrome && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                backgroundColor: '#F7F6F3',
              }}
            />
          )}
          {/* Top bar — white bar only after hero */}
          <div className={`relative z-10 flex items-center justify-between py-6 ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
            <Link
              href="/"
              className={`text-4xl font-normal no-underline transition-all duration-300 ${lora.className}`}
              style={{
                color: heroNavInk,
                textShadow: heroNavShadowResolved,
              }}
            >
              Doe
            </Link>

            <div className="flex shrink-0 items-center gap-2.5">
              <DesktopNavEmailButton
                bg={heroMailBg}
                fg={heroMailFg}
                borderColor={heroMailBorder}
              />

              <DesktopMainNavCta
                bg={heroWaitlistBg}
                fg={heroWaitlistFg}
                shadow={heroWaitlistShadow}
                divider={heroCtaDivider}
              />
            </div>
          </div>

          {/* Dropdown Panel — disabled via DESKTOP_NAV_DROPDOWN_ENABLED */}
          <div
            className="overflow-hidden transition-all duration-150 ease-out relative z-20"
            style={{
              maxHeight: isDropdownOpen ? "400px" : "0px",
              opacity: isDropdownOpen ? 1 : 0,
            }}
          >
            {/* Top border line */}
            <div className={`${DOEPHONE_DESKTOP_PAGE_MARGIN_X} border-t border-gray-200 relative z-30`} style={{ borderColor: '#E6E6E6' }} />

            <div className="py-8">
              <div 
                className={`max-w-[1400px] mx-auto flex ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
                style={{ gap: '24px', height: '144px' }}
                onMouseLeave={() => setHoveredBox(null)}
              >
                {(() => {
                  let labels;
                  if (activeDropdown === 'Security') {
                    labels = ['HIPAA', 'SOC 2 Type II', 'PHIPA', 'PIPA'];
                  } else if (activeDropdown === 'Students') {
                    labels = ['LADDR', '', '', ''];
                  } else if (activeDropdown === 'Company') {
                    labels = ['VISION', 'CAREERS', 'PRICING', 'INTEGRATION'];
                  } else {
                    labels = ['INBOX', 'FINANCE', 'BRAIN', 'ACADEMICS'];
                  }
                  
                  return [0, 1, 2, 3].map((i) => {
                    const isHovered = hoveredBox === i;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl cursor-pointer relative"
                        style={{
                          background: '#E5E5E5',
                          flex: hoveredBox === i ? '10 1 0' : hoveredBox !== null ? '2 1 0' : '1 1 0',
                          transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease, background 200ms ease',
                          opacity: hoveredBox !== null && hoveredBox !== i ? 0.5 : 1,
                          height: '144px',
                        }}
                        onMouseEnter={() => setHoveredBox(i)}
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
            <div className={`${DOEPHONE_DESKTOP_PAGE_MARGIN_X} border-b border-gray-200 relative z-30`} style={{ borderColor: '#E6E6E6' }} />
          </div>
          </>
        </nav>
      </div>

      {/* Horizontal line at bottom of hero section */}
      <div className="w-full border-t border-[#E6E6E6]" />

      {/* Second Section — intelligence copy + deployments UI */}
      <div ref={secondSectionRef} className={`relative z-10 ${DESKTOP_HOME_PANEL_BAND_H}`}>
        <div
          className={`relative flex flex-col items-stretch justify-center ${DESKTOP_HOME_PANEL_BAND_H}`}
          style={{
            opacity: slidingBoxesOpacity,
            transform: `translateY(${slidingBoxesTranslateY}px)`,
            transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
          }}
        >
          <DoePhoneDesktopIntelligenceSection />
        </div>
      </div>

      {/* Third section — iPhone Build backdrop + title + workflow input */}
      <DoePhoneDesktopBuildSection />

      {/* Fourth section — reception panel (mirrors second section) */}
      <div ref={carouselSectionRef} className={`relative z-10 ${DESKTOP_HOME_PANEL_BAND_H}`}>
        <div
          className={`relative flex flex-col items-stretch justify-center ${DESKTOP_HOME_PANEL_BAND_H}`}
          style={{
            opacity: carouselSectionOpacity,
            transform: `translateY(${carouselSectionTranslateY}px)`,
            transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
          }}
        >
          <DoePhoneDesktopReceptionSection />
        </div>
      </div>

      {/* Fifth section — integrations gradient + 3D block grid */}
      <DoePhoneDesktopIntegrationsSection />

      {/* Sixth section — billing panel (mirrors second section) */}
      <DoePhoneDesktopBillingSection />

      {/* Seventh section — documents workflow band (mirrors integrations) */}
      <DoePhoneDesktopDocumentsWorkflowSection />

      {/* Eighth section — cohort watch panel (mirrors second section) */}
      <div className={`relative z-10 ${DESKTOP_HOME_PANEL_BAND_H}`}>
        <div className={`relative flex flex-col items-stretch justify-center ${DESKTOP_HOME_PANEL_BAND_H}`}>
          <DoePhoneDesktopCohortWatchSection />
        </div>
      </div>

      {/* Footer — full-bleed gradient band aligned to page margins */}
      <footer
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-20"
        style={{ background: DESKTOP_FOOTER_GRADIENT }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 1,
            mixBlendMode: "overlay",
          }}
          aria-hidden
        />
        <div className={`relative z-10 flex items-center justify-between ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <h1 className={`text-4xl font-normal text-white ${lora.className}`}>Doe</h1>

          <nav className="ml-auto grid grid-cols-2 gap-x-12 gap-y-4" aria-label="Footer">
            {DESKTOP_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white no-underline transition-colors hover:text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
