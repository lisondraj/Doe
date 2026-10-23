"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, type ReactNode, memo, useEffect, useRef, useState } from "react";

import { SkipIcon } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthProductArtboard, type DoeHealthProductTab } from "@/components/doehealth-product/DoeHealthProductHome";
import type { EarlyPreviewProductFilm } from "@/components/earlypreview/EarlyPreviewProductFilmFrame";
import type { ProductRailKey } from "@/components/earlypreview/EarlyPreviewProductShell";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_PRODUCT_HEADLINE as HEADLINE,
  EARLYPREVIEW_PRODUCT_SLIDES as SLIDES,
  type EarlyPreviewProductSlideId,
} from "@/lib/earlypreview/earlypreview-product-copy";
import { useNavReveal } from "@/lib/earlypreview/use-nav-reveal";
import { dmSans, p22Mackinac } from "@/lib/home/fonts";

const EarlyPreviewFilmShell = dynamic(
  () => import("@/components/earlypreview/EarlyPreviewAuthShell").then((mod) => mod.EarlyPreviewFilmShell),
  { ssr: false },
);
const EarlyPreviewAuthShell = dynamic(
  () => import("@/components/earlypreview/EarlyPreviewAuthShell").then((mod) => mod.EarlyPreviewAuthShell),
  { ssr: false },
);

/** The /doehealthproduct artboard and the films' frame, in their own pixels. */
const ARTBOARD = { w: 1440, h: 900 };

type Align = "start" | "center" | "end";
/** The part of the source a box may show, in the source's pixels, and which edge it holds to when the box is narrower or shorter. */
type Crop = { x: number; y: number; w: number; h: number; ax?: Align; ay?: Align };

/**
 * Where the UI sits in its box: tucked into a corner (`br` sits in the bottom right and runs off those two edges) or
 * along one edge, inset from the other three (`b` runs off the bottom, `t` off the top).
 */
type Sit = "br" | "bl" | "tr" | "tl" | "b" | "t" | "full";

type Visual =
  | { kind: "app"; tab: DoeHealthProductTab; menu?: boolean; crop: Crop; sit: Sit }
  | { kind: "film"; film: EarlyPreviewProductFilm; frame: number; active: ProductRailKey; anchor?: "start"; focus?: { x: number; y: number; w: number; h: number }; inset?: { x: number; y: number }; crop: Crop; sit: Sit }
  | { kind: "shell"; crop: Crop; sit: Sit };

/** The same corner every app box shows, so the film boxes size and sit exactly like the rest. */
/** The film pages keep the margin off the rail and the top that the other boxes' pages have. */
const PAGE_INSET = { x: 34, y: 28 };
const CORNER: Crop = { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" };

/**
 * What each box shows: a corner of the whole product (outer and inner shell) or one component on its own. The crop's
 * held edges are the ones that show inside the box; the others run off its sides.
 */
const VISUALS: Record<EarlyPreviewProductSlideId, Visual> = {
  index: { kind: "app", tab: "integrations", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  interface: { kind: "app", tab: "call", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  auth: { kind: "shell", crop: { x: 0, y: 0, w: 960, h: 668, ax: "start", ay: "start" }, sit: "br" },
  permissions: { kind: "app", tab: "permissions", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  insurance: { kind: "film", film: "communication", frame: 575, active: "forms", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  forms: { kind: "app", tab: "forms", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  followUp: { kind: "film", film: "coordinate", frame: 300, active: "referrals", anchor: "start", crop: CORNER, sit: "br" },
  multiSite: { kind: "app", tab: "integrations", menu: true, crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  clinics: { kind: "app", tab: "referrals", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  departments: { kind: "film", film: "permissions", frame: 200, active: "permissions", focus: { x: 240, y: 58, w: 1497, h: 964 }, inset: PAGE_INSET, crop: CORNER, sit: "br" },
  directory: { kind: "film", film: "network", frame: 440, active: "providers", focus: { x: 0, y: 52, w: 1600, h: 1028 }, inset: PAGE_INSET, crop: CORNER, sit: "br" },
  payments: { kind: "app", tab: "payments", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
};

/** Where the source's edge lands in the box, held inside the source so the box never shows past it. */
function place(box: number, from: number, size: number, total: number, scale: number, align: Align) {
  const at =
    align === "start" ? -from * scale : align === "end" ? box - (from + size) * scale : box / 2 - (from + size / 2) * scale;
  return Math.min(0, Math.max(box - total * scale, at));
}

/** A source scaled to cover its box from the crop's rectangle. It is a picture, so nothing in it takes focus or clicks. */
function CropView({ source, crop, children }: { source: { w: number; h: number }; crop: Crop; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.inert = true;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let style: CSSProperties = { width: source.w, height: source.h, visibility: "hidden" };
  if (box) {
    const scale = Math.max(box.w / crop.w, box.h / crop.h);
    const x = place(box.w, crop.x, crop.w, source.w, scale, crop.ax ?? "center");
    const y = place(box.h, crop.y, crop.h, source.h, scale, crop.ay ?? "center");
    style = { width: source.w, height: source.h, transform: `translate(${x}px, ${y}px) scale(${scale})` };
  }
  return (
    <div ref={ref} className="earlypreview-product__crop" aria-hidden>
      <div className="earlypreview-product__source" style={style}>
        {children}
      </div>
    </div>
  );
}

const SlideVisual = memo(function SlideVisual({ visual }: { visual: Visual }) {
  if (visual.kind === "film") {
    return (
      <CropView source={ARTBOARD} crop={visual.crop}>
        <EarlyPreviewFilmShell film={visual.film} frame={visual.frame} active={visual.active} anchor={visual.anchor} focus={visual.focus} inset={visual.inset} />
      </CropView>
    );
  }
  if (visual.kind === "shell") {
    return (
      <CropView source={ARTBOARD} crop={visual.crop}>
        <EarlyPreviewAuthShell />
      </CropView>
    );
  }
  return (
    <CropView source={ARTBOARD} crop={visual.crop}>
      <div className="doehealth-product-page" style={{ width: ARTBOARD.w, height: ARTBOARD.h }}>
        <DoeHealthProductArtboard
          initialTab={visual.tab}
          initialAccountMenuOpen={visual.menu}
          accountMenuAt={visual.menu ? "top" : "bottom"}
          mountAll={false}
        />
      </div>
    </CropView>
  );
});

/* ------------------------------------------------------------------ timing */

const HEAD = [0.25, 1.0] as const;
const SLIDES_IN = [0.85, 1.6] as const;
/** Desktop: the title, once risen, fades away over the start of the pan. It keeps its place, so the boxes stay put. */
const TITLE_OUT = [1.5, 2.3] as const;
/** How much of the wave's strength it gives up as the title rises: full at rest, this much fainter once it has risen. */
const WAVE_FADE = 0.72;
/** Progress the carousel takes per box as it pans right to left. */
const PER_SLIDE = 0.5;
const PAN = [1.6, 1.6 + PER_SLIDE * (SLIDES.length - 1)] as const;
/** The last box holds a moment before the lock lets go. */
const END = PAN[1] + 0.35;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (p: number, range: readonly [number, number]) => smooth(ramp(p, range));
/** The `t` at which `smooth(t)` is `s`, so a box can be brought to the front exactly. */
const unsmooth = (s: number) => 0.5 - Math.sin(Math.asin(1 - 2 * s) / 3);
/** The progress at which each box sits in front: the pan's start for the first, the rest spread evenly along it. */
const BOX_AT = SLIDES.map((_, i) => PAN[0] + (PAN[1] - PAN[0]) * unsmooth(i / (SLIDES.length - 1)));

/**
 * One tone map for every product screen: each pixel keeps its lightness and takes the matching shade of the section's
 * beige (darkest = the title's deep beige, lightest = cream), so the same colour is the same shade in every box.
 */
function BeigeTone() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="earlypreview-beige" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.3686 0.3843 0.4 0.4294 0.4588 0.4902 0.5216 0.5569 0.5922 0.6275 0.6627 0.698 0.7333 0.7647 0.7961 0.8235 0.851 0.8765 0.902 0.9412 0.9804" />
            <feFuncG type="table" tableValues="0.3059 0.3216 0.3373 0.3667 0.3961 0.4275 0.4588 0.4941 0.5294 0.5667 0.6039 0.6412 0.6784 0.7137 0.749 0.7784 0.8078 0.8353 0.8627 0.9137 0.9647" />
            <feFuncB type="table" tableValues="0.2078 0.2216 0.2353 0.2627 0.2902 0.3216 0.3529 0.3784 0.4039 0.4392 0.4745 0.5118 0.549 0.5863 0.6235 0.6588 0.6941 0.7275 0.7608 0.8392 0.9137" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

/**
 * iPhone: one line per box along the bottom, filling as the row pans past it; a tap brings that box to the front.
 * The lines run across the page margins along the bottom, as in the market section, with the skip above them. Hidden on the desktop, where the boxes are one row to scroll.
 */
function ProductNav({ p, goTo }: { p: number; goTo: (target: number) => void }) {
  const last = SLIDES.length - 1;
  return (
    <nav className={`earlypreview-product__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Product screens">
      {SLIDES.map((slide, i) => {
        const at = BOX_AT[i];
        const to = i < last ? BOX_AT[i + 1] : at;
        const live = (i === 0 || p >= at) && (i === last || p < to);
        const fill = i < last ? ramp(p, [at, to]) : p >= at ? 1 : 0;
        return (
          <button
            key={slide.id}
            type="button"
            className={`earlypreview-product__nav-item${live ? " is-live" : ""}`}
            style={vars({ "--f": fill })}
            aria-label={slide.title}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(at)}
          >
            <span className="earlypreview-product__nav-line" aria-hidden />
          </button>
        );
      })}
    </nav>
  );
}

/** How far the title has to come down from its place at the top to sit in the middle of the section. */
function useCenterOffset(headRef: React.RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const head = headRef.current;
    const section = head?.parentElement;
    if (!head || !section) return undefined;
    const measure = () => setOffset(section.clientHeight / 2 - (head.offsetTop + head.offsetHeight / 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(head);
    return () => observer.disconnect();
  }, [headRef]);
  return offset;
}

/** How far the row of boxes runs past the page's inset, so the pan ends on the last box. */
function usePanDistance(trackRef: React.RefObject<HTMLOListElement | null>) {
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    const stage = track?.parentElement;
    if (!track || !stage) return undefined;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - stage.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);
  return distance;
}

/**
 * Which boxes are in the stage or one stage away from it. A box that has panned well out of view unmounts its
 * product (its timers and animation frames stop with it), the way the market section's finished screens leave the
 * compositor. A box comes back in before it reaches the edge, so nothing pops in on screen.
 */
function useBoxesInStage(stageRef: React.RefObject<HTMLElement | null>, trackRef: React.RefObject<HTMLOListElement | null>) {
  const [inStage, setInStage] = useState<Record<number, boolean>>({});
  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        setInStage((prev) => {
          let next = prev;
          for (const entry of entries) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (!!next[i] === entry.isIntersecting) continue;
            if (next === prev) next = { ...prev };
            next[i] = entry.isIntersecting;
          }
          return next;
        });
      },
      { root: stage, rootMargin: "0px 100% 0px 100%" },
    );
    Array.from(track.children).forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [stageRef, trackRef]);
  return inStage;
}

/** Mounts the product pieces once the section is within a couple of screens, not with the page. */
function useNear(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return near;
}

/**
 * /earlypreview: the product, in a beige scroll-locked section under "We've been building together". The title comes
 * in centred over a dot wave; scrolling lifts the title and the wave to the top, a row of rounded boxes rises in under
 * it, and the row pans right to left, one piece of the product per box with its name underneath. The lock lets go on
 * the last. On an iPhone it scrubs through a sticky track, as the market section does.
 */
export function EarlyPreviewProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);
  useNavReveal(sectionRef);
  const near = useNear(sectionRef);
  const inStage = useBoxesInStage(stageRef, trackRef);
  const toCenter = useCenterOffset(headRef);
  const distance = usePanDistance(trackRef);

  const lift = en(p, HEAD);
  const shown = en(p, SLIDES_IN);
  const pan = en(p, PAN);
  const gone = en(p, TITLE_OUT);

  return (
    <div className="earlypreview-product-track" style={vars({ "--product-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section
        ref={sectionRef}
        className="earlypreview-product doehealth-desk2-nav-wash-surface"
        data-nav-beige="1"
        aria-label="Product design, built by providers"
      >
        <BeigeTone />
        <div
          ref={headRef}
          className={`earlypreview-product__head ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
          style={vars({ "--y": toCenter * (1 - lift) })}
        >
          {/* The dot wave hangs from the title's bottom edge and climbs with it, ending in the space between the title and the boxes.
              It drifts while the title rises, then holds that frame: a canvas redrawn every frame under the panning boxes costs the pan its smoothness. */}
          <div className="earlypreview-product__wave" style={{ opacity: 1 - WAVE_FADE * lift, ...vars({ "--wv-rise": gone }) }} aria-hidden>
            <DoeHealthBlogDotWave color="rgba(110, 92, 64, 0.3)" top={0.04} amp={40} fade={0.25} active={near && lift < 1} />
          </div>
          <h2 className={`earlypreview-product__title ${p22Mackinac.className}`} style={vars({ "--tf": 1 - gone })}>
            <span>{HEADLINE.line1}</span>
            <span>{HEADLINE.line2}</span>
          </h2>
        </div>
        <div className={`earlypreview-product__frame ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <div ref={stageRef} className="earlypreview-product__stage">
            <ol
              ref={trackRef}
              className="earlypreview-product__track"
              style={{ ...vars({ "--k": shown }), transform: `translate3d(${-pan * distance}px, 0, 0)` }}
            >
              {SLIDES.map((slide, i) => (
                <li key={slide.id} data-index={i} className="earlypreview-product__slide" style={vars({ "--i": Math.min(i, 3), "--len": slide.title.length })}
                >
                  <div className="earlypreview-product__box">
                    <div className="earlypreview-product__ui" data-sit={VISUALS[slide.id].sit}>
                      {near && inStage[i] ? <SlideVisual visual={VISUALS[slide.id]} /> : null}
                    </div>
                  </div>
                  <h3 className={`earlypreview-product__slide-title ${dmSans.className}`}>{slide.title}</h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {p > 0 ? <ProductNav p={p} goTo={goTo} /> : null}
        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip the product section" onClick={skip}>
            <SkipIcon />
          </button>
        ) : null}
      </section>
    </div>
  );
}
