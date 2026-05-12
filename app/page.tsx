"use client";

import { Lora, Old_Standard_TT, Inter } from "next/font/google";
import { useState, useEffect, useLayoutEffect, useRef, type HTMLAttributes } from "react";

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

const NAV_ITEMS = ["Features", "Security", "Students", "Company"] as const;

const PHONE_LAYOUT_MEDIA =
  "(max-width: 480px), ((max-height: 500px) and (min-width: 500px) and (pointer: coarse))";

const LAYOUT_FORCE_MOBILE_KEY = "doeforvc-force-mobile";
const LAYOUT_FORCE_DESKTOP_KEY = "doeforvc-force-desktop";

function readLayoutOverrideFlags(): { forceMobile: boolean; forceDesktop: boolean } {
  if (typeof window === "undefined") return { forceMobile: false, forceDesktop: false };
  try {
    return {
      forceMobile: sessionStorage.getItem(LAYOUT_FORCE_MOBILE_KEY) === "1",
      forceDesktop: sessionStorage.getItem(LAYOUT_FORCE_DESKTOP_KEY) === "1",
    };
  } catch {
    return { forceMobile: false, forceDesktop: false };
  }
}

/** Natural phone detection + optional session overrides (preview on desktop / desktop site on iPhone). */
function computeIsPhoneLayout(): boolean {
  const { forceMobile, forceDesktop } = readLayoutOverrideFlags();
  const isIPhone = /iPhone/.test(navigator.userAgent || "");
  const narrow = window.matchMedia(PHONE_LAYOUT_MEDIA).matches;
  const naturalPhone = isIPhone || narrow;
  return forceMobile || (!forceDesktop && naturalPhone);
}

function persistLayoutClick(isPhoneLayoutNow: boolean) {
  const isIPhone = /iPhone/.test(navigator.userAgent || "");
  const naturalPhone = isIPhone || window.matchMedia(PHONE_LAYOUT_MEDIA).matches;
  try {
    if (isPhoneLayoutNow) {
      if (naturalPhone) {
        sessionStorage.setItem(LAYOUT_FORCE_DESKTOP_KEY, "1");
        sessionStorage.removeItem(LAYOUT_FORCE_MOBILE_KEY);
      } else {
        sessionStorage.removeItem(LAYOUT_FORCE_MOBILE_KEY);
        sessionStorage.removeItem(LAYOUT_FORCE_DESKTOP_KEY);
      }
    } else {
      sessionStorage.setItem(LAYOUT_FORCE_MOBILE_KEY, "1");
      sessionStorage.removeItem(LAYOUT_FORCE_DESKTOP_KEY);
    }
  } catch {
    /* private / restricted storage */
  }
}

/** Pro Max / Plus (~430–456 CSS px short edge) otherwise get a higher `zoom` and read oversized; cap basis ~ standard iPhone width. */
const IPHONE_ZOOM_SHORT_EDGE_CAP = 404;
const IPHONE_ZOOM_DESIGN_WIDTH = 820;

/** Keep <html data-layout> in sync with Tailwind layout-phone / layout-desktop variants. */
function setDocumentLayout(phone: boolean) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-layout", phone ? "phone" : "desktop");
  }
}

/** Bottom title pill + description inside 700×700 slide mocks (scales with card transform). */
/** Position (left/right) is applied via inline style — computed from slide scale so captions
 *  are always inside the visible card area even on portrait-phone where the inner 700px div overflows. */
const slideCaptionWrap =
  "absolute bottom-9 z-[5] flex flex-col items-start gap-2.5 pointer-events-auto layout-phone:bottom-11";
const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[14px] py-[7px] text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
const slideCaptionBody =
  "w-full min-w-0 max-w-[min(340px,calc(100%-4px))] text-left text-[15px] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92] break-words [overflow-wrap:anywhere]";
const slideCaptionFont = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;

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

export default function DoePage() {
  const [gradientAngle, setGradientAngle] = useState(135);
  const [colorShift, setColorShift] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [expandedBentoBox, setExpandedBentoBox] = useState<number | null>(null);
  const [hoveredBentoBox, setHoveredBentoBox] = useState<number | null>(null);
  const [hoveredBuildBox, setHoveredBuildBox] = useState<number | null>(null);
  const [hoveredKnowsBox, setHoveredKnowsBox] = useState<number | null>(null);
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
  /** Full fixed `<nav>` box (includes safe-area padding) — menu sheet `top` aligns to its bottom. */
  const navBarRowRef = useRef<HTMLElement>(null);
  const [iphoneMenuTopPx, setIphoneMenuTopPx] = useState(88);
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
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const [featuresTitleOpacity, setFeaturesTitleOpacity] = useState(0);
  const [featuresTitleTranslateY, setFeaturesTitleTranslateY] = useState(40);
  const [featuresBoxesOpacity, setFeaturesBoxesOpacity] = useState(0);
  const [featuresBoxesTranslateY, setFeaturesBoxesTranslateY] = useState(40);
  const newGradientSectionRef = useRef<HTMLDivElement>(null);
  const [newGradientSectionOpacity, setNewGradientSectionOpacity] = useState(0);
  const [newGradientSectionTranslateY, setNewGradientSectionTranslateY] = useState(40);
  const [newGradientTitleOpacity, setNewGradientTitleOpacity] = useState(0);
  const [newGradientTitleTranslateY, setNewGradientTitleTranslateY] = useState(40);
  const knowsSectionRef = useRef<HTMLDivElement>(null);
  const [knowsTitleOpacity, setKnowsTitleOpacity] = useState(0);
  const [knowsTitleTranslateY, setKnowsTitleTranslateY] = useState(40);
  const [knowsBoxesOpacity, setKnowsBoxesOpacity] = useState(0);
  const [knowsBoxesTranslateY, setKnowsBoxesTranslateY] = useState(40);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Calls' | 'Workflow'>('Inbox');
  const [hoveredDecisionCard, setHoveredDecisionCard] = useState<'context' | 'timeline' | 'decision' | null>(null);
  const [selectedReportBox, setSelectedReportBox] = useState<number | null>(null);
  const [box2Title, setBox2Title] = useState('Report Results');
  const [box2Description, setBox2Description] = useState(
    'Stack imaging and labs in one view. Verify findings and route follow-ups without switching systems.'
  );
  const [isEditingBox2Title, setIsEditingBox2Title] = useState(false);
  const [isEditingBox2Description, setIsEditingBox2Description] = useState(false);
  // Default positions - loaded from JSON file, updated when saved
  const [reportBoxPositions, setReportBoxPositions] = useState<Array<{ x: number; y: number }>>([
    { x: -85, y: -95 }, // First box initial position
    { x: 76, y: 79 }     // Second box initial position (relative to first)
  ]);
  const [positionHistory, setPositionHistory] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragBoxIndex, setDragBoxIndex] = useState<number | null>(null);
  const [wasDragging, setWasDragging] = useState(false);
  const initialBoxPositionRef = useRef<{ x: number; y: number } | null>(null);
  const latestPositionsRef = useRef<Array<{ x: number; y: number }>>(reportBoxPositions);
  const descriptionEditRef = useRef<HTMLTextAreaElement | null>(null);
  const buildSectionRef = useRef<HTMLDivElement>(null);
  const [buildTitleOpacity, setBuildTitleOpacity] = useState(0);
  const [buildTitleTranslateY, setBuildTitleTranslateY] = useState(40);
  const [buildBoxesOpacity, setBuildBoxesOpacity] = useState(0);
  const [buildBoxesTranslateY, setBuildBoxesTranslateY] = useState(40);

  /** Narrow phone layout (iPhone-sized); desktop keeps zoom at 1. */
  const [isPhoneLayout, setIsPhoneLayout] = useState(false);
  const [iphoneZoom, setIphoneZoom] = useState(1);
  /** Sliding cards on phone: logical px inside zoomed root (= visible px ÷ iphoneZoom). */
  const [phoneSlideSize, setPhoneSlideSize] = useState({ w: 850, h: 1090 });

  const syncLayoutRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const phoneMql = window.matchMedia(PHONE_LAYOUT_MEDIA);
    const updateLayout = () => {
      const phone = computeIsPhoneLayout();
      setIsPhoneLayout(phone);
      setDocumentLayout(phone);
      if (phone) {
        const vv = window.visualViewport;
        const shortEdge = vv
          ? Math.min(vv.width, vv.height)
          : Math.min(window.innerWidth, window.innerHeight);
        const zoomEdge = Math.min(shortEdge, IPHONE_ZOOM_SHORT_EDGE_CAP);
        setIphoneZoom(
          Math.min(1, Math.max(0.38, (zoomEdge - 16) / IPHONE_ZOOM_DESIGN_WIDTH))
        );
      } else {
        setIphoneZoom(1);
      }
    };
    syncLayoutRef.current = updateLayout;
    updateLayout();
    phoneMql.addEventListener("change", updateLayout);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    const vvLayout = window.visualViewport;
    vvLayout?.addEventListener("resize", updateLayout);
    return () => {
      phoneMql.removeEventListener("change", updateLayout);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
      vvLayout?.removeEventListener("resize", updateLayout);
    };
  }, []);

  useEffect(() => {
    if (!isPhoneLayout) return;
    const measure = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      /** Use iphoneZoom — logical px inside zoomed root. */
      // Prevent division by zero, use zoom if available
      const zoom = iphoneZoom > 0 ? iphoneZoom : 0.45;
      /** Inset so cards read slightly smaller than full viewport */
      const horizontalInset = 12;
      /** Slide width from viewport; height taller than width for portrait cards */
      const phoneSlideScale = 0.96;
      const w = ((vw - horizontalInset * 2) / zoom) * phoneSlideScale;
      /** Taller than wide — extra vertical presence in the carousel band */
      const phoneSlideHeightRatio = 1.28;
      const h = w * phoneSlideHeightRatio;
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
  }, [isPhoneLayout, iphoneZoom]);

  useEffect(() => {
    if (!isPhoneLayout) return;
    setActiveDropdown(null);
  }, [isPhoneLayout]);

  useEffect(() => {
    if (!isPhoneLayout) return;
    setIsEditingBox2Title(false);
    setIsEditingBox2Description(false);
    setSelectedReportBox(null);
  }, [isPhoneLayout]);

  useLayoutEffect(() => {
    if (!isPhoneLayout) return;
    const el = navBarRowRef.current;
    if (!el) return;
    const update = () => {
      setIphoneMenuTopPx(Math.ceil(el.getBoundingClientRect().bottom));
    };
    update();
    let raf1 = 0;
    let raf2 = 0;
    if (mobileNavOpen) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(update);
      });
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [isPhoneLayout, mobileNavOpen]);

  useEffect(() => {
    if (!isPhoneLayout) setMobileNavOpen(false);
  }, [isPhoneLayout]);

  useEffect(() => {
    if (!isPhoneLayout || !mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isPhoneLayout, mobileNavOpen]);

  useEffect(() => {
    if (!isPhoneLayout || !mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPhoneLayout, mobileNavOpen]);

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
      
      // Calculate features section (Features built with you in mind) fade-in and slide-up animation
      if (featuresSectionRef.current) {
        const rect = featuresSectionRef.current.getBoundingClientRect();
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
          setFeaturesTitleOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setFeaturesTitleTranslateY(40 * (1 - clampedProgress));
          
          // Features boxes animation starts after title animation (at 60% progress)
          // Features boxes animation range: 60% to 100% of title animation progress
          if (clampedProgress >= 0.6) {
            const featuresBoxesProgress = (clampedProgress - 0.6) / 0.4; // 0 to 1 when title is 60% to 100%
            const clampedBoxesProgress = Math.min(Math.max(featuresBoxesProgress, 0), 1);
            
            setFeaturesBoxesOpacity(clampedBoxesProgress);
            setFeaturesBoxesTranslateY(40 * (1 - clampedBoxesProgress));
          } else {
            setFeaturesBoxesOpacity(0);
            setFeaturesBoxesTranslateY(40);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setFeaturesTitleOpacity(1);
          setFeaturesTitleTranslateY(0);
          setFeaturesBoxesOpacity(1);
          setFeaturesBoxesTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setFeaturesTitleOpacity(0);
          setFeaturesTitleTranslateY(40);
          setFeaturesBoxesOpacity(0);
          setFeaturesBoxesTranslateY(40);
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
      
      // Calculate knows section (Knows you before you know you) fade-in and slide-up animation
      if (knowsSectionRef.current) {
        const rect = knowsSectionRef.current.getBoundingClientRect();
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
          setKnowsTitleOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setKnowsTitleTranslateY(40 * (1 - clampedProgress));
          
          // Knows boxes animation starts after title animation (at 60% progress)
          // Knows boxes animation range: 60% to 100% of title animation progress
          if (clampedProgress >= 0.6) {
            const knowsBoxesProgress = (clampedProgress - 0.6) / 0.4; // 0 to 1 when title is 60% to 100%
            const clampedBoxesProgress = Math.min(Math.max(knowsBoxesProgress, 0), 1);
            
            setKnowsBoxesOpacity(clampedBoxesProgress);
            setKnowsBoxesTranslateY(40 * (1 - clampedBoxesProgress));
          } else {
            setKnowsBoxesOpacity(0);
            setKnowsBoxesTranslateY(40);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setKnowsTitleOpacity(1);
          setKnowsTitleTranslateY(0);
          setKnowsBoxesOpacity(1);
          setKnowsBoxesTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setKnowsTitleOpacity(0);
          setKnowsTitleTranslateY(40);
          setKnowsBoxesOpacity(0);
          setKnowsBoxesTranslateY(40);
        }
      }
      
      // Calculate build section (Build with us) fade-in and slide-up animation
      if (buildSectionRef.current) {
        const rect = buildSectionRef.current.getBoundingClientRect();
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
          setBuildTitleOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setBuildTitleTranslateY(40 * (1 - clampedProgress));
          
          // Build boxes animation starts after title animation (at 60% progress)
          // Build boxes animation range: 60% to 100% of title animation progress
          if (clampedProgress >= 0.6) {
            const buildBoxesProgress = (clampedProgress - 0.6) / 0.4; // 0 to 1 when title is 60% to 100%
            const clampedBoxesProgress = Math.min(Math.max(buildBoxesProgress, 0), 1);
            
            setBuildBoxesOpacity(clampedBoxesProgress);
            setBuildBoxesTranslateY(40 * (1 - clampedBoxesProgress));
          } else {
            setBuildBoxesOpacity(0);
            setBuildBoxesTranslateY(40);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setBuildTitleOpacity(1);
          setBuildTitleTranslateY(0);
          setBuildBoxesOpacity(1);
          setBuildBoxesTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide using optimized requestAnimationFrame with hardware acceleration
  useEffect(() => {
    // Only start sliding animation after title animation completes
    if (!shouldStartSlidingAnimation) return;
    
    const boxWidth = isPhoneLayout ? phoneSlideSize.w : 760;
    const boxGap = isPhoneLayout ? 12 : 32;
    const boxTotalWidth = boxWidth + boxGap;
    const totalBoxes = 6;
    const totalWidth = totalBoxes * boxTotalWidth; // Total width of all boxes
    
    let animationFrameId: number;
    let lastTime = performance.now();
    const slideSpeed = 0.05; // pixels per millisecond
    let lastStateUpdate = 0;
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 16.67); // Cap at 60fps
      lastTime = currentTime;
      
      if (!isManualScroll && !isSlidingPaused) {
        // Let position grow positively forever (no reset)
        autoScrollPositionRef.current += slideSpeed * deltaTime;
        
        // Calculate modular offset (ensures positive value)
        const offset = ((autoScrollPositionRef.current % totalWidth) + totalWidth) % totalWidth;
        
        // Position each box individually using modular arithmetic
        slidingBoxRefs.forEach((boxRef, i) => {
          if (!boxRef.current) return;
          
          // Base position: i * boxTotalWidth, then subtract offset
          let pos = i * boxTotalWidth - offset;
          
          // If box exits to the left, teleport it to the right seamlessly
          if (pos < -boxTotalWidth) {
            pos += totalWidth;
          }
          
          // Use transform3d for hardware acceleration
          boxRef.current.style.transform = `translate3d(${pos}px, 0, 0)`;
          boxRef.current.style.willChange = 'transform';
        });
        
        // Only update state occasionally for arrow visibility (every ~100ms)
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
  }, [isManualScroll, shouldStartSlidingAnimation, isSlidingPaused, isPhoneLayout, phoneSlideSize.w, phoneSlideSize.h]);

  // Initialize box positions when animation starts
  useEffect(() => {
    if (!shouldStartSlidingAnimation) return;
    
    const boxWidth = isPhoneLayout ? phoneSlideSize.w : 760;
    const boxGap = isPhoneLayout ? 12 : 32;
    const boxTotalWidth = boxWidth + boxGap;
    
    // Set initial positions for all boxes
    slidingBoxRefs.forEach((boxRef, i) => {
      if (boxRef.current) {
        const initialPos = i * boxTotalWidth;
        boxRef.current.style.transform = `translate3d(${initialPos}px, 0, 0)`;
      }
    });
  }, [shouldStartSlidingAnimation, isPhoneLayout, phoneSlideSize.w, phoneSlideSize.h]);

  useEffect(() => {
    // Add bento expand and sliding animation styles
    const style = document.createElement('style');
    const boxWidth = 700;
    const boxGap = 32;
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

  // Sliding box scroll functions — card step uses portrait dimensions on iPhone
  const slideBoxW = isPhoneLayout ? phoneSlideSize.w : 760;
  const slideBoxH = isPhoneLayout ? phoneSlideSize.h : 760;
  const slideGap = isPhoneLayout ? 12 : 32;
  const carouselSlideCount = 6;
  /** Uniform scale only — use max(...) so the 700² design covers the portrait slot (no stretch). */
  const slideUniformScale = Math.max(slideBoxW / 700, slideBoxH / 700);
  const scaledSide = 700 * slideUniformScale;
  const boxTotalWidth = slideBoxW + slideGap;
  const totalBoxes = carouselSlideCount;
  /**
   * The inner 700×700 design div is centred inside each card with `overflow:hidden`.
   * On portrait-phone the scaled height > card width, so the left/right edges of the
   * 700px space extend OUTSIDE the visible card.  We compute the minimum left/right
   * offset (in 700px coordinates) needed to stay inside the visible card area, then
   * add a small margin so the text isn't flush against the edge.
   */
  const xStart700 = (slideBoxW - scaledSide) / 2; // negative when card is narrower than scaled content
  const visibleMargin = 22; // desired gap (in card pixels) between card edge and caption
  const captionLeft700 = Math.ceil((visibleMargin - xStart700) / slideUniformScale);
  const captionRight700 = captionLeft700; // symmetric
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

    // Move every box left by exactly one step from its current rendered position.
    // Reading the actual transform avoids modular-arithmetic jumps when the
    // offset wraps around (e.g. offset 2928 → 0).
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
      // Silently snap to canonical (wrapped) positions now that boxes are off-screen.
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

  // Drag and drop handlers for report boxes
  const handleBoxMouseDown = (e: React.MouseEvent, boxIndex: number) => {
    if (isPhoneLayout) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragBoxIndex(boxIndex);
    setDragStart({ x: e.clientX, y: e.clientY });
    setSelectedReportBox(boxIndex);
    
    // Store initial position for this drag session
    initialBoxPositionRef.current = { ...reportBoxPositions[boxIndex] };
    
    // Save current state to history before dragging
    setPositionHistory(prev => [...prev, JSON.parse(JSON.stringify(reportBoxPositions))]);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || dragBoxIndex === null || !dragStart || !initialBoxPositionRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setReportBoxPositions(prev => {
        const newPositions = [...prev];
        if (dragBoxIndex === 0) {
          // First box: update its position directly
          newPositions[0] = {
            x: initialBoxPositionRef.current!.x + deltaX,
            y: initialBoxPositionRef.current!.y + deltaY
          };
        } else {
          // Second box: update relative to first box
          newPositions[1] = {
            x: initialBoxPositionRef.current!.x + deltaX,
            y: initialBoxPositionRef.current!.y + deltaY
          };
        }
        // Update ref with latest positions
        latestPositionsRef.current = newPositions;
        return newPositions;
      });
    };

    const handleMouseUp = () => {
      const hadDrag = isDragging;
      setIsDragging(false);
      setDragBoxIndex(null);
      setDragStart(null);
      initialBoxPositionRef.current = null;
      
      // Note: Auto-save removed - positions only save when user clicks Save button
      // This ensures the codebase is only updated intentionally
      
      // Prevent click event immediately after drag
      if (hadDrag) {
        setWasDragging(true);
        setTimeout(() => setWasDragging(false), 100);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragBoxIndex, dragStart]);

  // Load positions, history, and box 2 text from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/save-box-positions');
        const data = await response.json();
        if (data.positions) {
          setReportBoxPositions(data.positions);
          latestPositionsRef.current = data.positions;
        }
        if (data.history) {
          setPositionHistory(data.history);
        }
        if (data.box2Title) {
          setBox2Title(data.box2Title);
        }
        if (data.box2Description) {
          setBox2Description(data.box2Description);
        }
      } catch (e) {
        console.error('Failed to load data from API:', e);
      }
    };
    loadData();
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    latestPositionsRef.current = reportBoxPositions;
  }, [reportBoxPositions]);

  // Update textarea when editing starts
  useEffect(() => {
    if (isEditingBox2Description && descriptionEditRef.current) {
      descriptionEditRef.current.value = box2Description;
      // Set cursor to end
      setTimeout(() => {
        if (descriptionEditRef.current) {
          descriptionEditRef.current.setSelectionRange(
            descriptionEditRef.current.value.length,
            descriptionEditRef.current.value.length
          );
        }
      }, 0);
    }
  }, [isEditingBox2Description, box2Description]);

  // Save function - saves positions, title, and description to codebase via API
  const handleSave = async () => {
    try {
      // Update history
      const newHistory = [...positionHistory, JSON.parse(JSON.stringify(reportBoxPositions))];
      const historyToSave = newHistory.slice(-10); // Keep last 10 states
      setPositionHistory(historyToSave);
      
      // Save everything to codebase via API (positions, title, description)
      const response = await fetch('/api/save-box-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          positions: reportBoxPositions,
          history: historyToSave,
          box2Title: box2Title,
          box2Description: box2Description,
          updateCodebase: true, // Update TypeScript file
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      // Close editing modes
      setIsEditingBox2Title(false);
      setIsEditingBox2Description(false);
      setSelectedReportBox(null);
    } catch (e) {
      alert('Failed to save. Please try again.');
    }
  };

  

  

  // Undo function - reverts to previous position from history
  const handleUndo = async () => {
    if (positionHistory.length > 0) {
      const previousPositions = positionHistory[positionHistory.length - 1];
      setReportBoxPositions(previousPositions);
      latestPositionsRef.current = previousPositions;
      
      // Update history
      const newHistory = positionHistory.slice(0, -1);
      setPositionHistory(newHistory);
      
      // Save updated state to codebase via API
      try {
        const response = await fetch('/api/save-box-positions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            positions: previousPositions,
            history: newHistory,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save undo state');
        }
      } catch (e) {
        console.error('Failed to save undo state:', e);
        alert('Failed to save undo state. Please try again.');
      }
    }
  };

  // Calculate if we should show shadow (in hero section, after scrolling a bit)
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const showNavShadow = scrollY > 100 && scrollY < viewportHeight * 0.9;
  const isSecondSection = scrollY >= viewportHeight * 0.9;
  const showBackgroundBox = scrollY >= viewportHeight * 0.85;
  // Nav bar turns black closer to when beige backdrop shows
  const hitsWhiteBox = scrollY >= viewportHeight * 0.8;
  const isDropdownOpen = activeDropdown !== null;
  /** Nav wordmark after leaving the gradient hero, desktop mega-menu, or iPhone sheet open (hero needs branding in bar). */
  const showNavLogo =
    hitsWhiteBox || isDropdownOpen || (isPhoneLayout && mobileNavOpen);
  const phoneMenuChrome =
    isPhoneLayout && mobileNavOpen;
  const navTextColor =
    isSecondSection || isDropdownOpen || hitsWhiteBox || phoneMenuChrome ? "#000" : "#fff";
  const navTextShadow =
    showNavShadow && !isDropdownOpen && !hitsWhiteBox && !phoneMenuChrome
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "none";
  const loginButtonBg =
    isSecondSection || isDropdownOpen || hitsWhiteBox ? "#000" : "#fff";
  const loginButtonText =
    isSecondSection || isDropdownOpen || hitsWhiteBox ? "#fff" : "#000";
  const loginButtonShadow =
    showNavShadow && !isDropdownOpen && !hitsWhiteBox ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";

  return (
    <div
      className={`relative overflow-x-hidden${isPhoneLayout ? " doeforvc-iphone-root" : ""}`}
      data-doeforvc-view={isPhoneLayout ? "iphone" : "desktop"}
      style={{
        backgroundColor: "#F7F6F3",
        ...(isPhoneLayout ? { zoom: iphoneZoom } : {}),
      }}
      suppressHydrationWarning
    >
      <button
        type="button"
        className="fixed bottom-4 right-4 z-[100] max-w-[calc(100vw-2rem)] rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-semibold tracking-tight text-gray-900 shadow-md backdrop-blur-sm hover:bg-white"
        aria-label={isPhoneLayout ? "Switch to desktop layout" : "Switch to iPhone layout"}
        onClick={() => {
          persistLayoutClick(isPhoneLayout);
          syncLayoutRef.current();
        }}
      >
        {isPhoneLayout ? "Desktop view" : "iPhone view"}
      </button>
      {/* Hero Section with Dynamic Gradient */}
      <div
        className="relative overflow-hidden"
        style={
          isPhoneLayout
            ? {
                minHeight: `calc(100dvh / ${iphoneZoom})`,
                height: `calc(100dvh / ${iphoneZoom})`,
              }
            : { minHeight: "100dvh", height: "100dvh" }
        }
      >
        {/* Hero with Gradient from Chart2 — extra scale on narrow viewports “zooms into” the gradient */}
        <div 
          className="absolute inset-0 layout-phone:scale-[1.22] layout-phone:origin-[50%_45%]"
          style={{
            background: `
              radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
              radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
              radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%)
            `,
            filter: 'saturate(1.15)',
          }}
        >
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              opacity: 1,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Center brightness reduction overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.15) 0%, transparent 60%)',
            }}
          />
          {/* Grid lines overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.15" />
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
                transform: 'perspective(1200px) translateZ(-200px) rotateX(75deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPattern2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.15" />
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
        {/* Navigation Bar */}
        <nav
          ref={navBarRowRef}
          className="fixed top-0 left-0 right-0 z-50 layout-phone:pt-[env(safe-area-inset-top,0px)]"
          style={{ 
            /** Phone + open sheet: solid bar so safe-area + controls aren’t over transparent hero. */
            backgroundColor:
              isPhoneLayout && mobileNavOpen ? "#F7F6F3" : "transparent",
            borderBottom:
              showBackgroundBox || isDropdownOpen || (isPhoneLayout && mobileNavOpen)
                ? "1px solid #E6E6E6"
                : "none",
            transition: "border-bottom 100ms ease-out, background-color 180ms ease-out",
          }}
          onMouseLeave={() => {
            if (!isPhoneLayout) setActiveDropdown(null);
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
            className="px-8 py-6 layout-phone:px-6 layout-phone:py-6 layout-phone:pl-[max(1.5rem,env(safe-area-inset-left,0px))] layout-phone:pr-[max(1.5rem,env(safe-area-inset-right,0px))] flex items-center relative z-10 layout-phone:gap-2 justify-end"
          >
            {/* Logo — opacity only (no width collapse) so it fades, not slides */}
            <h1
              className={`absolute top-1/2 -translate-y-1/2 left-8 layout-phone:left-[max(1.5rem,env(safe-area-inset-left,0px))] font-normal z-[1] min-w-0 whitespace-nowrap transition-opacity duration-500 ease-out ${lora.className} text-4xl layout-phone:text-6xl layout-phone:leading-none ${
                showNavLogo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={
                showNavLogo ? { color: navTextColor, textShadow: navTextShadow } : undefined
              }
              aria-hidden={!showNavLogo}
            >
              Doe
            </h1>

            {/* Desktop: center Navigation Links */}
            <div className="hidden layout-desktop:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="text-sm font-medium transition-all duration-300 flex items-center gap-1 bg-transparent border-none cursor-pointer hover:opacity-70 shrink-0"
                  style={{ color: navTextColor, textShadow: navTextShadow }}
                  onMouseEnter={() => setActiveDropdown(item)}
                >
                  {item}
                  <svg
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ transform: activeDropdown === item ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Desktop: Login */}
            <a
              href="#"
              className="hidden layout-desktop:inline-flex text-sm font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-all duration-300 shrink-0 items-center"
              style={{
                backgroundColor: loginButtonBg,
                color: loginButtonText,
                boxShadow: loginButtonShadow,
              }}
            >
              Login
            </a>

            {/* iPhone: menu (replaces center links + login) */}
            <button
              type="button"
              className="layout-desktop:hidden flex items-center justify-center p-3 rounded-xl transition-colors active:bg-white/15"
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
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
            <div className="mx-8 layout-phone:mx-4 border-t border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />

            <div className="py-8 layout-phone:py-4">
              <div 
                className={`max-w-[1400px] mx-auto px-8 layout-phone:px-4 flex ${isPhoneLayout ? "flex-col gap-3" : ""}`}
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
                    labels = ['VISION', 'CAREERS', 'PRICING', 'INTEGRATION'];
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
            <div className="mx-8 layout-phone:mx-4 border-b border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />
          </div>
        </nav>

        {/* iPhone: menu panel below fixed nav (nav stays put; page dims behind) */}
        {isPhoneLayout && mobileNavOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[40] cursor-pointer bg-black/25 transition-opacity duration-300 ease-out"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
            />
            {/*
              Outer shell is pointer-events-none so taps hit the dim backdrop except on the
              cream panel. Spacer under fixed nav matches measured height (no hero strip).
            */}
            <div
              className="fixed inset-0 z-[45] flex flex-col pointer-events-none"
              role="presentation"
            >
              <div style={{ height: iphoneMenuTopPx }} className="shrink-0" aria-hidden />
              <div
                className="flex flex-col flex-1 min-h-0 bg-[#F7F6F3] shadow-[0_12px_40px_rgba(0,0,0,0.08)] pointer-events-auto border-t border-[#E6E6E6]"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
              >
                <nav className="flex flex-col flex-1 min-h-0 overflow-y-auto pb-[env(safe-area-inset-bottom,0px)]">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="text-left text-2xl font-semibold tracking-[-0.02em] text-gray-900 px-6 py-5 border-b border-gray-200 active:bg-gray-100 transition-colors"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}

        {/* Hero Header - Centered, Contained in Gradient Circle */}
        <div className="absolute inset-0 z-20 flex items-center justify-center layout-phone:px-3 layout-phone:pt-[env(safe-area-inset-top,0px)] layout-phone:pb-[env(safe-area-inset-bottom,0px)]">
          <div className="max-w-[800px] mx-auto px-8 layout-phone:px-3 text-center w-full">
            <p
              className={`font-normal leading-none tracking-tight mb-7 layout-phone:mb-6 ${lora.className}`}
              style={{
                fontSize: "clamp(6.25rem, 28vw, 14rem)",
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #ffffff 15%, #fafafa 34%, #f5f6f8 52%, #e2e8ee 76%, #c5cdd6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 28px rgba(0, 0, 0, 0.2))",
              }}
            >
              Doe
            </p>
            <p
              className="text-2xl layout-phone:text-3xl font-medium text-white/90 text-center px-2 tracking-tight flex flex-col items-center gap-1 layout-phone:gap-1.5 layout-phone:leading-snug leading-snug"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <span className="block layout-phone:max-w-[min(22ch,100%)]">
                We&apos;re building the future of AI in
              </span>
              <span className="block layout-phone:max-w-[min(22ch,100%)]">
                clinical practice and education.
              </span>
            </p>
          </div>
        </div>

      </div>

      {/* Horizontal line at bottom of hero section */}
      <div className="w-full border-t border-[#E6E6E6]" />

      {/* Second Section — title upper third, carousel lower two-thirds */}
      <div ref={secondSectionRef} className="min-h-[calc(100dvh+7rem)] relative z-10 flex flex-col pt-16 pb-12 layout-phone:min-h-[calc(100dvh+6rem)] layout-phone:pt-12 layout-phone:pb-10">
        <div className="flex-1 grid grid-rows-[3fr_9fr] min-h-[85vh] layout-phone:min-h-[88dvh] w-full overflow-x-hidden">
          {/* Title band — slightly taller than 1:2 so headline has room */}
          <div className="flex flex-col justify-center min-h-0 px-4 layout-phone:px-5 py-14 layout-phone:py-11">
            <div className="text-center">
              <h1 
                className={`flex flex-col items-center gap-2 md:gap-4 layout-phone:gap-2 font-normal text-gray-900 tracking-tight ${lora.className}`}
                style={{
                  opacity: secondSectionTitleOpacity,
                  transform: `translateY(${secondSectionTitleTranslateY}px)`,
                  transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
                }}
              >
                <span className="block leading-[1.04] text-7xl md:text-8xl lg:text-[8rem] xl:text-[9rem] layout-phone:text-[clamp(2.65rem,11.5vw,4rem)] layout-phone:leading-[1.06]">
                  Agents for every
                </span>
                <span className="block leading-[1.04] text-7xl md:text-8xl lg:text-[8rem] xl:text-[9rem] layout-phone:text-[clamp(2.65rem,11.5vw,4rem)] layout-phone:leading-[1.06]">
                  workflow.
                </span>
              </h1>
            </div>
          </div>

          {/* Carousel band (~bottom two-thirds) */}
          <div className="flex flex-col justify-center min-h-0 overflow-x-hidden overflow-y-visible pb-10 layout-phone:pb-8">
          {/* Sliding squares container */}
          <div 
            className="relative layout-phone:mx-auto layout-phone:w-full" 
            style={{ 
              height: slideBoxH, 
              display: 'flex', 
              alignItems: 'center',
              opacity: slidingBoxesOpacity,
              transform: `translateY(${slidingBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
            }}
          >
            {/* Pause button - top right corner */}
            <button
              onClick={() => setIsSlidingPaused(!isSlidingPaused)}
              className="absolute top-4 right-4 layout-phone:top-3 layout-phone:right-2 z-30 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                className="absolute left-8 layout-phone:left-2 z-20 transition-opacity duration-200 hover:opacity-70"
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
                className="absolute right-8 layout-phone:right-2 z-20 transition-opacity duration-200 hover:opacity-70"
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
              className="relative layout-phone:rounded-2xl"
              style={{ 
                width: '100%',
                height: slideBoxH,
                overflow: 'hidden'
              }}
            >
            {/* Boxes - absolutely positioned for modular recycling */}
            {([0, 1, 2, 3, 4, 5] as const).map((i) => {
              // Box 1 (index 0) - Scheduled Updates
              if (i === 0) {
                return (
                  <div
                    key={`box-${i}`}
                    ref={slidingBoxRefs[i]}
                    className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
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
                    {/* Grid pattern overlay - Box 1: Diagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="grid1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid1)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* White UI Box */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 bg-white rounded-xl p-6"
                      style={{ 
                        opacity: 1,
                        pointerEvents: 'auto',
                        width: '320px',
                        height: '360px',
                        overflowY: 'hidden',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        bottom: '200px',
                      }}
                    >
                      {/* Notification Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                          Inbox Summary
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>3 new</span>
                        </div>
                      </div>

                      {/* Email Item */}
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Dr. Sarah Chen</span>
                              <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>2h ago</span>
                            </div>
                            <p className={`text-gray-600 mb-2 break-words line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              Patient follow-up request for post-op consultation
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Call Item */}
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Hospital Admin</span>
                              <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>4h ago</span>
                            </div>
                            <p className={`text-gray-600 mb-2 break-words line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              Urgent: Schedule change for tomorrow&apos;s surgery
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Email Item */}
                      <div className="mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Lab Results</span>
                              <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>6h ago</span>
                            </div>
                            <p className={`text-gray-600 break-words mb-0 line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              New test results available for review - Patient ID: 2847
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Scheduled Updates
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe summarizes your incoming messages and emails at a specific time so all you have to do it verify.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 2 (index 1) - Report Results
              if (i === 1) {
                return (
                  <div
                    key={`box-${i}`}
                    ref={slidingBoxRefs[i]}
                    className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
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
                    {/* Grid pattern overlay - Box 2: Curved radial grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        {Array.from({ length: 8 }, (_, j) => {
                          const angle = (j * 45);
                          const radius = 350;
                          return (
                            <path
                              key={`radial-${j}`}
                              d={`M 350 350 L ${350 + Math.cos(angle * Math.PI / 180) * radius} ${350 + Math.sin(angle * Math.PI / 180) * radius}`}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.15)"
                              strokeWidth="0.8"
                            />
                          );
                        })}
                        {Array.from({ length: 6 }, (_, j) => {
                          const r = (j + 1) * 100;
                          return (
                            <circle
                              key={`circle-${j}`}
                              cx="350"
                              cy="350"
                              r={r}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.15)"
                              strokeWidth="0.8"
                            />
                          );
                        })}
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Save and Undo buttons - top right corner, styled like tab switcher */}
                    {!isPhoneLayout && (selectedReportBox !== null || isEditingBox2Title || isEditingBox2Description) && (
                      <div
                        className="absolute top-6 right-6 flex items-center z-20"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          borderRadius: '9999px',
                          padding: '5px',
                          gap: '3px',
                        }}
                      >
                        <button
                          onClick={handleSave}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleUndo}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Undo
                        </button>
                      </div>
                    )}
                    
                    {/* Two overlapping rectangle boxes */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ transform: 'translateX(-50%) translateY(-60%)' }}>
                      
                      {/* First Rectangle Box */}
                      <div 
                        className="bg-white rounded-lg shadow-lg"
                        onMouseDown={(e) => handleBoxMouseDown(e, 0)}
                        onClick={(e) => {
                          if (isPhoneLayout) return;
                          if (!isDragging && !wasDragging) {
                            setSelectedReportBox(0);
                          }
                        }}
                        style={{ 
                          width: '280px',
                          height: 'fit-content',
                          position: 'relative',
                          zIndex: selectedReportBox === 0 ? 3 : 2,
                          transform: `translateX(${reportBoxPositions[0].x}px) translateY(${reportBoxPositions[0].y}px)`,
                          opacity: 1,
                          pointerEvents: 'auto',
                          userSelect: 'none',
                          cursor: isPhoneLayout ? 'default' : isDragging && dragBoxIndex === 0 ? 'grabbing' : 'grab',
                          touchAction: 'none',
                          padding: '16px',
                          paddingBottom: '12px',
                          border: selectedReportBox === 0 ? '2px solid #2563eb' : 'none',
                          transition: isDragging && dragBoxIndex === 0 ? 'none' : 'border 0.2s ease',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className={`text-gray-900 text-sm font-bold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Patient #2847
                            </p>
                            <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              CT Scan - Chest
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Report ready for review • 2h ago
                        </p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Verify
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Refer
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Contact
                          </button>
                        </div>
                      </div>

                      {/* Second Rectangle Box - overlapping */}
                      <div 
                        className="bg-white rounded-lg shadow-lg"
                        onMouseDown={(e) => handleBoxMouseDown(e, 1)}
                        onClick={(e) => {
                          if (isPhoneLayout) return;
                          if (!isDragging && !wasDragging) {
                            setSelectedReportBox(1);
                          }
                        }}
                        style={{ 
                          width: '280px',
                          height: 'fit-content',
                          position: 'absolute',
                          top: `${reportBoxPositions[1].y}px`,
                          left: `${reportBoxPositions[1].x}px`,
                          zIndex: selectedReportBox === 1 ? 3 : 1,
                          opacity: 1,
                          pointerEvents: 'auto',
                          userSelect: 'none',
                          cursor: isPhoneLayout ? 'default' : isDragging && dragBoxIndex === 1 ? 'grabbing' : 'grab',
                          touchAction: 'none',
                          padding: '16px',
                          paddingBottom: '12px',
                          border: selectedReportBox === 1 ? '2px solid #2563eb' : 'none',
                          transition: isDragging && dragBoxIndex === 1 ? 'none' : 'border 0.2s ease',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className={`text-gray-900 text-sm font-bold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Patient #1923
                            </p>
                            <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Lab Results - Blood
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Report ready for review • 4h ago
                        </p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Verify
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Refer
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                      {isPhoneLayout ? (
                        <>
                          <span className={`${slideCaptionBadge} select-none`} style={slideCaptionFont}>
                            Report Results
                          </span>
                          <p className={`${slideCaptionBody} select-none`} style={slideCaptionFont}>
                            Stack imaging and labs in one view. Verify findings and route follow-ups without switching systems.
                          </p>
                        </>
                      ) : (
                        <>
                          {isEditingBox2Title ? (
                        <input
                          type="text"
                          value={box2Title}
                          onChange={(e) => {
                            setBox2Title(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Title(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingBox2Title(false);
                            }
                            if (e.key === 'Escape') {
                              setIsEditingBox2Title(false);
                            }
                          }}
                          className={`${slideCaptionBadge} border-2 border-white bg-white/15 outline-none min-w-[12rem]`}
                          style={slideCaptionFont}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className={`${slideCaptionBadge} cursor-text hover:bg-white/12 transition-colors`}
                          style={slideCaptionFont}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Title(true);
                          }}
                        >
                          {box2Title}
                        </span>
                      )}
                      {isEditingBox2Description ? (
                        <textarea
                          ref={descriptionEditRef}
                          value={box2Description}
                          onChange={(e) => {
                            setBox2Description(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Description(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsEditingBox2Description(false);
                            }
                          }}
                          className={`${slideCaptionBody} outline-none resize-none overflow-hidden rounded-md border border-white/40 bg-transparent`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '8px 10px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            background: 'transparent',
                            backgroundImage: 'none',
                            minHeight: 'fit-content',
                            maxHeight: 'none',
                            overflow: 'hidden',
                            direction: 'ltr',
                            textAlign: 'left',
                            color: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                          }}
                          rows={2}
                          wrap="soft"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const scrollHeight = target.scrollHeight;
                            const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
                            const maxHeight = lineHeight * 2;
                            target.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                          }}
                        />
                      ) : (
                        <p 
                          className={`${slideCaptionBody} cursor-text hover:bg-white/6 rounded-md transition-colors`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '6px 8px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Description(true);
                          }}
                        >
                          {box2Description}
                        </p>
                      )}
                        </>
                      )}
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 3 (index 2) - Diagnostic Assistant
              if (i === 2) {
                return (
                  <div
                    key={`box-${i}`}
                    ref={slidingBoxRefs[i]}
                    className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
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
                    {/* Grid pattern overlay - Box 3: Hexagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="hexGrid" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Different UI - Diagnostic Assistant */}
                    <div 
                      className="absolute left-1/2 bg-white rounded-xl"
                      style={{ 
                        opacity: 1,
                        pointerEvents: 'auto',
                        width: '300px',
                        height: 'fit-content',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        top: '45%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        padding: '20px',
                        paddingBottom: '16px',
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                          Diagnostic AI
                        </h3>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">AI</span>
                        </div>
                      </div>

                      {/* Analysis Section */}
                      <div className="pb-4 border-b border-gray-100">
                        <p className={`text-gray-600 text-xs mb-2`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Analyzing symptoms...
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Fever pattern detected
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Lab correlation found
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Treatment suggested
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Score - overlapping at corner */}
                    <div 
                      className="absolute bg-gray-100 rounded-lg shadow-lg"
                      style={{ 
                        width: '240px',
                        height: 'fit-content',
                        top: 'calc(45% + 100px)',
                        right: 'calc(50% - 180px)',
                        transform: 'translateY(-50%)',
                        padding: '16px',
                        paddingBottom: '14px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        zIndex: 10,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-gray-700 text-sm font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Confidence
                        </span>
                        <span className={`text-gray-600 text-sm font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          87%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Diagnostic Assistant
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        AI analyzes symptoms, lab results, and patient history to suggest potential diagnoses with confidence scores.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 4 (index 3) - Care Coordination
              if (i === 3) {
                return (
                <div
                  key={`box-${i}`}
                  ref={slidingBoxRefs[i]}
                  className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                  style={{
                    width: slideBoxW,
                    height: slideBoxH,
                    transform: "translate3d(0, 0, 0)",
                    willChange: "transform",
                  }}
                >
                  <div
                    className="rounded-2xl"
                    style={{
                      width: 700,
                      height: 700,
                      position: "absolute",
                      left: (slideBoxW - scaledSide) / 2,
                      top: (slideBoxH - scaledSide) / 2,
                      transform: `scale(${slideUniformScale})`,
                      transformOrigin: "top left",
                      background:
                        "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
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
                  {/* Grid pattern overlay - Box 4: Dotted grid */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                    <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                      <defs>
                        <pattern id="dotGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                          <circle cx="25" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.25)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#dotGrid)" />
                    </svg>
                  </div>
                  {/* Number indicator */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {i + 1}
                    </span>
                  </div>
                  
                  {/* Different UI - Care Coordination Timeline */}
                  <div 
                    className="absolute left-1/2 bg-white rounded-xl"
                    style={{ 
                      opacity: 1,
                      pointerEvents: 'auto',
                      width: '340px',
                      height: 'fit-content',
                      userSelect: 'none',
                      cursor: 'default',
                      touchAction: 'none',
                      top: '45%',
                      transform: 'translateX(-50%) translateY(-50%)',
                      padding: '24px',
                      paddingBottom: '20px',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                        Care Timeline
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>5 tasks</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                        </div>
                        <div className="flex-1">
                          <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Follow-up scheduled
                          </p>
                          <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Patient #2847 • Tomorrow 2:00 PM
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                        </div>
                        <div className="flex-1">
                          <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Lab review pending
                          </p>
                          <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Blood Panel #4521 • Due today
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Prescription refill
                          </p>
                          <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Metformin • Patient #1923
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                    <span className={slideCaptionBadge} style={slideCaptionFont}>
                      Care Coordination
                    </span>
                    <p className={slideCaptionBody} style={slideCaptionFont}>
                      Track and manage patient care tasks, follow-ups, and coordination across your entire practice seamlessly.
                    </p>
                  </div>
                  </div>
                </div>
                );
              }

              // Box 5 (index 4) - Referral Intake
              if (i === 4) {
                return (
                  <div
                    key={`box-${i}`}
                    ref={slidingBoxRefs[i]}
                    className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
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
                    {/* Grid pattern overlay - Box 5: Fine crosshatch grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="crosshatchGrid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                            <path d="M 0 0 L 56 0 M 0 0 L 0 56" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
                            <circle cx="28" cy="28" r="1" fill="rgba(255, 255, 255, 0.18)" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#crosshatchGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Different UI - Referral Intake */}
                    <div
                      className="absolute left-1/2 bg-white rounded-xl"
                      style={{
                        opacity: 1,
                        pointerEvents: 'auto',
                        width: '320px',
                        height: 'fit-content',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        top: '45%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        padding: '20px',
                        paddingBottom: '16px',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                          Referral Intake
                        </h3>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">5</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Cardiology
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Urgent</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              New patient referral queued for triage and specialist routing.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Imaging
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Today</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Documents and notes attached, ready to send to intake review.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Referral Intake
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe captures new referrals, sorts urgency, and routes each case to the right team automatically.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              // Box 6 (index 5) — Prior authorization copilot
              if (i === 5) {
                return (
                  <div
                    key={`box-${i}`}
                    ref={slidingBoxRefs[i]}
                    className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl layout-phone:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
                      }}
                    >
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" preserveAspectRatio="none">
                        {Array.from({ length: 12 }, (_, w) => (
                          <path
                            key={`wave-${w}`}
                            d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.12)"
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    <div
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '472px',
                        height: '380px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                      }}
                    >
                      <div className="relative w-full h-full">
                        {/* Rear card — benefits / coverage context */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '258px',
                            left: '12px',
                            top: '84px',
                            zIndex: 1,
                            padding: '18px',
                            paddingBottom: '16px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                              Benefits snapshot
                            </h3>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-[10px] font-bold">Rx</span>
                            </div>
                          </div>
                          <p className={`text-gray-500 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Aetna PPO · Subscriber ID ending ·8821
                          </p>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-gray-700 text-xs font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              PA required
                            </span>
                            <span className={`text-gray-600 text-xs font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Yes
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-600 h-2 rounded-full" style={{ width: '55%' }} />
                          </div>
                          <p className={`text-gray-500 text-[11px] mt-2`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Packet steps 2 of 4 complete
                          </p>
                        </div>

                        {/* Front card — draft PA packet */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '282px',
                            left: '198px',
                            top: '12px',
                            zIndex: 2,
                            padding: '16px',
                            paddingBottom: '14px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className={`text-gray-900 text-sm font-bold mb-0.5`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Prior auth packet
                              </p>
                              <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Humira · Patient #2847
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                          </div>
                          <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Clinical summary and CPT bundle attached. Ready to queue for payer submission.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Queue
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Prior authorization
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe drafts payer packets, tracks status, and surfaces denials so nothing blocks the schedule.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Blank Section with Grid Lines */}
      <div
        ref={carouselSectionRef}
        className="w-full relative z-10 overflow-x-hidden"
        style={{
          opacity: carouselSectionOpacity,
          transform: `translateY(${carouselSectionTranslateY}px)`,
          transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
          ...(isPhoneLayout
            ? {
                minHeight: `calc(100dvh / ${iphoneZoom})`,
                height: `calc(100dvh / ${iphoneZoom})`,
              }
            : { minHeight: "100dvh", height: "100dvh" }),
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blankSectionGridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blankSectionGridPattern)" />
          </svg>
        </div>
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
              className={`text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-8 ${oldStandardTT.className}`}
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                position: 'relative',
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'nowrap',
                width: 'calc(50vw - 6rem)',
              }}
            >
              Doe{'\u00A0'}
              {(() => {
                const words = ['Agents', 'Franchises', 'Design', 'Billing', 'Marketing', 'Patient', 'Teams', 'Inbox'];
                const n = words.length;
                const offsets = [-3, -2, -1, 0, 1, 2, 3];

                const getOpacity = (offset: number) => {
                  const abs = Math.abs(offset);
                  if (abs === 0) return 1;
                  if (abs === 1) return 0.3;
                  if (abs === 2) return 0.2;
                  return 0;
                };

                return (
                  <span
                    className={inter.className}
                    style={{ position: 'relative', display: 'inline-block', verticalAlign: 'baseline', fontWeight: 300, fontSize: '0.9em', marginLeft: '0.15em' }}
                  >
                    {/* Invisible sizer — holds space for the active word, keeps layout stable */}
                    <span style={{ opacity: 0, whiteSpace: 'nowrap', display: 'inline-block', lineHeight: '1.2em', pointerEvents: 'none' }}>
                      {words[selectedWordIndex]}
                    </span>
                    {/* Single sliding strip — all words move together */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: `translateY(${carouselOffset * 1.2}em)`,
                        transition: isCarouselTransitioning && carouselOffset !== 0 ? 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                      }}
                    >
                      {offsets.map(offset => {
                        const wordIdx = ((selectedWordIndex + offset) % n + n) % n;
                        return (
                          <span
                            key={offset}
                            style={{
                              position: 'absolute',
                              top: `${offset * 1.2}em`,
                              left: 0,
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2em',
                              opacity: getOpacity(offset),
                              color: offset === 0 ? '#111827' : '#6B7280',
                            }}
                          >
                            {words[wordIdx]}
                          </span>
                        );
                      })}
                    </span>
                    {/* Fixed fade overlays — stationary, words slide through them */}
                    <span style={{
                      position: 'absolute',
                      top: '-4.8em',
                      left: '-2em',
                      right: '-2em',
                      height: '4.8em',
                      background: 'linear-gradient(to bottom, rgba(247,246,243,1) 0%, rgba(247,246,243,0) 100%)',
                      pointerEvents: 'none',
                    }} />
                    <span style={{
                      position: 'absolute',
                      bottom: '-4.8em',
                      left: '-2em',
                      right: '-2em',
                      height: '4.8em',
                      background: 'linear-gradient(to top, rgba(247,246,243,1) 0%, rgba(247,246,243,0) 100%)',
                      pointerEvents: 'none',
                    }} />
                  </span>
                );
              })()}
              {/* Arrows — anchored to the h1, never move */}
              <div className="absolute flex flex-col gap-2 z-10" style={{ right: '7rem', top: '50%', transform: 'translateY(-50%)' }}>
                <button
                  onClick={() => {
                    if (isCarouselTransitioning) return;
                    setIsCarouselTransitioning(true);
                    // Start transition: fade out + scale down + translate up
                    requestAnimationFrame(() => {
                      setUiMockupOpacity(0);
                      setUiMockupTranslateY(10);
                      setUiMockupScale(0.96);
                    });
                    // Move strip down to bring previous word up
                    setCarouselOffset(1);
                    setTimeout(() => {
                      // Update index first
                      const newIndex = (selectedWordIndex - 1 + 8) % 8;
                      setSelectedWordIndex(newIndex);
                      // Reset offset instantly (no transition) after index update
                      setCarouselOffset(0);
                      // End transition: fade in + scale back + translate to center
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
                  className="p-1 hover:opacity-70 transition-opacity"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (isCarouselTransitioning) return;
                    setIsCarouselTransitioning(true);
                    // Start transition: fade out + scale down + translate up
                    requestAnimationFrame(() => {
                      setUiMockupOpacity(0);
                      setUiMockupTranslateY(10);
                      setUiMockupScale(0.96);
                    });
                    // Move strip up to bring next word down
                    setCarouselOffset(-1);
                    setTimeout(() => {
                      // Update index first
                      const newIndex = (selectedWordIndex + 1) % 8;
                      setSelectedWordIndex(newIndex);
                      // Reset offset instantly (no transition) after index update
                      setCarouselOffset(0);
                      // End transition: fade in + scale back + translate to center
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
                  className="p-1 hover:opacity-70 transition-opacity"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </h1>
          </div>
        </div>
        {/* Description - bottom right corner of left half */}
        {(() => {
          const descriptions = [
            ["Automates tasks around you", "Learns your workflows daily", "Acts without being asked to"],
            ["One system, every location", "Consistent brand and process", "Scale without losing control"],
            ["Built for clinical precision", "Minimal, focused interfaces", "Every decision intentional"],
            ["Claims submitted instantly", "Revenue tracked end to end", "No more chasing payments"],
            ["Reach patients who need you", "Campaigns run on your data", "Growth that runs itself now"],
            ["Full history before you ask", "Context always at your side", "Know each patient completely"],
            ["Stay aligned across all roles", "Tasks and notes in one place", "Built for how clinics work"],
            ["Every message, one channel", "Sorted before you open it", "Nothing falls through again"],
          ];
          const lines = descriptions[selectedWordIndex] ?? descriptions[0];
          return (
            <div className="absolute left-0 z-20 px-8 md:px-16 lg:px-24" style={{ width: '50%', textAlign: 'right', bottom: '10vh' }}>
              <div
                key={selectedWordIndex}
                className={`text-lg md:text-xl text-gray-700 ${inter.className}`}
                style={{ fontWeight: 500, animation: 'fade-in 0.35s ease-out' }}
              >
                {lines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          );
        })()}
        {/* Orange rounded box - right half of section, left half of box visible (full section height like hero gradient) */}
        <div 
          className="absolute top-0 bottom-0 z-30"
          style={{
            width: '100vw',
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
              const words = ['Agents', 'Franchises', 'Design', 'Billing', 'Marketing', 'Patient', 'Teams', 'Inbox'];
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

              // Agents UI - Automation workflows
              if (currentWord === 'Agents') {
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

              // Franchises UI - Multi-location
              if (currentWord === 'Franchises') {
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

              // Design UI - Clean interface elements
              if (currentWord === 'Design') {
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

              // Marketing UI - Campaigns
              if (currentWord === 'Marketing') {
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

              // Teams UI - Collaboration
              if (currentWord === 'Teams') {
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
                  width: '86%',
                  height: '86%',
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
          className="w-full h-[85vh] rounded-2xl relative overflow-hidden flex flex-col items-center pt-14"
          style={{
            /* Brighter read: lifted copper/amber, softer shadow corners (still dotted hero) */
            background: `
              radial-gradient(ellipse 125% 105% at 92% 4%, rgba(241, 186, 92, 0.55) 0%, rgba(231, 169, 68, 0.72) 18%, rgba(212, 157, 79, 0.48) 38%, rgba(210, 119, 76, 0.2) 58%, transparent 84%),
              radial-gradient(ellipse 115% 100% at 4% 6%, #D68860 0%, #D2774C 26%, rgba(212, 157, 79, 0.38) 48%, rgba(210, 119, 76, 0.16) 68%, transparent 86%),
              radial-gradient(ellipse 135% 115% at 0% 100%, #1A1F24 0%, #242A31 20%, #323A42 40%, #3F4852 56%, rgba(82, 92, 102, 0.38) 74%, rgba(60, 68, 76, 0.15) 88%, transparent 94%),
              radial-gradient(ellipse 120% 105% at 100% 100%, #7A6B5A 0%, #8B7A65 26%, #9A8B78 48%, rgba(140, 128, 112, 0.35) 70%, transparent 88%),
              radial-gradient(ellipse 95% 85% at 48% 44%, rgba(231, 190, 120, 0.14) 0%, rgba(212, 157, 79, 0.12) 38%, rgba(139, 122, 104, 0.08) 58%, transparent 72%),
              radial-gradient(ellipse 160% 100% at 50% 108%, rgba(18, 22, 26, 0.28) 0%, rgba(32, 38, 44, 0.12) 42%, transparent 56%)
            `,
            backgroundSize: '240% 240%',
            backgroundPosition: '48% 48%',
            filter: 'saturate(1.28)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            opacity: thirdSectionOpacity,
            transform: `translateY(${thirdSectionTranslateY}px)`,
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
          {/* Dotted grid overlay (sliding box 4–style; slightly finer for the large hero) */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
            <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thirdSectionDotGrid" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
                  <circle cx="22" cy="22" r="1.35" fill="rgba(255, 255, 255, 0.2)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thirdSectionDotGrid)" />
            </svg>
          </div>
          {/* Tab Switcher */}
          <div
            className="relative flex items-center mt-auto mb-8"
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
                className="relative z-10 px-7 py-3 text-lg font-medium transition-colors duration-200"
                style={{
                  borderRadius: '9999px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: activeTab === tab ? '#1a1a1a' : 'rgba(255,255,255,0.88)',
                  backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                  transition: 'background-color 250ms ease, color 250ms ease',
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

      {/* New Gradient Section - Left and right gradient boxes */}
      <div
        ref={newGradientSectionRef}
        className="min-h-[78vh] w-full relative z-10 flex items-center my-[90px] pl-0 overflow-x-visible overflow-y-visible"
      >
        <div
          className="relative z-20 w-full py-0"
          style={{
            opacity: newGradientSectionOpacity,
            transform: `translateY(${newGradientSectionTranslateY}px)`,
            transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr] gap-0 items-stretch min-h-[78vh] w-full min-w-0">
            <div className="min-w-0 w-full lg:order-2 px-8 md:px-16 lg:px-24 lg:pl-16 flex flex-col min-h-[78vh] relative overflow-visible">
              {/* Carousel-matching grid overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
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

                {/* Same fade masking as the carousel section */}
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none z-0"
                  style={{
                    height: '200px',
                    background: 'linear-gradient(to bottom, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
                  style={{
                    height: '200px',
                    background: 'linear-gradient(to top, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)',
                  }}
                />
              </div>
              <div className="flex-1 flex items-center relative z-10 w-full min-w-0">
                <div className="text-left w-full min-w-0 pr-0">
                  <div className="mb-6 text-xs font-semibold tracking-[0.22em] uppercase text-gray-500">
                    Clinical Decision Support
                  </div>
                  <h1
                    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 tracking-[-0.02em] w-full min-w-0 break-words ${inter.className}`}
                    style={{ fontWeight: 300, lineHeight: 1.1 }}
                  >
                    AI that helps
                    <br />
                    clinicians decide.
                  </h1>
                </div>
              </div>

              <p
                className={`mt-auto w-full text-lg md:text-xl text-gray-700 text-right relative z-10 ${inter.className}`}
                style={{ fontWeight: 500, lineHeight: 1.7 }}
              >
                Doe brings together the chart, the signal, and the next step so clinical decisions feel faster, clearer, and still fully human.
              </p>
            </div>

            {/* Three-card fan stack - wrapped in gradient box */}
            <div className="hidden lg:flex items-center justify-center relative lg:order-1 w-full min-h-[78vh] min-w-0">
              <div
                className="relative overflow-hidden z-20 w-full h-full min-h-[78vh]"
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: '20px',
                  borderBottomRightRadius: '20px',
                  /* Same base + treatment as first sliding workflow card (Scheduled Updates) */
                  background: `linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)`,
                }}
              >
                {/* Grain — identical to sliding boxes */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                    opacity: 1,
                    mixBlendMode: 'overlay',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: '20px',
                    borderBottomRightRadius: '20px',
                  }}
                />
                {/* Diagonal line grid — same as sliding box 1 pattern */}
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: '20px',
                    borderBottomRightRadius: '20px',
                  }}
                >
                  <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <pattern id="cdsDecisionSlidingGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cdsDecisionSlidingGrid)" />
                  </svg>
                </div>
                <div className="relative w-full h-full">

              {/* Card 1 — Context View (back-left) */}
              <div
                className="absolute cursor-pointer"
                style={{
                  width: '55%',
                  maxWidth: '380px',
                  left: '50%',
                  top: '50%',
                  transform: hoveredDecisionCard === 'context'
                    ? 'translate(-72%, -50%) rotate(-8deg) scale(1.06) translateY(-12px)'
                    : hoveredDecisionCard !== null
                    ? 'translate(-72%, -50%) rotate(-12deg) scale(0.95)'
                    : 'translate(-72%, -50%) rotate(-10deg) scale(1)',
                  zIndex: hoveredDecisionCard === 'context' ? 30 : 5,
                  transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease',
                }}
                onMouseEnter={() => setHoveredDecisionCard('context')}
                onMouseLeave={() => setHoveredDecisionCard(null)}
              >
                <div
                  className="rounded-2xl overflow-hidden border border-[#E6E6E6] bg-[#FCFBF8]"
                  style={{
                    boxShadow: hoveredDecisionCard === 'context'
                      ? '0 40px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.06)'
                      : '0 12px 32px rgba(0,0,0,0.07)',
                    transition: 'box-shadow 500ms ease',
                  }}
                >
                  <div className="p-4 border-b border-[#E6E6E6]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">Context View</span>
                      <span className="text-xs font-medium text-gray-500">Live</span>
                    </div>
                    <h3 className={`text-lg text-gray-900 mb-1.5 ${lora.className}`} style={{ fontWeight: 400, lineHeight: 1.2 }}>
                      Signals, trends, and follow-up.
                    </h3>
                    <p className={`text-xs text-gray-600 ${inter.className}`} style={{ lineHeight: 1.5, fontWeight: 500 }}>
                      A second surface keeps the broader timeline visible while the decision view stays in focus.
                    </p>
                  </div>
                  <div className="p-4 bg-[#EFEDE6]">
                    <div className="space-y-2">
                      {[
                        ['Trend', 'labs improving over 48 hours'],
                        ['Care gap', 'follow-up visit still pending'],
                        ['Action', 'coordinate review with team'],
                      ].map(([label, value], index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#E6E6E6] px-3 py-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-0.5">{label}</p>
                            <p className={`text-xs text-gray-800 ${inter.className}`} style={{ lineHeight: 1.4, fontWeight: 500 }}>{value}</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#1E343A]/10 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1E343A]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 — Timeline View (middle) */}
              <div
                className="absolute cursor-pointer"
                style={{
                  width: '55%',
                  maxWidth: '380px',
                  left: '50%',
                  top: '50%',
                  transform: hoveredDecisionCard === 'timeline'
                    ? 'translate(-50%, -50%) rotate(0deg) scale(1.06) translateY(-12px)'
                    : hoveredDecisionCard !== null
                    ? 'translate(-50%, -50%) rotate(2deg) scale(0.95)'
                    : 'translate(-50%, -50%) rotate(1deg) scale(1)',
                  zIndex: hoveredDecisionCard === 'timeline' ? 30 : 10,
                  transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease',
                }}
                onMouseEnter={() => setHoveredDecisionCard('timeline')}
                onMouseLeave={() => setHoveredDecisionCard(null)}
              >
                <div
                  className="rounded-2xl overflow-hidden border border-[#E6E6E6] bg-[#F9F8F5]"
                  style={{
                    boxShadow: hoveredDecisionCard === 'timeline'
                      ? '0 40px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.06)'
                      : '0 16px 40px rgba(0,0,0,0.09)',
                    transition: 'box-shadow 500ms ease',
                  }}
                >
                  <div className="p-4 border-b border-[#E6E6E6]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">Patient Timeline</span>
                      <span className="text-xs font-medium text-gray-500">72 hrs</span>
                    </div>
                    <h3 className={`text-lg text-gray-900 mb-1.5 ${lora.className}`} style={{ fontWeight: 400, lineHeight: 1.2 }}>
                      History at a glance.
                    </h3>
                    <p className={`text-xs text-gray-600 ${inter.className}`} style={{ lineHeight: 1.5, fontWeight: 500 }}>
                      Key events, vitals, and changes surfaced in the order that matters most.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F0EEE9]">
                    <div className="space-y-2">
                      {[
                        ['Vitals', 'BP stable, HR elevated slightly'],
                        ['Medication', 'dose adjusted 18 hrs ago'],
                        ['Flag', 'missed follow-up from last visit'],
                      ].map(([label, value], index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#E6E6E6] px-3 py-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-0.5">{label}</p>
                            <p className={`text-xs text-gray-800 ${inter.className}`} style={{ lineHeight: 1.4, fontWeight: 500 }}>{value}</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#1E343A]/10 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1E343A]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 — Decision View (front-right) */}
              <div
                className="absolute cursor-pointer"
                style={{
                  width: '55%',
                  maxWidth: '380px',
                  left: '50%',
                  top: '50%',
                  transform: hoveredDecisionCard === 'decision'
                    ? 'translate(-28%, -50%) rotate(8deg) scale(1.06) translateY(-12px)'
                    : hoveredDecisionCard !== null
                    ? 'translate(-28%, -50%) rotate(12deg) scale(0.95)'
                    : 'translate(-28%, -50%) rotate(10deg) scale(1)',
                  zIndex: hoveredDecisionCard === 'decision' ? 30 : 15,
                  transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease',
                }}
                onMouseEnter={() => setHoveredDecisionCard('decision')}
                onMouseLeave={() => setHoveredDecisionCard(null)}
              >
                <div
                  className="rounded-2xl overflow-hidden border border-[#E6E6E6] bg-white"
                  style={{
                    boxShadow: hoveredDecisionCard === 'decision'
                      ? '0 44px 88px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)'
                      : '0 20px 48px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 500ms ease',
                  }}
                >
                  <div className="p-4 border-b border-[#E6E6E6]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">Decision View</span>
                      <span className="text-xs font-medium text-gray-500">Updated just now</span>
                    </div>
                    <h3 className={`text-lg text-gray-900 mb-1.5 ${lora.className}`} style={{ fontWeight: 400, lineHeight: 1.2 }}>
                      Clear signal, clear reasoning.
                    </h3>
                    <p className={`text-xs text-gray-600 ${inter.className}`} style={{ lineHeight: 1.5, fontWeight: 500 }}>
                      Doe organizes the evidence, explains the why, and keeps the care team in control of the final call.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F7F6F3]">
                    <div className="space-y-2">
                      {[
                        ['Signal', 'abnormal labs, med changes, missed follow-up'],
                        ['Reasoning', 'why the pattern matters and what changed'],
                        ['Next step', 'review, confirm, and act with confidence'],
                      ].map(([label, value], index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#E6E6E6] px-3 py-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-0.5">{label}</p>
                            <p className={`text-xs text-gray-800 ${inter.className}`} style={{ lineHeight: 1.4, fontWeight: 500 }}>{value}</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#1E343A]/10 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1E343A]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section - Three Box Bento */}
      <div className="min-h-screen relative z-10 w-full">
        <div className="max-w-[1800px] mx-auto px-8 py-16 pt-32">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}>
              Build with us.
            </h1>
          </div>
          {/* Three square boxes */}
          <div 
            className="flex gap-8"
            style={{ height: '600px' }}
            onMouseLeave={() => setHoveredBuildBox(null)}
          >
            <BuildWithUsBentoSurface
              meshId="buildStatic0"
              variant={0}
              style={{
                flex: hoveredBuildBox === 0 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                opacity: hoveredBuildBox !== null && hoveredBuildBox !== 0 ? 0.5 : 1,
              }}
              onMouseEnter={() => setHoveredBuildBox(0)}
            />
            <BuildWithUsBentoSurface
              meshId="buildStatic1"
              variant={1}
              style={{
                flex: hoveredBuildBox === 1 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                opacity: hoveredBuildBox !== null && hoveredBuildBox !== 1 ? 0.5 : 1,
              }}
              onMouseEnter={() => setHoveredBuildBox(1)}
            />
            <BuildWithUsBentoSurface
              meshId="buildStatic2"
              variant={2}
              style={{
                flex: hoveredBuildBox === 2 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                opacity: hoveredBuildBox !== null && hoveredBuildBox !== 2 ? 0.5 : 1,
              }}
              onMouseEnter={() => setHoveredBuildBox(2)}
            />
          </div>
        </div>
      </div>

      {/* Outer wrapper with continuous vertical borders */}
      <div className="border-l border-r border-[#E6E6E6] max-w-[1600px] mx-auto">

        {/* Third Section - Bento Box Grid */}
        <div ref={featuresSectionRef} className="min-h-screen relative z-10 w-full">
          <div className="max-w-[1800px] mx-auto px-8 py-16 pt-32">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 
              className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}
              style={{
                opacity: featuresTitleOpacity,
                transform: `translateY(${featuresTitleTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
            >
              Features built with
            </h1>
            <h1 
              className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}
              style={{
                opacity: featuresTitleOpacity,
                transform: `translateY(${featuresTitleTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
            >
              you in mind.
            </h1>
          </div>
          <div
            className="flex flex-col"
            style={{ 
              height: '700px', 
              gap: '32px',
              opacity: featuresBoxesOpacity,
              transform: `translateY(${featuresBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
            }}
            onMouseLeave={() => setHoveredBentoBox(null)}
          >
            {/* Row 1 */}
            <div
              className="flex"
              style={{
                gap: '32px',
                flex: hoveredBentoBox === 0 || hoveredBentoBox === 1 ? '4 1 0' : hoveredBentoBox === 2 || hoveredBentoBox === 3 ? '1 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {/* Box 0 */}
              <div
                className="rounded-2xl cursor-pointer relative overflow-hidden"
                style={{
                  flex: hoveredBentoBox === 0 ? '10 1 0' : hoveredBentoBox !== null ? '2 1 0' : '7 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBentoBox !== null && hoveredBentoBox !== 0 ? 0.5 : 1,
                  background: `
                    radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                    radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                    radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                    radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                    radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                    radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                    radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                  `,
                  backgroundSize: '200% 200%',
                  backgroundPosition: '0% 0%',
                }}
                onMouseEnter={() => setHoveredBentoBox(0)}
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
                {/* Content wrapper - fades out when other box is hovered */}
                <div
                  style={{
                    opacity: hoveredBentoBox !== null && hoveredBentoBox !== 0 ? 0 : 1,
                    transition: 'opacity 150ms ease-out',
                    pointerEvents: hoveredBentoBox !== null && hoveredBentoBox !== 0 ? 'none' : 'auto',
                  }}
                >
                  {/* Title */}
                  <div 
                    className="absolute bottom-6 left-6"
                    style={{ 
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    <span className="text-lg font-semibold text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Clinical Notes
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="absolute top-6 right-6 text-white text-right" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="mb-3">
                      <h3 className="font-bold text-sm mb-1">Recent Notes</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium">Patient #2847</p>
                        <p className="text-xs opacity-80">Today, 10:30 AM</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Patient #1923</p>
                        <p className="text-xs opacity-80">Today, 9:15 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Box 1 */}
              <div
                className="rounded-2xl cursor-pointer relative overflow-hidden"
                style={{
                  flex: hoveredBentoBox === 1 ? '10 1 0' : hoveredBentoBox !== null ? '2 1 0' : '5 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBentoBox !== null && hoveredBentoBox !== 1 ? 0.5 : 1,
                  background: `
                    radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                    radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                    radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                    radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                    radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                    radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                    radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                  `,
                  backgroundSize: '200% 200%',
                  backgroundPosition: '100% 0%',
                }}
                onMouseEnter={() => setHoveredBentoBox(1)}
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
                {/* Content wrapper - fades out when other box is hovered */}
                <div
                  style={{
                    opacity: hoveredBentoBox !== null && hoveredBentoBox !== 1 ? 0 : 1,
                    transition: 'opacity 150ms ease-out',
                    pointerEvents: hoveredBentoBox !== null && hoveredBentoBox !== 1 ? 'none' : 'auto',
                  }}
                >
                  {/* Title */}
                  <div 
                    className="absolute bottom-6 left-6"
                    style={{ 
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    <span className="text-lg font-semibold text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Lab Results
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="absolute top-6 left-6 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="mb-4">
                      <p className="text-xs font-bold">7 New Results</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold">#4521</p>
                        <p className="text-xs opacity-80">Blood</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">#3892</p>
                        <p className="text-xs opacity-80">X-Ray</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div
              className="flex"
              style={{
                gap: '32px',
                flex: hoveredBentoBox === 2 || hoveredBentoBox === 3 ? '4 1 0' : hoveredBentoBox === 0 || hoveredBentoBox === 1 ? '1 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {/* Box 2 */}
              <div
                className="rounded-2xl cursor-pointer relative overflow-hidden"
                style={{
                  flex: hoveredBentoBox === 2 ? '10 1 0' : hoveredBentoBox !== null ? '2 1 0' : '5 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBentoBox !== null && hoveredBentoBox !== 2 ? 0.5 : 1,
                  background: `
                    radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                    radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                    radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                    radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                    radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                    radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                    radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                  `,
                  backgroundSize: '200% 200%',
                  backgroundPosition: '0% 100%',
                }}
                onMouseEnter={() => setHoveredBentoBox(2)}
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
                {/* Content wrapper - fades out when other box is hovered */}
                <div
                  style={{
                    opacity: hoveredBentoBox !== null && hoveredBentoBox !== 2 ? 0 : 1,
                    transition: 'opacity 150ms ease-out',
                    pointerEvents: hoveredBentoBox !== null && hoveredBentoBox !== 2 ? 'none' : 'auto',
                  }}
                >
                  {/* Title */}
                  <div 
                    className="absolute bottom-6 left-6"
                    style={{ 
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    <span className="text-lg font-semibold text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Prescriptions
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="absolute top-6 right-6 text-white text-right" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="mb-3">
                      <h3 className="font-bold text-sm">Active Rx</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold">Metformin</p>
                        <p className="text-xs opacity-80">2x daily</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Lisinopril</p>
                        <p className="text-xs opacity-80">1x daily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Box 3 */}
              <div
                className="rounded-2xl cursor-pointer relative overflow-hidden"
                style={{
                  flex: hoveredBentoBox === 3 ? '10 1 0' : hoveredBentoBox !== null ? '2 1 0' : '7 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBentoBox !== null && hoveredBentoBox !== 3 ? 0.5 : 1,
                  background: `
                    radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                    radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                    radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                    radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                    radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                    radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                    radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                  `,
                  backgroundSize: '200% 200%',
                  backgroundPosition: '100% 100%',
                }}
                onMouseEnter={() => setHoveredBentoBox(3)}
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
                {/* Content wrapper - fades out when other box is hovered */}
                <div
                  style={{
                    opacity: hoveredBentoBox !== null && hoveredBentoBox !== 3 ? 0 : 1,
                    transition: 'opacity 150ms ease-out',
                    pointerEvents: hoveredBentoBox !== null && hoveredBentoBox !== 3 ? 'none' : 'auto',
                  }}
                >
                  {/* Title */}
                  <div 
                    className="absolute bottom-6 left-6"
                    style={{ 
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    <span className="text-lg font-semibold text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Appointments
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="absolute top-6 left-6 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="mb-3">
                      <h3 className="font-bold text-sm">Today</h3>
                      <p className="text-xs opacity-90">4 appts</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium">9:00 AM</p>
                        <p className="text-xs opacity-80">Patient #2847</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">11:30 AM</p>
                        <p className="text-xs opacity-80">Patient #1923</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">2:00 PM</p>
                        <p className="text-xs opacity-80">Patient #4521</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Horizontal line between sections */}
      <div className="w-screen border-t border-[#E6E6E6] relative left-1/2 -translate-x-1/2" />

      {/* Outer wrapper with continuous vertical borders */}
      <div className="border-l border-r border-[#E6E6E6] max-w-[1600px] mx-auto">
        {/* Fourth Section - Large Rectangle Box */}
        <div ref={knowsSectionRef} className="min-h-screen relative z-10 w-full">
          <div className="max-w-[1800px] mx-auto px-8 py-16 pt-32">
          {/* Title */}
          <div className="text-left mb-12">
            <h1 
              className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}
              style={{
                opacity: knowsTitleOpacity,
                transform: `translateY(${knowsTitleTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
            >
              Knows you before
            </h1>
            <h1 
              className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}
              style={{
                opacity: knowsTitleOpacity,
                transform: `translateY(${knowsTitleTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
            >
              you know you.
            </h1>
          </div>
          <div 
            className="flex gap-8"
            style={{ 
              height: '600px',
              opacity: knowsBoxesOpacity,
              transform: `translateY(${knowsBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
            }}
            onMouseLeave={() => setHoveredKnowsBox(null)}
          >
            <div
              className="rounded-2xl cursor-pointer relative"
              style={{
                flex: hoveredKnowsBox === 0 ? '10 1 0' : hoveredKnowsBox !== null ? '2 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease, background 0.1s ease-out',
                opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 ? 0.5 : 1,
                background: `
                  radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                  radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                  radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                  radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                  radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                  radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                  radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                `,
              }}
              onMouseEnter={() => setHoveredKnowsBox(0)}
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
              {/* White UI Box */}
              <div 
                className="absolute top-8 right-8 bg-white rounded-xl p-6"
                style={{ 
                  opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 ? 0 : 1,
                  pointerEvents: hoveredKnowsBox === 0 ? 'auto' : 'none',
                  width: hoveredKnowsBox === 0 ? '560px' : '320px',
                  height: hoveredKnowsBox === 0 ? 'calc(100% - 64px)' : '360px',
                  overflowY: hoveredKnowsBox === 0 ? 'auto' : 'hidden',
                  userSelect: hoveredKnowsBox === 0 ? 'auto' : 'none',
                  cursor: 'default',
                  touchAction: hoveredKnowsBox === 0 ? 'auto' : 'none',
                  WebkitUserSelect: hoveredKnowsBox === 0 ? 'auto' : 'none',
                  MozUserSelect: hoveredKnowsBox === 0 ? 'auto' : 'none',
                  msUserSelect: hoveredKnowsBox === 0 ? 'text' : 'none',
                  transition: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 
                    ? 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 80ms ease-out'
                    : 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease-in'
                }}
                onMouseDown={(e) => {
                  if (hoveredKnowsBox !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onClick={(e) => {
                  if (hoveredKnowsBox !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onMouseEnter={(e) => {
                  if (hoveredKnowsBox !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onMouseMove={(e) => {
                  if (hoveredKnowsBox !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
              >
                {/* Notification Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '16px' : '14px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                    Inbox Summary
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-xs font-medium text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>3 new</span>
                  </div>
                </div>

                {/* Email Item */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '14px' : '12px', wordBreak: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>Dr. Sarah Chen</span>
                        <span className={`text-gray-500 flex-shrink-0`} style={{ fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>2h ago</span>
                      </div>
                      <p className={`text-gray-600 mb-2 break-words ${hoveredKnowsBox === 0 ? '' : 'line-clamp-2'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', wordWrap: 'break-word', overflowWrap: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                        Patient follow-up request for post-op consultation
                      </p>
                      {hoveredKnowsBox === 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-50">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Summary:</p>
                          <p className="text-xs text-gray-600 leading-relaxed break-words" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            Patient John Doe (ID: 2847) requests follow-up appointment after knee surgery performed last week. Reports mild discomfort but overall recovery progressing well. Suggested time: Next Tuesday 2pm.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call Item */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '14px' : '12px', wordBreak: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>Hospital Admin</span>
                        <span className={`text-gray-500 flex-shrink-0`} style={{ fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>4h ago</span>
                      </div>
                      <p className={`text-gray-600 mb-2 break-words ${hoveredKnowsBox === 0 ? '' : 'line-clamp-2'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', wordWrap: 'break-word', overflowWrap: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                        Urgent: Schedule change for tomorrow&apos;s surgery
                      </p>
                      {hoveredKnowsBox === 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-50">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Call Summary:</p>
                          <p className="text-xs text-gray-600 leading-relaxed break-words" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            Operating room 3 unavailable due to equipment maintenance. Surgery rescheduled from 8am to 10am. Patient notified. Anesthesia team confirmed availability.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Item */}
                <div className={hoveredKnowsBox === 0 ? "mb-0" : "mb-3"}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '14px' : '12px', wordBreak: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>Lab Results</span>
                        <span className={`text-gray-500 flex-shrink-0`} style={{ fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>6h ago</span>
                      </div>
                      <p className={`text-gray-600 break-words ${hoveredKnowsBox === 0 ? 'mb-2' : 'mb-0 line-clamp-2'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 0 ? '13px' : '12px', wordWrap: 'break-word', overflowWrap: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                        New test results available for review - Patient ID: 2847
                      </p>
                      {hoveredKnowsBox === 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-50">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Results Summary:</p>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2 break-words" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            Complete Blood Count (CBC) and Comprehensive Metabolic Panel (CMP) completed. All values within normal ranges. Cholesterol panel shows slight elevation - recommend dietary consultation.
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Normal</span>
                            <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Review</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="absolute bottom-8 left-8 flex flex-col gap-2"
                style={{ 
                  opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 ? 0 : 1,
                  pointerEvents: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 ? 'none' : 'auto',
                  transition: hoveredKnowsBox !== null && hoveredKnowsBox !== 0 
                    ? 'opacity 80ms ease-out'
                    : 'opacity 400ms ease-in 200ms'
                }}
              >
                <span className="text-xl font-medium text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Scheduled Updates
                </span>
                <p className="text-base font-normal text-white/90 tracking-[-0.01em] max-w-md" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Doe summarizes your incoming messages and emails at a specific time so all you have to do it verify.
                </p>
              </div>
            </div>
            <div
              className="rounded-2xl cursor-pointer relative"
              style={{
                flex: hoveredKnowsBox === 1 ? '10 1 0' : hoveredKnowsBox !== null ? '2 1 0' : '1 1 0',
                transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease, background 0.1s ease-out',
                opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 ? 0.5 : 1,
                background: `
                  radial-gradient(ellipse 90% 70% at 90% 10%, #E7A944 0%, rgba(231, 169, 68, 0.6) 30%, transparent 60%),
                  radial-gradient(ellipse 75% 55% at 80% 25%, #D49D4F 0%, rgba(212, 157, 79, 0.5) 40%, transparent 70%),
                  radial-gradient(ellipse 70% 60% at 12% 12%, #BF593D 0%, rgba(191, 89, 61, 0.6) 35%, transparent 65%),
                  radial-gradient(ellipse 55% 45% at 48% 38%, #D2774C 0%, rgba(210, 119, 76, 0.4) 50%, transparent 75%),
                  radial-gradient(ellipse 65% 55% at 50% 52%, #7B5C4B 0%, rgba(123, 92, 75, 0.5) 45%, transparent 80%),
                  radial-gradient(ellipse 75% 65% at 88% 88%, #7D6B4E 0%, #6D5B41 60%, rgba(109, 91, 65, 0.3) 100%),
                  radial-gradient(ellipse 85% 75% at 10% 92%, #1E343A 0%, #264349 40%, rgba(38, 67, 73, 0.4) 70%, transparent 100%)
                `,
              }}
              onMouseEnter={() => setHoveredKnowsBox(1)}
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
              {/* Centered Rectangle UI Box */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl flex flex-col"
                style={{ 
                  opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 ? 0 : 1,
                  pointerEvents: hoveredKnowsBox === 1 ? 'auto' : 'none',
                  width: hoveredKnowsBox === 1 ? '520px' : '380px',
                  height: hoveredKnowsBox === 1 ? '420px' : '300px',
                  top: hoveredKnowsBox === 1 ? 'calc(50% - 250px)' : 'calc(50% - 180px)',
                  maxHeight: 'calc(100% - 200px)',
                  overflowY: hoveredKnowsBox === 1 ? 'auto' : 'hidden',
                  userSelect: hoveredKnowsBox === 1 ? 'auto' : 'none',
                  cursor: 'default',
                  touchAction: hoveredKnowsBox === 1 ? 'auto' : 'none',
                  WebkitUserSelect: hoveredKnowsBox === 1 ? 'auto' : 'none',
                  MozUserSelect: hoveredKnowsBox === 1 ? 'auto' : 'none',
                  msUserSelect: hoveredKnowsBox === 1 ? 'text' : 'none',
                  transition: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 
                    ? 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1), top 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 80ms ease-out'
                    : 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1), top 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease-in',
                  padding: '32px'
                }}
                onMouseDown={(e) => {
                  if (hoveredKnowsBox !== 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onClick={(e) => {
                  if (hoveredKnowsBox !== 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onMouseEnter={(e) => {
                  if (hoveredKnowsBox !== 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onMouseMove={(e) => {
                  if (hoveredKnowsBox !== 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
              >
                {/* Patient Header */}
                <div className="text-center mb-6 flex-shrink-0">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-3">
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '20px' : '18px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                    John Doe
                  </h3>
                  <p className={`text-gray-500`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '14px' : '13px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                    Age 52 • Patient ID: 2847
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Condition</p>
                    <p className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '13px' : '12px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                      Post-op Recovery
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Medications</p>
                    <p className={`font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '13px' : '12px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                      Lisinopril 10mg
                    </p>
                  </div>
                </div>

                {/* Status Section */}
                <div className="border-t border-gray-100 pt-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '14px' : '13px', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                      Status
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Stable
                    </span>
                  </div>
                  <p className={`text-gray-600 break-words ${hoveredKnowsBox === 1 ? '' : 'line-clamp-2'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: hoveredKnowsBox === 1 ? '13px' : '12px', wordWrap: 'break-word', overflowWrap: 'break-word', transition: 'font-size 300ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}>
                    Recovery progressing normally. Wound healing well, no signs of infection.
                  </p>
                  {hoveredKnowsBox === 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>AI Insights:</p>
                      <p className="text-xs text-gray-600 leading-relaxed break-words mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        Continue current PT protocol. Monitor for DVT signs. Consider follow-up imaging if pain persists beyond week 2.
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>On Track</span>
                        <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Monitor</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className="absolute bottom-8 left-8 flex flex-col gap-2"
                style={{ 
                  opacity: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 ? 0 : 1,
                  pointerEvents: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 ? 'none' : 'auto',
                  transition: hoveredKnowsBox !== null && hoveredKnowsBox !== 1 
                    ? 'opacity 80ms ease-out'
                    : 'opacity 400ms ease-in 200ms'
                }}
              >
                <span className="text-xl font-medium text-white tracking-[-0.02em] px-3 py-1.5 border border-white rounded-full inline-block w-fit" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Patient Context
                </span>
                <p className="text-base font-normal text-white/90 tracking-[-0.01em] max-w-md" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Doe surfaces patient history, medications, and clinical insights<br />before you even ask.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Horizontal line between sections */}
      <div className="w-screen border-t border-[#E6E6E6] relative left-1/2 -translate-x-1/2" />

      {/* Outer wrapper with continuous vertical borders */}
      <div className="border-l border-r border-[#E6E6E6] max-w-[1800px] mx-auto">
        {/* Fifth Section - Three Square Boxes */}
        <div ref={buildSectionRef} className="min-h-screen relative z-10 w-full">
          <div className="max-w-[1800px] mx-auto px-8 py-16 pt-32">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 
                className={`text-4xl font-normal text-gray-900 tracking-tight ${lora.className}`}
                style={{
                  opacity: buildTitleOpacity,
                  transform: `translateY(${buildTitleTranslateY}px)`,
                  transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
                }}
              >
                Build with us.
              </h1>
            </div>
            {/* Three square boxes */}
            <div 
              className="flex gap-8"
              style={{ 
                height: '600px',
                opacity: buildBoxesOpacity,
                transform: `translateY(${buildBoxesTranslateY}px)`,
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
              }}
              onMouseLeave={() => setHoveredBuildBox(null)}
            >
              <BuildWithUsBentoSurface
                meshId="buildScroll0"
                variant={0}
                style={{
                  flex: hoveredBuildBox === 0 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBuildBox !== null && hoveredBuildBox !== 0 ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredBuildBox(0)}
              />
              <BuildWithUsBentoSurface
                meshId="buildScroll1"
                variant={1}
                style={{
                  flex: hoveredBuildBox === 1 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBuildBox !== null && hoveredBuildBox !== 1 ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredBuildBox(1)}
              />
              <BuildWithUsBentoSurface
                meshId="buildScroll2"
                variant={2}
                style={{
                  flex: hoveredBuildBox === 2 ? '10 1 0' : hoveredBuildBox !== null ? '2 1 0' : '1 1 0',
                  transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease',
                  opacity: hoveredBuildBox !== null && hoveredBuildBox !== 2 ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredBuildBox(2)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 w-screen left-1/2 -translate-x-1/2 relative px-8">
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

            {/* Navigation Pages 2x2 Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 ml-auto">
              <a href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Features
              </a>
              <a href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Security
              </a>
              <a href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Students
              </a>
              <a href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Company
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
