"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { useDisablePinchGestures } from "@/lib/useDisablePinchGestures";
import { Inter, Lora } from "next/font/google";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

const narrowHorizontalInset =
  "iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))]";

const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[15px] py-[8px] text-[clamp(0.95rem,3.2vw,1.15rem)] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
const slideCaptionBody =
  "w-full min-w-0 text-left text-[clamp(0.95rem,3.4vw,1.05rem)] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92]";

type FeatureSection = {
  id: string;
  pill: string;
  headline: readonly [string, string];
  caption: string;
  gradient: string;
  gridId: string;
  ui: ReactNode;
};

const FEATURE_SECTIONS: readonly FeatureSection[] = [
  {
    id: "inbox",
    pill: "Clinical Inbox",
    headline: ["Verify,", "don't babysit."],
    caption:
      "Summaries and routing you can sign off in seconds—every message tied to identity, audit, and escalation.",
    gradient:
      "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
    gridId: "feat-grid-inbox",
    ui: (
      <div className={`w-[min(88%,19rem)] rounded-xl bg-white shadow-lg p-4 ${inter.className}`}>
        {[
          { tag: "Triage", subject: "Dizziness after new Rx", state: "Draft ready" },
          { tag: "Routing", subject: "Cardio NP — Tue 9:20", state: "Needs sign-off" },
          { tag: "Escalation", subject: "Nursing handoff note", state: "Verified" },
        ].map((row) => (
          <div
            key={row.subject}
            className="mb-2 last:mb-0 rounded-lg border border-gray-100 bg-gray-50/90 px-3 py-2.5"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#1E343A]/70">
                {row.tag}
              </span>
              <span className="text-[10px] font-medium text-gray-500">{row.state}</span>
            </div>
            <p className="text-xs font-medium leading-snug text-gray-900">{row.subject}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "finance",
    pill: "Finance",
    headline: ["Packets with", "citations."],
    caption:
      "Prior-auth and payer drafts that point back to the chart—structured review, not another PDF scavenger hunt.",
    gradient:
      "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
    gridId: "feat-grid-finance",
    ui: (
      <div className={`w-[min(90%,20rem)] rounded-xl bg-white shadow-lg p-4 ${inter.className}`}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Prior auth · draft
        </p>
        <p className="text-sm font-medium leading-snug text-gray-900">
          Medical necessity — metformin titration, A1c 8.2%
        </p>
        <ul className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-[11px] leading-snug text-gray-600">
          {["Lab 03/12 · cited", "Progress note · cited", "Payer policy §4.2 · matched"].map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-[#D2774C]/80" aria-hidden />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "brain",
    pill: "Brain",
    headline: ["Bedside", "reasoning."],
    caption:
      "Frontier models with guardrails that survive nursing handoffs and attending sign-off—not demo-day prompts.",
    gradient:
      "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
    gridId: "feat-grid-brain",
    ui: (
      <div className={`w-[min(88%,19rem)] rounded-xl bg-white shadow-lg p-4 ${inter.className}`}>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:180ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:360ms]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">
            Reasoning
          </span>
        </div>
        <ul className="space-y-2 text-[11px] font-light leading-snug text-gray-600">
          {[
            "Cross-check meds + dizziness cues",
            "Flag orthostatic risk · low confidence",
            "Suggest cardio follow-up window",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-gray-400" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "academics",
    pill: "Academics",
    headline: ["Same graph,", "new cohort."],
    caption:
      "Spaced practice and simulations that cite sources—wired to the hospital graph students inherit as residents.",
    gradient:
      "linear-gradient(152deg, #1a2e34 0%, #6b442f 48%, #d4893f 76%, #e8b04d 100%)",
    gridId: "feat-grid-academics",
    ui: (
      <div className={`w-[min(88%,18rem)] rounded-xl bg-white/95 shadow-lg p-5 ${inter.className}`}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Spaced prompt
        </p>
        <p className="text-sm font-medium leading-snug text-gray-900">
          What labs would you order before titrating metformin?
        </p>
        <p className="mt-3 text-[11px] leading-snug text-gray-500">
          Cites: UpToDate · your program objectives
        </p>
      </div>
    ),
  },
];

function appViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

function FeatureVisualPanel({
  section,
  active,
}: {
  section: FeatureSection;
  active: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.06] shadow-[0_20px_56px_rgba(0,0,0,0.14)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        active ? "scale-100 opacity-100" : "scale-[0.97] opacity-[0.88]"
      }`}
      style={{
        aspectRatio: "1 / 1",
        maxHeight: "min(72vw, 24rem)",
        marginInline: "auto",
      }}
    >
      <div className="absolute inset-0" style={{ background: section.gradient }} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRAIN_BG,
          backgroundSize: "200px 200px",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 700"
          aria-hidden
        >
          <defs>
            <pattern
              id={section.gridId}
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <path
                d="M 0 0 L 60 0 M 0 0 L 0 60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${section.gridId})`} />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6">{section.ui}</div>
      <div className="absolute bottom-6 left-5 right-5 z-[5] flex flex-col items-start gap-2.5 iphone-page:bottom-7">
        <span className={slideCaptionBadge}>{section.pill}</span>
        <p className={slideCaptionBody} style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          {section.caption}
        </p>
      </div>
    </div>
  );
}

function FeatureScrollSection({
  section,
  index,
  onActive,
}: {
  section: FeatureSection;
  index: number;
  onActive: (index: number | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.42;
        setRevealed(visible);
        if (visible) onActive(index);
        else if (entry.boundingClientRect.top > 0) onActive(null);
      },
      { threshold: [0.2, 0.42, 0.65] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onActive]);

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="relative w-full"
      style={{ minHeight: "min(128dvh, 920px)" }}
      aria-label={section.pill}
    >
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-center py-[max(5rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-8">
        <div className={`px-4 ${narrowHorizontalInset}`}>
          <FeatureVisualPanel section={section} active={revealed} />
          <div
            className={`mt-8 iphone-page:mt-9 transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <h2
              className={`flex flex-col gap-0.5 font-normal text-gray-900 tracking-tight leading-[1.06] ${lora.className}`}
            >
              <span className="block text-[clamp(2.15rem,9.2vw,3.35rem)] iphone-page:text-[clamp(1.65rem,6.8vw,3.35rem)]">
                {section.headline[0]}
              </span>
              <span className="block text-[clamp(2.15rem,9.2vw,3.35rem)] iphone-page:text-[clamp(1.65rem,6.8vw,3.35rem)]">
                {section.headline[1]}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  useDisablePinchGestures();

  const [viewportWidth, setViewportWidth] = useState(1200);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    const measure = () => {
      const { width, height } = appViewportPx();
      setViewportWidth(width);
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
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
  }, []);

  const handleActive = useCallback((index: number | null) => {
    if (index === null) return;
    if (activeIndexRef.current === index) return;
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const rootZoom = doeforvcRootZoom(viewportWidth);
  const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;

  return (
    <>
      <DoeIphoneSiteNav />

      <div
        className="relative z-0 min-h-[100dvh] overflow-x-hidden doeforvc-iphone-root"
        style={{
          backgroundColor: "#F7F6F3",
          ...(applyRootZoom ? { zoom: rootZoom } : {}),
        }}
        suppressHydrationWarning
      >
        {/* Progress dots — matches workflow carousel */}
        <div
          className="pointer-events-none fixed right-[max(0.85rem,env(safe-area-inset-right,0px))] top-1/2 z-20 flex -translate-y-1/2 flex-col gap-[7px] items-center"
          aria-hidden
        >
          {FEATURE_SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === i ? "h-6 w-2 bg-[#1E343A]/75" : "h-2 w-2 bg-[#1E343A]/25"
              }`}
            />
          ))}
        </div>

        <main className="relative w-full">
          {/* Intro — same headline band as home workflow section */}
          <header
            className={`relative z-10 flex flex-col justify-center px-4 pt-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.25rem))] pb-10 iphone-page:pb-12 ${narrowHorizontalInset}`}
          >
            <div className="mx-auto w-full max-w-full text-center">
              <h1
                className={`flex flex-col items-center gap-2 font-normal text-gray-900 tracking-tight ${lora.className}`}
              >
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  Agents for every
                </span>
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  workflow.
                </span>
              </h1>
              <p
                className={`mx-auto mt-5 max-w-[20rem] text-[clamp(1.05rem,3.8vw,1.2rem)] font-medium leading-[1.45] tracking-tight text-gray-600 ${inter.className}`}
              >
                Scroll to explore inbox, finance, brain, and academics—built on one clinical graph.
              </p>
            </div>
          </header>

          <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

          {FEATURE_SECTIONS.map((section, index) => (
            <FeatureScrollSection
              key={section.id}
              section={section}
              index={index}
              onActive={handleActive}
            />
          ))}

          {/* Closing band — echoes vertical bento headline */}
          <section
            className={`relative z-10 px-4 py-16 iphone-page:py-20 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] ${narrowHorizontalInset}`}
          >
            <h2
              className={`flex flex-col items-center gap-1 text-center text-gray-900 w-full font-normal tracking-tight leading-[1.06] ${lora.className}`}
            >
              <span className="block text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                Only high-quality
              </span>
              <span className="block text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                patient care.
              </span>
            </h2>
          </section>
        </main>
      </div>
    </>
  );
}
