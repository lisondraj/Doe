"use client";

import { Lora, Old_Standard_TT, Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef, type HTMLAttributes } from "react";
import { NAV_HREFS } from "@/components/doe-nav-data";
import { HERO_CAROUSEL_GRAIN_BG } from "@/components/hero-carousel-texture";
import { DesignHeroBackdropSection } from "@/components/design-hero-backdrop-section";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { WorkflowCarouselSlides } from "@/components/workflow-carousel-slides";
import {
  DESIGN3_BACKDROP,
  DESIGN5_BACKDROP,
  DESIGN6_BACKDROP,
} from "@/lib/workflow-carousel-design-backdrops";
import {
  PATIENT_CARE_GREY_GRID_STYLE,
  TESTIMONIAL_MEDALLION_GRADIENT,
} from "@/lib/main-page-design-backdrop";

/** Set true to restore mega-menu hover panels (kept in codebase). */
const DESKTOP_NAV_DROPDOWN_ENABLED = false;

/** Desktop hero: wheel delta budgets this much × viewport height to complete zoom (~same range as legacy 280vh driver minus one screen). */
const DESKTOP_HERO_WHEEL_ZOOM_RATIO = 1.8;

const DESKTOP_NAV_ITEMS = [
  { label: "Features", href: NAV_HREFS.Features },
  { label: "Team", href: NAV_HREFS.Team },
  { label: "Blog", href: NAV_HREFS.Blog },
  { label: "Vision", href: NAV_HREFS["Our Vision"] },
] as const;

/** Doe … [word] carousel — order matches descriptions + orange UI mock branches */
const CAROUSEL_CATEGORY_WORDS = [
  "Inbox",
  "Agent",
  "Ambient",
  "Front Desk",
  "Labs",
  "Referrals",
  "Patient",
  "Schedule",
  "Billing",
] as const;

/** Widest label at carousel typography — invisible reserve keeps ↑↓ column fixed */
const CAROUSEL_CATEGORY_WORD_WIDTH_ANCHOR = "Front Desk";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oldStandardTT = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
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
  const [slidingBoxScroll, setSlidingBoxScroll] = useState(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState(2);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const [uiMockupOpacity, setUiMockupOpacity] = useState(1);
  const [uiMockupTranslateY, setUiMockupTranslateY] = useState(0);
  const [uiMockupScale, setUiMockupScale] = useState(1);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const [carouselSectionOpacity, setCarouselSectionOpacity] = useState(0);
  const [carouselSectionTranslateY, setCarouselSectionTranslateY] = useState(40);
  const [activeWordVisible, setActiveWordVisible] = useState(true);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isSlidingPaused, setIsSlidingPaused] = useState(false);
  const slidingBoxRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const autoScrollPositionRef = useRef(0);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const [thirdSectionOpacity, setThirdSectionOpacity] = useState(0);
  const [thirdSectionTranslateY, setThirdSectionTranslateY] = useState(40);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [secondSectionTitleOpacity, setSecondSectionTitleOpacity] = useState(0);
  const [secondSectionTitleTranslateY, setSecondSectionTitleTranslateY] = useState(40);
  const [slidingBoxesOpacity, setSlidingBoxesOpacity] = useState(0);
  const [slidingBoxesTranslateY, setSlidingBoxesTranslateY] = useState(40);
  const [shouldStartSlidingAnimation, setShouldStartSlidingAnimation] = useState(false);
  const newGradientSectionRef = useRef<HTMLDivElement>(null);
  const [newGradientSectionOpacity, setNewGradientSectionOpacity] = useState(0);
  const [newGradientSectionTranslateY, setNewGradientSectionTranslateY] = useState(40);
  const [newGradientTitleOpacity, setNewGradientTitleOpacity] = useState(0);
  const [newGradientTitleTranslateY, setNewGradientTitleTranslateY] = useState(40);
  /** Smooth 0→1 desktop hero backdrop zoom — driven by wheel until gate releases (no page scroll yet). */
  const [desktopHeroZoomProgress, setDesktopHeroZoomProgress] = useState(0);
  const desktopHeroWheelLinearRef = useRef(0);
  const desktopHeroScrollReleasedRef = useRef(false);
  const [desktopHeroScrollReleased, setDesktopHeroScrollReleased] = useState(false);

  const releaseDesktopHeroScroll = () => {
    desktopHeroScrollReleasedRef.current = true;
    setDesktopHeroScrollReleased(true);
  };

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

  const [isPhoneLayout, setIsPhoneLayout] = useState(false);

  const [viewportWidth, setViewportWidth] = useState(1200);
  const [phoneSlideSize, setPhoneSlideSize] = useState({ w: 850, h: 1090 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const updateLayout = () => {
      setViewportWidth(window.innerWidth);
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

  useEffect(() => {
    if (!isPhoneLayout) return;
    const measure = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      const horizontalInset = 12;
      const phoneSlideScale = 0.96;
      const w = (vw - horizontalInset * 2) * phoneSlideScale;
      const h = w * 1.28;
      setPhoneSlideSize({ w, h });
    };
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [isPhoneLayout, viewportWidth]);

  const slideGap = isPhoneLayout ? 12 : 20;
  /** Cap card width on large viewports (~12% under old 620) so band reads lighter vs hero. */
  const desktopCarouselMaxW = 545;
  const desktopCarouselW = isPhoneLayout
    ? phoneSlideSize.w
    : Math.min(
        desktopCarouselMaxW,
        Math.max(300, Math.floor((viewportWidth - slideGap) / 2)),
      );
  const desktopCarouselH = Math.round(desktopCarouselW * 1.08);
  const slideBoxW = isPhoneLayout ? phoneSlideSize.w : desktopCarouselW;
  const slideBoxH = isPhoneLayout ? phoneSlideSize.h : desktopCarouselH;
  const carouselViewportW = isPhoneLayout ? slideBoxW : viewportWidth;

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
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const budgetPx = () => DESKTOP_HERO_WHEEL_ZOOM_RATIO * Math.max(1, window.innerHeight);

    const applyWheelLinear = (linear: number) => {
      const clampedLinear = Math.min(1, Math.max(0, linear));
      desktopHeroWheelLinearRef.current = clampedLinear;
      setDesktopHeroZoomProgress(smoothstep(clampedLinear));
      if (clampedLinear >= 1 - 1e-5) {
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

      // Complete zoom without moving scroll position
      if (e.deltaY > 0 && sy < 3 && lin < 1 - 1e-5) {
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

      // Calculate second section title fade-in and slide-up animation
      if (secondSectionRef.current) {
        const rect = secondSectionRef.current.getBoundingClientRect();
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
          setSecondSectionTitleOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setSecondSectionTitleTranslateY(40 * (1 - clampedProgress));
          
          // Sliding boxes animation starts after title animation (at 60% progress)
          // Sliding boxes animation range: 60% to 100% of title animation progress
          if (clampedProgress >= 0.6) {
            const slidingBoxesProgress = (clampedProgress - 0.6) / 0.4; // 0 to 1 when title is 60% to 100%
            const clampedSlidingProgress = Math.min(Math.max(slidingBoxesProgress, 0), 1);
            
            setSlidingBoxesOpacity(clampedSlidingProgress);
            setSlidingBoxesTranslateY(40 * (1 - clampedSlidingProgress));
            
            // Start sliding animation after title animation completes (at 80% progress)
            if (clampedProgress >= 0.8) {
              setShouldStartSlidingAnimation(true);
            }
          } else {
            setSlidingBoxesOpacity(0);
            setSlidingBoxesTranslateY(40);
            setShouldStartSlidingAnimation(false);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setSecondSectionTitleOpacity(1);
          setSecondSectionTitleTranslateY(0);
          setSlidingBoxesOpacity(1);
          setSlidingBoxesTranslateY(0);
          setShouldStartSlidingAnimation(true);
        } else {
          // Section hasn't reached animation point yet
          setSecondSectionTitleOpacity(0);
          setSecondSectionTitleTranslateY(40);
          setSlidingBoxesOpacity(0);
          setSlidingBoxesTranslateY(40);
          setShouldStartSlidingAnimation(false);
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
  }, [isPhoneLayout]);

  // Auto-slide using optimized requestAnimationFrame with hardware acceleration
  useEffect(() => {
    // Only start sliding animation after title animation completes
    if (!shouldStartSlidingAnimation) return;
    
    const boxWidth = slideBoxW;
    const boxTotalWidth = boxWidth + slideGap;
    const totalBoxes = 6;
    const totalWidth = totalBoxes * boxTotalWidth;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    const slideSpeed = 0.05;
    let lastStateUpdate = 0;
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 16.67);
      lastTime = currentTime;
      
      if (!isManualScroll && !isSlidingPaused) {
        autoScrollPositionRef.current += slideSpeed * deltaTime;
        
        const offset = ((autoScrollPositionRef.current % totalWidth) + totalWidth) % totalWidth;
        
        slidingBoxRefs.forEach((boxRef, i) => {
          if (!boxRef.current) return;
          
          let pos = i * boxTotalWidth - offset;
          
          if (pos < -boxTotalWidth) {
            pos += totalWidth;
          }
          
          boxRef.current.style.transform = `translate3d(${pos}px, 0, 0)`;
          boxRef.current.style.willChange = 'transform';
        });
        
        if (currentTime - lastStateUpdate > 100) {
          setSlidingBoxScroll(Math.round(autoScrollPositionRef.current));
          lastStateUpdate = currentTime;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isManualScroll, shouldStartSlidingAnimation, isSlidingPaused, slideBoxW, slideGap]);

  // Initialize box positions when animation starts
  useEffect(() => {
    if (!shouldStartSlidingAnimation) return;
    
    const boxWidth = slideBoxW;
    const boxTotalWidth = boxWidth + slideGap;
    
    slidingBoxRefs.forEach((boxRef, i) => {
      if (boxRef.current) {
        const initialPos = i * boxTotalWidth;
        boxRef.current.style.transform = `translate3d(${initialPos}px, 0, 0)`;
      }
    });
  }, [shouldStartSlidingAnimation, slideBoxW, slideGap]);

  // Keep slide positions in sync when viewport/card sizing changes
  useEffect(() => {
    if (!shouldStartSlidingAnimation) return;

    const boxWidth = slideBoxW;
    const boxTotalWidth = boxWidth + slideGap;
    const totalBoxes = 6;
    const totalWidth = totalBoxes * boxTotalWidth;
    const offset = ((autoScrollPositionRef.current % totalWidth) + totalWidth) % totalWidth;

    slidingBoxRefs.forEach((boxRef, i) => {
      if (!boxRef.current) return;

      let pos = i * boxTotalWidth - offset;
      if (pos < -boxTotalWidth) {
        pos += totalWidth;
      }

      boxRef.current.style.transform = `translate3d(${pos}px, 0, 0)`;
    });
  }, [shouldStartSlidingAnimation, slideBoxW, slideGap]);

  useEffect(() => {
    // Add bento expand and sliding animation styles
    const style = document.createElement('style');
    const boxWidth = slideBoxW;
    const boxGap = slideGap;
    const boxTotalWidth = boxWidth + boxGap;
    const totalBoxes = 6;
    const maxScroll = -(boxTotalWidth * (totalBoxes - 1));
    
    style.textContent = `
      @keyframes bentoExpand {
        0% { transform: scale(0.08); opacity: 0; }
        40% { opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slide-left-continuous {
        0% { transform: translateX(0px); }
        100% { transform: translateX(${maxScroll}px); }
      }
      @keyframes slide-text-right {
        0% { transform: translateX(0px); }
        100% { transform: translateX(2000px); }
      }
    `;
    if (!document.head.querySelector('style[data-slide-animation]')) {
      style.setAttribute('data-slide-animation', 'true');
      document.head.appendChild(style);
    }
  }, [slideBoxW, slideGap]);

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

  // Fit (min) leaves transparent letterboxing when viewport is taller than the fitted
  // square — composites badly with shadows + rounding (gray “pillars” at bottom corners).
  // Cover (max), same as scroll carousel on `app/page.tsx`, fills the card opaquely.
  const slideUniformScale = isPhoneLayout
    ? Math.min(slideBoxW / 700, slideBoxH / 700)
    : Math.max(slideBoxW / 700, slideBoxH / 700);
  const scaledSide = 700 * slideUniformScale;
  const boxTotalWidth = slideBoxW + slideGap;
  const totalBoxes = 6;
  const xStart700 = (slideBoxW - scaledSide) / 2;
  const visibleMargin = 22;
  const captionLeft700 = Math.ceil((visibleMargin - xStart700) / slideUniformScale);
  const captionRight700 = captionLeft700;
  const totalWidth = totalBoxes * boxTotalWidth;
  
  const applySlidingBoxPositions = (scrollPos: number, shouldWrap: boolean = true) => {
    const offset = ((scrollPos % totalWidth) + totalWidth) % totalWidth;

    slidingBoxRefs.forEach((boxRef, i) => {
      if (!boxRef.current) return;

      let pos = i * boxTotalWidth - offset;
      if (shouldWrap && pos < -boxTotalWidth) {
        pos += totalWidth;
      }

      boxRef.current.style.transform = `translate3d(${pos}px, 0, 0)`;
      boxRef.current.style.willChange = 'transform';
    });
  };

  const handleSlideLeft = () => {
    if (isManualScroll) return;

    setIsManualScroll(true);
    const newScroll = autoScrollPositionRef.current + boxTotalWidth;
    autoScrollPositionRef.current = newScroll;
    setSlidingBoxScroll(newScroll);

    slidingBoxRefs.forEach((boxRef, i) => {
      if (!boxRef.current) return;
      const match = boxRef.current.style.transform.match(/translate3d\((-?[\d.]+)px/);
      const currentX = match ? parseFloat(match[1]) : i * boxTotalWidth;
      boxRef.current.style.transition = 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)';
      boxRef.current.style.transform = `translate3d(${currentX - boxTotalWidth}px, 0, 0)`;
    });

    setTimeout(() => {
      setIsManualScroll(false);
      slidingBoxRefs.forEach((boxRef) => {
        if (boxRef.current) boxRef.current.style.transition = 'none';
      });
      applySlidingBoxPositions(newScroll, true);
    }, 820);
  };

  const handleSlideRight = () => {
    if (isManualScroll) return;

    setIsManualScroll(true);
    const newScroll = autoScrollPositionRef.current - boxTotalWidth;
    autoScrollPositionRef.current = newScroll;
    setSlidingBoxScroll(newScroll);

    slidingBoxRefs.forEach((boxRef, i) => {
      if (!boxRef.current) return;
      const match = boxRef.current.style.transform.match(/translate3d\((-?[\d.]+)px/);
      const currentX = match ? parseFloat(match[1]) : i * boxTotalWidth;
      boxRef.current.style.transition = 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)';
      boxRef.current.style.transform = `translate3d(${currentX + boxTotalWidth}px, 0, 0)`;
    });

    setTimeout(() => {
      setIsManualScroll(false);
      slidingBoxRefs.forEach((boxRef) => {
        if (boxRef.current) boxRef.current.style.transition = 'none';
      });
      applySlidingBoxPositions(newScroll, true);
    }, 820);
  };

  // Determine arrow visibility - with perpetual scroll, arrows can always be shown
  // or we can hide them since there's no end. For now, always show them.
  const showLeftArrow = true;
  const showRightArrow = true;

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
  const heroNavInteractable = heroNavReveal >= 0.04;
  const navTextColor = navOnWhiteBar ? "#000" : "#fff";
  const navTextShadow = showNavShadow && isOnHero ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";
  const loginButtonBg = navOnWhiteBar ? "#000" : "#fff";
  const loginButtonText = navOnWhiteBar ? "#fff" : "#000";
  const loginButtonShadow = showNavShadow && isOnHero ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Scrubs with scroll (~3.6×); applied via `background-size` zoom instead of transform so layers stay crisp. */
  const desktopHeroBackdropZoom =
    prefersReducedMotion || isPhoneLayout ? 1 : 1 + desktopHeroZoomProgress * 3.65;
  const desktopHeroBackdropBgLayers = `radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
              radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%)`;
  const desktopHeroBackdropBgSizing = (() => {
    const pct = `${desktopHeroBackdropZoom * 100}% ${desktopHeroBackdropZoom * 100}%`;
    return `${pct}, ${pct}, ${pct}, ${pct}, ${pct}`;
  })();
  const desktopHeroForegroundOpacity = isPhoneLayout
    ? 1
    : Math.max(0, 1 - desktopHeroZoomProgress * 0.95);

  return (
    <div className="relative overflow-x-hidden" style={{ backgroundColor: '#F7F6F3' }}>
      {/* Hero — desktop: wheel-zoom backdrop while document scroll stays locked until zoom completes */}
      {/* z-[40]: stack above later sections (z-10) so fixed nav isn’t painted under carousel / gradients */}
      <div className="relative z-[40] min-h-screen overflow-hidden">
        <div
          className={
            isPhoneLayout
              ? "relative min-h-screen overflow-hidden"
              : "sticky top-0 z-0 flex min-h-[100dvh] h-[100dvh] overflow-hidden relative"
          }
        >
          {/* Zoomed gradient canvas — background-size zoom (not transform) keeps edges sharp. */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Hero with Gradient from Chart2 */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: desktopHeroBackdropBgLayers,
                  backgroundSize: desktopHeroBackdropBgSizing,
                  backgroundPosition: "center, center, center, center, center",
                  backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
                  filter: "saturate(1.15)",
                  ...(prefersReducedMotion || isPhoneLayout
                    ? {}
                    : desktopHeroZoomProgress > 0.02
                      ? { willChange: "background-size" }
                      : {}),
                }}
              >
                {/* Grain texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                    opacity: 1,
                    mixBlendMode: "overlay",
                  }}
                />
                {/* Center brightness reduction overlay — match gradient zoom so it stays aligned */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(0, 0, 0, 0.15) 0%, transparent 60%)",
                    backgroundSize: `${desktopHeroBackdropZoom * 100}% ${desktopHeroBackdropZoom * 100}%`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                {/* Grid lines overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="gridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path
                          d="M 0 0 L 80 0 M 0 0 L 0 80"
                          fill="none"
                          stroke="#999999"
                          strokeWidth="0.5"
                          opacity="0.15"
                        />
                        <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.25" />
                        <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.25" />
                        <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.25" />
                        <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.25" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridPattern)" />
                  </svg>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transform: "perspective(1200px) translateZ(-200px) rotateX(75deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <svg
                      className="absolute inset-0 pointer-events-none w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern id="gridPattern2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                          <path
                            d="M 0 0 L 80 0 M 0 0 L 0 80"
                            fill="none"
                            stroke="#999999"
                            strokeWidth="0.5"
                            opacity="0.15"
                          />
                          <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.25" />
                          <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.25" />
                          <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.25" />
                          <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.25" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#gridPattern2)" />
                    </svg>
                  </div>
                </div>
              </div>
          </div>
        {/* Navigation Bar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-[50] transition-opacity duration-300 ease-out ${
            !heroNavInteractable ? 'pointer-events-none' : ''
          }`}
          style={{ 
            opacity: DESKTOP_NAV_DROPDOWN_ENABLED && isDropdownOpen ? 1 : heroNavReveal,
            backgroundColor: 'transparent',
            borderBottom:
              navOnWhiteBar && (showBackgroundBox || isDropdownOpen) ? '1px solid #E6E6E6' : 'none',
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
          {/* Background box when close to second section */}
          {showBackgroundBox && !isDropdownOpen && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                backgroundColor: '#F7F6F3',
              }}
            />
          )}
          {/* Top bar — white bar only after hero */}
          <div className="relative z-10 flex items-center justify-between px-8 py-6">
            <h1
              className={`text-4xl font-normal transition-all duration-300 ${lora.className}`}
              style={{ color: navTextColor, textShadow: navTextShadow }}
            >
              Doe
            </h1>

            <div className="absolute left-1/2 flex max-w-[min(56rem,calc(100vw-11rem))] -translate-x-1/2 flex-wrap justify-center gap-x-5 gap-y-2 lg:gap-x-8">
              {DESKTOP_NAV_ITEMS.map((item) =>
                DESKTOP_NAV_DROPDOWN_ENABLED ? (
                <button
                    key={item.label}
                    type="button"
                    className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-[13.5px] font-medium leading-tight transition-all duration-300 hover:opacity-70"
                  style={{ color: navTextColor, textShadow: navTextShadow }}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                  >
                    {item.label}
                </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[13.5px] font-medium leading-tight no-underline transition-all duration-300 hover:opacity-70"
                    style={{ color: navTextColor, textShadow: navTextShadow }}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            <a
              href="#"
              className="rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:opacity-90"
              style={{
              backgroundColor: loginButtonBg,
              color: loginButtonText,
                boxShadow: loginButtonShadow,
              }}
            >
              Waitlist
            </a>
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
            <div className="mx-8 border-t border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />

            <div className="py-8">
              <div 
                className="max-w-[1400px] mx-auto px-8 flex"
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
            <div className="mx-8 border-b border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />
          </div>
          </>
        </nav>

        {/* Hero Header — centered Doe wordmark */}
        <div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: desktopHeroForegroundOpacity }}
        >
          <div className="mx-auto max-w-[900px] px-8 text-center">
            <h1
              className={`mb-6 font-normal leading-[0.88] tracking-tight text-white ${lora.className}`}
              style={{ fontSize: "clamp(4.5rem, 14vw, 10rem)" }}
            >
              Doe
            </h1>
            <p
              className={`mx-auto mb-8 max-w-[min(40rem,calc(100vw-4rem))] px-4 text-center text-lg font-medium leading-snug text-white/90 sm:text-xl ${inter.className}`}
            >
              We&apos;re building the AI
              <br />
              communication layer for healthcare.
            </p>
            <a
              href="#"
              className="inline-block rounded-md bg-white px-6 py-2.5 text-sm font-medium text-[#1a1a1a] no-underline transition-all duration-300 hover:opacity-90"
              style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </div>
      </div>

      {/* Horizontal line at bottom of hero section */}
      <div className="w-full border-t border-[#E6E6E6]" />

      {/* Second Section */}
      <div ref={secondSectionRef} className="relative z-10 min-h-[112vh]">
        <div className="relative flex min-h-[112vh] flex-col items-center justify-center py-24 md:py-28">
          {/* Title — extra padding before carousel on wide layout only */}
          <div
            className={`mt-20 w-full text-center ${isPhoneLayout ? "mb-5" : "mb-12 md:mb-16 lg:mb-20"}`}
          >
            <h1 
              className={`text-3xl sm:text-[2rem] font-normal text-gray-900 tracking-tight ${lora.className}`}
              style={{
                opacity: secondSectionTitleOpacity,
                transform: `translateY(${secondSectionTitleTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
            >
              Agents for every workflow.
            </h1>
          </div>
          
          {/* Sliding squares container — edge-to-edge */}
          <div 
            className="relative flex w-full max-w-[100vw] items-center justify-center" 
            style={{ 
              width: carouselViewportW,
              height: slideBoxH,
              opacity: slidingBoxesOpacity,
              transform: `translateY(${slidingBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
            }}
          >
            {/* Pause button - top right corner */}
            <button
              onClick={() => setIsSlidingPaused(!isSlidingPaused)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{
                opacity: slidingBoxesOpacity,
              }}
            >
              {isSlidingPaused ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* Navigation Arrows */}
            {showLeftArrow && (
              <button 
                className="absolute left-3 max-[639px]:left-2 z-20 transition-opacity duration-200 hover:opacity-70"
                onClick={handleSlideRight}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            {showRightArrow && (
              <button 
                className="absolute right-3 max-[639px]:right-2 z-20 transition-opacity duration-200 hover:opacity-70"
                onClick={handleSlideLeft}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
            
            {/* Sliding squares container - relative positioning for absolute children */}
            <div 
              className="relative w-full max-[639px]:rounded-2xl"
              style={{ 
                height: slideBoxH,
                overflow: 'hidden'
              }}
            >
            <WorkflowCarouselSlides
              slidingBoxRefs={slidingBoxRefs}
              slideBoxW={slideBoxW}
              slideBoxH={slideBoxH}
              slideUniformScale={slideUniformScale}
              scaledSide={scaledSide}
              captionLeft700={captionLeft700}
              captionRight700={captionRight700}
            />
            </div>
          </div>
        </div>
      </div>

      {/* /design — hero gradient + crosshatch (before Doe word carousel / billing) */}
      <DesignHeroBackdropSection
        className="relative z-10"
        overlay="dots"
        dotPatternCellPx={36}
        dotOverlayOpacity={0.45}
      />

      {/* Blank Section with Grid Lines */}
      <div ref={carouselSectionRef} className="h-screen w-full relative z-10 overflow-x-hidden" style={{
        opacity: carouselSectionOpacity,
        transform: `translateY(${carouselSectionTranslateY}px)`,
        transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
      }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={PATIENT_CARE_GREY_GRID_STYLE}
          aria-hidden
        />
        {/* Top fade overlay */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)'
          }}
        />
        {/* Bottom fade overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to top, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)'
          }}
        />
        {/* Left-aligned Title and Description */}
        <div className="absolute top-0 left-0 z-20 px-8 md:px-16 lg:px-24" style={{ overflow: 'visible', paddingTop: '40vh' }}>
          <div className="max-w-2xl">
            <h1 
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-8 max-w-[min(100%,52rem)] ${oldStandardTT.className}`}
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                position: 'relative',
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                rowGap: '0.15em',
                width: '100%',
              }}
            >
              Doe{'\u00A0'}
              {(() => {
                const words = [...CAROUSEL_CATEGORY_WORDS];
                const n = words.length;
                const offsets = [-3, -2, -1, 0, 1, 2, 3];

                const getOpacity = (offset: number) => {
                  const abs = Math.abs(offset);
                  if (abs === 0) return 1;
                  if (abs === 1) return 0.3;
                  if (abs === 2) return 0.2;
                  return 0;
                };

                /** Keeps ↑↓ anchored — reserve width for widest phrase */
                const longestWord = CAROUSEL_CATEGORY_WORD_WIDTH_ANCHOR;

                const arrowButtons = (
                  <div
                    className="pointer-events-auto absolute z-[3] flex flex-col gap-2"
                    style={{
                      left: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      marginLeft: "clamp(14px, 1.75vw, 28px)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isCarouselTransitioning) return;
                        setIsCarouselTransitioning(true);
                        requestAnimationFrame(() => {
                          setUiMockupOpacity(0);
                          setUiMockupTranslateY(10);
                          setUiMockupScale(0.96);
                        });
                        setCarouselOffset(1);
                        setTimeout(() => {
                          const newIndex = (selectedWordIndex - 1 + n) % n;
                          setSelectedWordIndex(newIndex);
                          setCarouselOffset(0);
                          requestAnimationFrame(() => {
                            setUiMockupOpacity(1);
                            setUiMockupTranslateY(0);
                            setUiMockupScale(1);
                          });
                          setTimeout(() => {
                            setIsCarouselTransitioning(false);
                          }, 50);
                        }, 400);
                      }}
                      className="p-1 transition-opacity hover:opacity-70"
                      aria-label="Previous category"
                    >
                      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (isCarouselTransitioning) return;
                        setIsCarouselTransitioning(true);
                        requestAnimationFrame(() => {
                          setUiMockupOpacity(0);
                          setUiMockupTranslateY(10);
                          setUiMockupScale(0.96);
                        });
                        setCarouselOffset(-1);
                        setTimeout(() => {
                          const newIndex = (selectedWordIndex + 1) % n;
                          setSelectedWordIndex(newIndex);
                          setCarouselOffset(0);
                          requestAnimationFrame(() => {
                            setUiMockupOpacity(1);
                            setUiMockupTranslateY(0);
                            setUiMockupScale(1);
                          });
                          setTimeout(() => {
                            setIsCarouselTransitioning(false);
                          }, 50);
                        }, 400);
                      }}
                      className="p-1 transition-opacity hover:opacity-70"
                      aria-label="Next category"
                    >
                      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                );

                return (
                  <span
                    className={inter.className}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      verticalAlign: "baseline",
                      marginLeft: "0.15em",
                      fontWeight: 300,
                      fontSize: "0.9em",
                    }}
                  >
                      {/* Invisible sizer — always longest word so layout / arrows stay fixed */}
                      <span style={{ opacity: 0, whiteSpace: "nowrap", display: "inline-block", lineHeight: "1.2em", pointerEvents: "none" }}>
                        {longestWord}
                      </span>
                      {/* Single sliding strip — all words move together */}
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: `translateY(${carouselOffset * 1.2}em)`,
                          transition: isCarouselTransitioning && carouselOffset !== 0 ? "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
                        }}
                      >
                        {offsets.map((offset) => {
                          const wordIdx = ((selectedWordIndex + offset) % n + n) % n;
                          return (
                            <span
                              key={offset}
                              style={{
                                position: "absolute",
                                top: `${offset * 1.2}em`,
                                left: 0,
                                whiteSpace: "nowrap",
                                lineHeight: "1.2em",
                                opacity: getOpacity(offset),
                                color: offset === 0 ? "#111827" : "#6B7280",
                              }}
                            >
                              {words[wordIdx]}
                            </span>
                          );
                        })}
                      </span>
                      {/* Fixed fade overlays — stationary, words slide through them */}
                      <span
                        style={{
                          position: "absolute",
                          top: "-4.8em",
                          left: "-2em",
                          right: "-2em",
                          height: "4.8em",
                          background: "linear-gradient(to bottom, rgba(247,246,243,1) 0%, rgba(247,246,243,0) 100%)",
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-4.8em",
                          left: "-2em",
                          right: "-2em",
                          height: "4.8em",
                          background: "linear-gradient(to top, rgba(247,246,243,1) 0%, rgba(247,246,243,0) 100%)",
                          pointerEvents: "none",
                        }}
                      />
                    {arrowButtons}
                  </span>
                );
              })()}
            </h1>
          </div>
        </div>
        {/* Description - bottom right corner of left half */}
        {(() => {
          const descriptions = [
            [
              "One inbox for fax, portal, email, and secure chat together",
              "AI triage, drafts, and next-step prompts live on every thread",
              "So clinical communication stops hiding in screenshots",
            ],
            [
              "Embedded agents execute follow-ups inside that same inbox",
              "They update charts, chase documents, and queue orders with citations",
              "You skim approvals instead of babysitting checkbox farms",
            ],
            [
              "Ambient listening pulls relevant history while patients speak",
              "Adds guideline snapshots and sourced web context in real time",
              "Keeps citations tethered so notes stay defensible later",
            ],
            [
              "Voice AI answers inbound calls when reception is slammed",
              "Requests become structured entries that drop straight into the EMR",
              "Humans stay one escalation away when empathy matters",
            ],
            [
              "Incoming labs sort themselves by urgency and completeness",
              "Each tray opens with an AI synopsis tied to deltas you care about",
              "You verify once—documentation propagates cleanly afterward",
            ],
            [
              "Outgoing referrals draft from the encounter with attachments bundled",
              "Inbound packets parse so specialty narrative isn't buried",
              "Doe pings both clinics until someone's booked or declines",
            ],
            [
              "Branded mobile surface keeps patients tethered between visits",
              "After-visit summaries and teaching moments arrive before recall fades",
              "Pre-appointment forms finish before they reach your lobby",
            ],
            [
              "Clinic templates and personal commitments share one truthful calendar",
              "Swap requests weigh coverage against OR blocks and life obligations",
              "Double-books surface before invitations hit the patient inbox",
            ],
            [
              "Prior-auth packets assemble with justification grounded in chart facts",
              "Claims scrub against payer quirks before they leave your queue",
              "Collections narratives summarize what's collectible versus goodwill",
            ],
          ];
          const lines = descriptions[selectedWordIndex] ?? descriptions[0];
          return (
            <div
              className="absolute bottom-[10vh] left-0 right-1/2 z-20 px-8 text-right md:px-16 lg:px-24"
              style={{ paddingRight: "clamp(1rem, 4vw, 2.75rem)" }}
            >
              <div
                key={selectedWordIndex}
                className={`text-lg text-gray-700 md:text-xl ${inter.className}`}
                style={{ fontWeight: 500, animation: "fade-in 0.35s ease-out" }}
              >
                {lines.map((line, i) => (
                  <p key={i} className="text-right">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })()}
        {/* Orange rounded box - right half of section, left half of box visible */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 z-30"
          style={{
            width: '100vw',
            height: '80vh',
            background: `radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)`,
            borderRadius: '16px',
            left: '50vw',
          }}
        >
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '16px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              opacity: 1,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Circular grid pattern overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '16px' }}>
            <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
              {/* Radial lines */}
              {Array.from({ length: 8 }, (_, j) => {
                const angle = (j * 45);
                const radius = 500;
                return (
                  <path
                    key={`radial-${j}`}
                    d={`M 500 500 L ${500 + Math.cos(angle * Math.PI / 180) * radius} ${500 + Math.sin(angle * Math.PI / 180) * radius}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}
              {/* Concentric circles */}
              {Array.from({ length: 6 }, (_, j) => {
                const r = (j + 1) * 150;
                return (
                  <circle
                    key={`circle-${j}`}
                    cx="500"
                    cy="500"
                    r={r}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>
          </div>

          {/* App UI Mockup - Dynamic based on selected word */}
          {(() => {
            const renderUIMockup = () => {
              const words = [...CAROUSEL_CATEGORY_WORDS];
              const currentWord = words[selectedWordIndex];

              // Common sidebar
              const Sidebar = () => (
                <div style={{
                  width: '48px',
                  background: '#1E343A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '14px 0',
                  gap: '4px',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: '#D49D4F', marginBottom: 14 }} />
                  {[true, false, false, false, false, false].map((active, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 13, height: 13, borderRadius: 3,
                        background: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)',
                      }} />
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                </div>
              );

              // Agent UI — automation / assistant workflows
              if (currentWord === 'Agent') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 90, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ flex: 1, height: 56, borderRadius: 10, background: '#1E343A', padding: '10px 12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.25)', marginBottom: 6 }} />
                            <div style={{ width: '30%', height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.45)' }} />
                          </div>
                          <div style={{ flex: 1, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '10px 12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 6 }} />
                            <div style={{ width: '30%', height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.50)' }} />
                          </div>
                        </div>
                        {['Auto-scheduled', 'Running now', 'Queued'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#BEBEBE', width: `${65 - i * 8}%` }} />
                            <div style={{ width: 28, height: 14, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Front Desk UI — intake / reception
              if (currentWord === 'Front Desk') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 100, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ height: 48, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px 10px', opacity: i === 1 ? 1 : i === 2 ? 0.7 : i === 3 ? 0.45 : 0.25 }}>
                              <div style={{ width: '60%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 6 }} />
                              <div style={{ width: '40%', height: 3, borderRadius: 3, background: '#DCDCDC' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '10px 12px' }}>
                          <div style={{ width: '70%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 8 }} />
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 32, borderRadius: 6, background: '#F0F0F0' }} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Ambient UI — passive capture / calm chrome
              if (currentWord === 'Ambient') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 75, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ height: 80, borderRadius: 12, background: '#ffffff', border: '1px solid #E6E6E6', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                          <div style={{ width: '65%', height: 5, borderRadius: 3, background: '#1E343A', margin: '0 auto' }} />
                          <div style={{ width: '45%', height: 4, borderRadius: 3, background: '#C8C8C8', margin: '0 auto' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{ flex: 1, height: 60, borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px', opacity: i === 1 ? 1 : i === 2 ? 0.6 : 0.35 }}>
                              <div style={{ width: '70%', height: 4, borderRadius: 3, background: '#DCDCDC', marginBottom: 6 }} />
                              <div style={{ width: '50%', height: 3, borderRadius: 3, background: '#EBEBEB' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1, borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6', padding: '10px' }}>
                          <div style={{ width: '55%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 8 }} />
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} style={{ height: 24, borderRadius: 5, background: '#F0F0F0' }} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Schedule UI — unified calendars
              if (currentWord === "Schedule") {
                return (
                  <div style={{ display: "flex", width: "100%", height: "100%" }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F6F3" }}>
                      <div
                        style={{
                          height: 40,
                          borderBottom: "1px solid #E6E6E6",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 14px",
                          gap: 8,
                        }}
                      >
                        <div style={{ width: 88, height: 6, borderRadius: 3, background: "#D4D4D4" }} />
                        <div style={{ flex: 1 }} />
                        <div style={{ width: 52, height: 22, borderRadius: 6, background: "#E6EFF0" }} />
                      </div>
                      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: 28,
                                borderRadius: 8,
                                background: "#ffffff",
                                border: "1px solid #E6E6E6",
                                opacity: i === 3 ? 1 : 0.35 + i * 0.06,
                              }}
                            />
                          ))}
                        </div>
                        {[0, 1, 2].map((row) => (
                          <div key={row} style={{ display: "flex", gap: 6, flex: 1, minHeight: 0 }}>
                            {[1, 2, 3, 4, 5].map((col) => (
                              <div
                                key={col}
                                style={{
                                  flex: 1,
                                  borderRadius: 8,
                                  background: row === 1 && col === 3 ? "#1E343A" : "#ffffff",
                                  border: row === 1 && col === 3 ? "none" : "1px solid #E6E6E6",
                                  opacity: row === 1 && col === 3 ? 1 : 0.28 + row * 0.12 + col * 0.03,
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Billing UI - Claims and revenue
              if (currentWord === 'Billing') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 85, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ flex: 1, height: 70, borderRadius: 10, background: '#1E343A', padding: '12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.25)', marginBottom: 8 }} />
                            <div style={{ width: '35%', height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.45)' }} />
                          </div>
                          <div style={{ flex: 1, height: 70, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 8 }} />
                            <div style={{ width: '35%', height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.50)' }} />
                          </div>
                        </div>
                        {['Claim #2847', 'Claim #1923', 'Claim #4521'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 50, height: 4, borderRadius: 3, background: '#BEBEBE' }} />
                            <div style={{ flex: 1, height: 4, borderRadius: 3, background: '#D8D8D8', width: `${55 - i * 8}%` }} />
                            <div style={{ width: 35, height: 16, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Referrals UI — outbound coordination / campaigns-adjacent
              if (currentWord === 'Referrals') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 95, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ height: 100, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ width: '60%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 8, margin: '0 auto 8px' }} />
                          <div style={{ width: '45%', height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.50)', margin: '0 auto' }} />
                        </div>
                        {['Active campaign', 'Scheduled', 'Draft'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#BEBEBE', width: `${60 - i * 7}%` }} />
                            <div style={{ width: 45, height: 16, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Patient UI - Profile and history
              if (currentWord === 'Patient') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8E8E8' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ width: '45%', height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 6 }} />
                            <div style={{ width: '65%', height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[1, 2].map(i => (
                            <div key={i} style={{ height: 48, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px 10px', opacity: i === 1 ? 1 : 0.6 }}>
                              <div style={{ width: '55%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 6 }} />
                              <div style={{ width: '40%', height: 3, borderRadius: 3, background: '#DCDCDC' }} />
                            </div>
                          ))}
                        </div>
                        {['Last visit', 'Medications', 'Allergies'].map((label, i) => (
                          <div key={i} style={{ padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: `${50 - i * 5}%`, height: 4, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                            <div style={{ width: `${70 - i * 5}%`, height: 3, borderRadius: 3, background: '#D8D8D8' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Labs UI — orders / results lane
              if (currentWord === 'Labs') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 70, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8E8E8', opacity: i === 1 ? 1 : i === 2 ? 0.7 : i === 3 ? 0.45 : 0.25 }} />)}
                        </div>
                        {['Task assigned', 'Note added', 'Status updated'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#E8E8E8' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ width: `${58 - i * 7}%`, height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                              <div style={{ width: `${75 - i * 5}%`, height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Inbox UI - Messages
              if (currentWord === 'Inbox') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 65, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                        <div style={{ flex: 1 }} />
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E6EFF0' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['New message', 'Follow-up', 'Appointment', 'Lab results'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.65 : i === 2 ? 0.4 : 0.2 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ width: `${55 - i * 6}%`, height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                              <div style={{ width: `${72 - i * 4}%`, height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                            </div>
                            <div style={{ width: 24, height: 14, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Default fallback
              return null;
            };

            return (
              <div
                key={selectedWordIndex}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, calc(-50% + ${uiMockupTranslateY}px)) scale(${uiMockupScale})`,
                  width: '58%',
                  height: '70%',
                  borderRadius: '16px',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  opacity: uiMockupOpacity,
                  transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: isCarouselTransitioning ? 'opacity, transform' : 'auto',
                }}
              >
                {renderUIMockup()}
              </div>
            );
          })()}
        </div>
      </div>

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
          <div className="mx-auto max-w-[1800px] px-8 pb-24 pt-16">
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
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-8 pb-8">
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
            <div className="max-w-[1400px] mx-auto px-8 w-full flex items-center justify-between relative z-10">
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
