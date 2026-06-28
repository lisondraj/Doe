"use client";

import { Lora, Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
} from "react";
import { NAV_HREFS } from "@/components/doe-nav-data";
import { HERO_CAROUSEL_GRAIN_BG } from "@/components/hero-carousel-texture";
import { DoePhoneDesktopBuildSection } from "@/components/doephone/DoePhoneDesktopBuildSection";
import { DoePhoneDesktopReceptionSection } from "@/components/doephone/DoePhoneDesktopReceptionSection";
import { DoePhoneDesktopIntegrationsSection } from "@/components/doephone/DoePhoneDesktopIntegrationsSection";
import { DoePhoneDesktopIntelligenceSection } from "@/components/doephone/DoePhoneDesktopIntelligenceSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DesktopMainNavCta } from "@/components/home/DesktopMainNavCta";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DESIGN3_BACKDROP,
  DESIGN5_BACKDROP,
  DESIGN6_BACKDROP,
} from "@/lib/workflow-carousel-design-backdrops";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_DESKTOP_PAGE_MARGIN_X,
} from "@/lib/doephone/section-styles";
import {
  TESTIMONIAL_MEDALLION_GRADIENT,
} from "@/lib/main-page-design-backdrop";

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

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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

/**
 * “Build with us” surfaces — same gradients as the sliding workflow boxes (modal cards).
 * 0: Box 1 Scheduled Updates — linear 135°
 * 1: Box 2 Report Results — radial center
 * 2: Box 3 Diagnostic Assistant — linear 180°
 */
const BUILD_WITH_US_VARIANTS: {
  background: string;
  backgroundSize: string;
  backgroundPosition: string;
  lightWash: string;
}[] = [
  {
    background: `linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    lightWash: `
                      radial-gradient(ellipse 95% 75% at 92% 8%, rgba(255, 255, 255, 0.2) 0%, transparent 52%),
                      radial-gradient(ellipse 65% 55% at 6% 92%, rgba(30, 52, 58, 0.38) 0%, transparent 58%),
                      linear-gradient(158deg, transparent 0%, rgba(255, 255, 255, 0.055) 42%, transparent 78%)
                    `,
  },
  {
    background: `radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    lightWash: `
                      radial-gradient(ellipse 88% 70% at 50% 18%, rgba(255, 255, 255, 0.18) 0%, transparent 50%),
                      radial-gradient(ellipse 70% 60% at 50% 92%, rgba(30, 52, 58, 0.35) 0%, transparent 55%),
                      linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 45%, transparent 80%)
                    `,
  },
  {
    background: `linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    lightWash: `
                      radial-gradient(ellipse 90% 70% at 50% 6%, rgba(255, 255, 255, 0.2) 0%, transparent 48%),
                      radial-gradient(ellipse 85% 65% at 50% 100%, rgba(30, 52, 58, 0.4) 0%, transparent 55%),
                      linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)
                    `,
  },
];

const BUILD_WITH_US_NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

function BuildWithUsBentoSurface({
  meshId,
  variant,
  className = "",
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { meshId: string; variant: 0 | 1 | 2 }) {
  const strokeGradId = `buildWithUsMeshStroke_${meshId}`;
  const blurFilterId = `buildWithUsMeshBlur_${meshId}`;
  const v = BUILD_WITH_US_VARIANTS[variant] ?? BUILD_WITH_US_VARIANTS[0];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
      style={{
        background: v.background,
        backgroundSize: v.backgroundSize,
        backgroundPosition: v.backgroundPosition,
        ...style,
      }}
      {...rest}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: BUILD_WITH_US_NOISE_BG,
          backgroundSize: "200px 200px",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: v.lightWash,
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
        style={{ opacity: 0.42 }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 880"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id={strokeGradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="65%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id={blurFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
            </filter>
          </defs>
          <g
            fill="none"
            stroke={`url(#${strokeGradId})`}
            strokeWidth="0.75"
            strokeLinecap="round"
            filter={`url(#${blurFilterId})`}
          >
            <path d="M -40 420 Q 180 140 400 300 T 860 180" />
            <path d="M 40 780 Q 260 520 480 640 T 860 480" />
            <path d="M -20 200 Q 220 360 440 220 T 820 320" />
            <path d="M 120 900 Q 340 640 560 760 T 780 600" />
          </g>
          <g fill="rgba(255,255,255,0.2)">
            <circle cx="180" cy="260" r="2" />
            <circle cx="420" cy="310" r="2" />
            <circle cx="620" cy="200" r="2" />
            <circle cx="320" cy="580" r="2" />
            <circle cx="540" cy="680" r="2" />
          </g>
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 5px, rgba(255,255,255,0.028) 5px, rgba(255,255,255,0.028) 6px)",
          mixBlendMode: "overlay",
          opacity: 0.85,
        }}
      />
    </div>
  );
}

export function DesktopHome() {
  const [gradientAngle, setGradientAngle] = useState(135);
  const [colorShift, setColorShift] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [hoveredBuildBox, setHoveredBuildBox] = useState<number | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const [carouselSectionOpacity, setCarouselSectionOpacity] = useState(0);
  const [carouselSectionTranslateY, setCarouselSectionTranslateY] = useState(40);
  const [activeWordVisible, setActiveWordVisible] = useState(true);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const [thirdSectionOpacity, setThirdSectionOpacity] = useState(0);
  const [thirdSectionTranslateY, setThirdSectionTranslateY] = useState(40);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [slidingBoxesOpacity, setSlidingBoxesOpacity] = useState(0);
  const [slidingBoxesTranslateY, setSlidingBoxesTranslateY] = useState(40);
  const newGradientSectionRef = useRef<HTMLDivElement>(null);
  const [newGradientSectionOpacity, setNewGradientSectionOpacity] = useState(0);
  const [newGradientSectionTranslateY, setNewGradientSectionTranslateY] = useState(40);
  const [newGradientTitleOpacity, setNewGradientTitleOpacity] = useState(0);
  const [newGradientTitleTranslateY, setNewGradientTitleTranslateY] = useState(40);
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

  const buildSectionRef = useRef<HTMLDivElement>(null);
  const [buildTitleOpacity, setBuildTitleOpacity] = useState(0);
  const [buildTitleTranslateY, setBuildTitleTranslateY] = useState(40);
  const [buildBoxesOpacity, setBuildBoxesOpacity] = useState(0);
  const [buildBoxesTranslateY, setBuildBoxesTranslateY] = useState(40);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Calls' | 'Workflow'>('Inbox');

  const tabDesignBackdrops = {
    Inbox: DESIGN5_BACKDROP,
    Calls: DESIGN6_BACKDROP,
    Workflow: DESIGN3_BACKDROP,
  } as const;

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
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Slowly rotate gradient angle
      setGradientAngle((prev) => (prev + (deltaTime * 0.01)) % 360);
      
      // Shift colors subtly
      setColorShift((prev) => (prev + (deltaTime * 0.02)) % 100);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
      
      // Calculate third section fade-in and slide-up animation
      if (thirdSectionRef.current) {
        const rect = thirdSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Start animation when section enters viewport (when top is at 80% of viewport)
        // Complete animation when section is at 20% from top of viewport
        const startPoint = viewportHeight * 0.8;
        const endPoint = viewportHeight * 0.2;
        const distance = startPoint - endPoint;
        
        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          // Section is in animation range
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);
          
          // Fade in: 0 to 1
          setThirdSectionOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setThirdSectionTranslateY(40 * (1 - clampedProgress));
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setThirdSectionOpacity(1);
          setThirdSectionTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setThirdSectionOpacity(0);
          setThirdSectionTranslateY(40);
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
      
      // Calculate new gradient section fade-in and slide-up animation
      if (newGradientSectionRef.current) {
        const rect = newGradientSectionRef.current.getBoundingClientRect();
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
          
          // Title animation
          setNewGradientTitleOpacity(clampedProgress);
          setNewGradientTitleTranslateY(40 * (1 - clampedProgress));
          
          // Gradient box animation (starts after title at 30% progress)
          if (clampedProgress >= 0.3) {
            const gradientProgress = (clampedProgress - 0.3) / 0.7; // 0 to 1 when title is 30% to 100%
            const clampedGradientProgress = Math.min(Math.max(gradientProgress, 0), 1);
            setNewGradientSectionOpacity(clampedGradientProgress);
            setNewGradientSectionTranslateY(40 * (1 - clampedGradientProgress));
          } else {
            setNewGradientSectionOpacity(0);
            setNewGradientSectionTranslateY(40);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setNewGradientTitleOpacity(1);
          setNewGradientTitleTranslateY(0);
          setNewGradientSectionOpacity(1);
          setNewGradientSectionTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setNewGradientTitleOpacity(0);
          setNewGradientTitleTranslateY(40);
          setNewGradientSectionOpacity(0);
          setNewGradientSectionTranslateY(40);
        }
      }
      
      if (buildSectionRef.current) {
        const rect = buildSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.6;
        const distance = startPoint - endPoint;
        
        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);
          
          setBuildTitleOpacity(clampedProgress);
          setBuildTitleTranslateY(40 * (1 - clampedProgress));
          
          if (clampedProgress >= 0.6) {
            const buildBoxesProgress = (clampedProgress - 0.6) / 0.4;
            const clampedBoxesProgress = Math.min(Math.max(buildBoxesProgress, 0), 1);
            setBuildBoxesOpacity(clampedBoxesProgress);
            setBuildBoxesTranslateY(40 * (1 - clampedBoxesProgress));
          } else {
            setBuildBoxesOpacity(0);
            setBuildBoxesTranslateY(40);
          }
        } else if (sectionTop < endPoint) {
          setBuildTitleOpacity(1);
          setBuildTitleTranslateY(0);
          setBuildBoxesOpacity(1);
          setBuildBoxesTranslateY(0);
        } else {
          setBuildTitleOpacity(0);
          setBuildTitleTranslateY(40);
          setBuildBoxesOpacity(0);
          setBuildBoxesTranslateY(40);
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

  // Dynamic color calculation - modern purple gradient palette (gender-neutral, vibrant)
  const getColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${245 + shift}, 85%, ${68 + shift * 0.3}%)`; // Vibrant light blue-purple
  };

  const getColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${250 + shift}, 80%, ${58 + shift * 0.3}%)`; // Vibrant medium blue-purple
  };

  const getColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${255 + shift}, 75%, ${52 + shift * 0.3}%)`; // Vibrant darker blue-purple
  };

  // Sliding boxes gradient - vibrant purple matching screenshot (#7A5AF2 to #5C40E2)
  const getSlidingBoxColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 85%, ${68 + shift * 0.2}%)`; // Light vibrant purple (#7A5AF2)
  };

  const getSlidingBoxColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 80%, ${60 + shift * 0.2}%)`; // Medium vibrant purple
  };

  const getSlidingBoxColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 75%, ${57 + shift * 0.2}%)`; // Dark vibrant purple (#5C40E2)
  };

  // Second box gradient - similar but slightly different
  const getSecondBoxColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${195 + shift}, 80%, ${68 + shift * 0.3}%)`; // Light blue (slightly shifted)
  };

  const getSecondBoxColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${200 + shift}, 75%, ${58 + shift * 0.3}%)`; // Medium light blue (slightly shifted)
  };

  const getSecondBoxColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${205 + shift}, 70%, ${53 + shift * 0.3}%)`; // Dark light blue (slightly shifted)
  };

  // Second gradient colors - blue-focused palette
  const getSecondGradientColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 4;
    return `hsl(${219 + shift}, 75%, ${65 + shift * 0.3}%)`; // Lighter medium blue
  };

  const getSecondGradientColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 4;
    return `hsl(${210 + shift}, 75%, ${60 + shift * 0.3}%)`; // Lighter medium blue
  };

  const getSecondGradientColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 4;
    return `hsl(${220 + shift}, 80%, ${55 + shift * 0.3}%)`; // Lighter deep blue
  };

  // Lighter version of hero gradient for hover boxes (same hue, higher lightness)
  const getHoverColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${205 + shift}, 90%, ${75 + shift * 0.3}%)`; // Light cyan-blue
  };

  const getHoverColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${210 + shift}, 85%, ${70 + shift * 0.3}%)`; // Medium blue (lighter)
  };

  const getHoverColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${225 + shift}, 80%, ${65 + shift * 0.3}%)`; // Deep purple-blue (lighter)
  };

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
            <h1
              className={`text-4xl font-normal transition-all duration-300 ${lora.className}`}
              style={{
                color: heroNavInk,
                textShadow: heroNavShadowResolved,
              }}
            >
              Doe
            </h1>

            <DesktopMainNavCta
              bg={heroWaitlistBg}
              fg={heroWaitlistFg}
              shadow={heroWaitlistShadow}
              divider={heroCtaDivider}
            />
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
      <div ref={secondSectionRef} className="relative z-10 min-h-[112vh]">
        <div
          className="relative flex min-h-[112vh] flex-col items-stretch justify-center"
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
      <div ref={carouselSectionRef} className="relative z-10 min-h-[112vh]">
        <div
          className="relative flex min-h-[112vh] flex-col items-stretch justify-center"
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

      {/* New Section - Hero Gradient Full Page */}
      <div ref={thirdSectionRef} className="min-h-screen w-full relative z-10 p-8">
        <div 
          className="relative flex h-[85vh] w-full flex-col items-center overflow-hidden rounded-2xl pt-14"
          style={{
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            opacity: thirdSectionOpacity,
            transform: `translateY(${thirdSectionTranslateY}px)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden>
            {(['Inbox', 'Calls', 'Workflow'] as const).map((tab) => (
          <div
                key={tab}
                className="absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-500 ease-in-out"
            style={{
                  opacity: activeTab === tab ? 1 : 0,
                  zIndex: activeTab === tab ? 1 : 0,
                }}
              >
                <WorkflowCarouselDesignBackdrop
                  backdrop={tabDesignBackdrops[tab]}
                  embedded
                  patternScale={1.34}
                  className="rounded-2xl"
                />
              </div>
            ))}
          </div>
          {/* Tab Switcher */}
          <div
            className="relative z-10 flex items-center mt-auto mb-8"
            style={{
              backgroundColor: 'rgba(62, 54, 48, 0.38)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRadius: '9999px',
              padding: '7px',
              gap: '4px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.08)',
            }}
          >
            {(['Inbox', 'Calls', 'Workflow'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative z-10 px-7 py-3 text-lg font-medium"
                style={{
                  borderRadius: '9999px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: activeTab === tab ? '#1a1a1a' : 'rgba(255,255,255,0.88)',
                  backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                  transition: 'background-color 300ms ease, color 300ms ease, opacity 300ms ease',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  minWidth: '110px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical decision support — grid + floating medallion */}
      <div
        ref={newGradientSectionRef}
        className="relative z-10 my-[90px] min-h-[78vh] w-full overflow-visible"
      >
        <div
          className="relative z-20 w-full"
          style={{
            opacity: newGradientSectionOpacity,
            transform: `translateY(${newGradientSectionTranslateY}px)`,
            transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
          }}
        >
          <div className="relative min-h-[78vh] w-full py-10">
            <div className="pointer-events-none absolute inset-0">
              <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <pattern id="clinicianSupportGridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                      <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                      <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                      <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                      <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#clinicianSupportGridPattern)" />
                </svg>
                <div
                className="pointer-events-none absolute top-0 left-0 right-0 z-0"
                  style={{
                  height: '72px',
                  background: 'linear-gradient(to bottom, rgba(247, 246, 243, 0.85) 0%, rgba(247, 246, 243, 0.25) 55%, rgba(247, 246, 243, 0) 100%)',
                  }}
                />
                <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-0"
                  style={{
                  height: '72px',
                  background: 'linear-gradient(to top, rgba(247, 246, 243, 0.85) 0%, rgba(247, 246, 243, 0.25) 55%, rgba(247, 246, 243, 0) 100%)',
                  }}
                />
              </div>

            <div
              className="pointer-events-none absolute top-1/2 z-10"
              style={{ right: 'max(-8vmin, -4rem)', transform: 'translateY(-50%)' }}
              aria-hidden
            >
            <div
              className="cds-medallion-float shrink-0 overflow-hidden rounded-full shadow-[0_20px_56px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06] motion-reduce:animate-none"
                  style={{
                width: 'min(85vmin, 48rem)',
                height: 'min(85vmin, 48rem)',
                background: TESTIMONIAL_MEDALLION_GRADIENT,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: HERO_CAROUSEL_GRAIN_BG,
                    backgroundSize: '200px 200px',
                    opacity: 1,
                    mixBlendMode: 'overlay',
                  }}
                />
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
                style={{ marginTop: '-4%', width: '118%', height: '118%' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                {Array.from({ length: 8 }, (_, j) => {
                  const angle = j * 45;
                  const radius = 500;
                  return (
                    <path
                      key={`cds-medallion-rad-${j}`}
                      d={`M 500 500 L ${500 + Math.cos((angle * Math.PI) / 180) * radius} ${500 + Math.sin((angle * Math.PI) / 180) * radius}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.16)"
                      strokeWidth="0.85"
                    />
                  );
                })}
                {Array.from({ length: 6 }, (_, j) => {
                  const r = (j + 1) * 150;
                  return (
                    <circle
                      key={`cds-medallion-ring-${j}`}
                      cx="500"
                      cy="500"
                      r={r}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.14)"
                      strokeWidth="0.85"
                    />
                  );
                })}
              </svg>
                  </div>
                    </div>
                      </div>
                      </div>
                  </div>

      <div className="border-l border-r border-[#E6E6E6] relative left-1/2 max-w-[1800px] w-full -translate-x-1/2">
        <div ref={buildSectionRef} className="relative z-10 w-full">
          <div className={`mx-auto max-w-[1800px] pb-24 pt-16 ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
            <div className="mb-10 text-center">
              <h2
                className={`text-4xl font-normal tracking-tight text-gray-900 ${lora.className}`}
                style={{
                  opacity: buildTitleOpacity,
                  transform: `translateY(${buildTitleTranslateY}px)`,
                  transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
                }}
              >
                Build with us.
              </h2>
            </div>
            <div 
              className="flex gap-8"
              role="group"
              aria-label="Build with Doe — gradient surfaces"
              style={{ 
                height: 'min(520px, 58vh)',
                opacity: buildBoxesOpacity,
                transform: `translateY(${buildBoxesTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
              }}
              onMouseLeave={() => setHoveredBuildBox(null)}
            >
              {([0, 1, 2] as const).map((i) => (
              <BuildWithUsBentoSurface
                  key={`build-${i}`}
                  meshId={`buildDesk${i}`}
                  variant={i}
                  onMouseEnter={() => setHoveredBuildBox(i)}
                style={{
                    flex: hoveredBuildBox === i ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                    opacity: hoveredBuildBox !== null && hoveredBuildBox !== i ? 0.5 : 1,
                  }}
                />
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* Footer */}
      <div className={`relative left-1/2 w-screen -translate-x-1/2 pb-8 ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <div 
            className="py-20 relative rounded-2xl overflow-hidden flex items-center"
            style={{
              background: `
                radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
                radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
                radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
                radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
                radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
                linear-gradient(to right, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%),
                linear-gradient(to left, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%)
              `,
              overflow: 'hidden',
              minHeight: '160px'
            }}
          >
            {/* Grain texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
                opacity: 1,
                mixBlendMode: 'overlay',
              }}
            />
            <div className={`max-w-[1400px] mx-auto w-full flex items-center justify-between relative z-10 ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
            {/* Doe Logo */}
            <h1 className={`text-4xl font-normal text-white ${lora.className}`}>
              Doe
            </h1>

            {/* Footer nav — matches site nav */}
            <nav
              className="ml-auto grid grid-cols-2 gap-x-12 gap-y-4"
              aria-label="Footer"
            >
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
        </div>
      </div>
    </div>
  );
}
