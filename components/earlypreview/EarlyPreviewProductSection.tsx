"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, type ReactNode, memo, useEffect, useRef, useState } from "react";

import { SkipIcon } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import { DoeHealthProductArtboard, type DoeHealthProductTab } from "@/components/doehealth-product/DoeHealthProductHome";
import type { EarlyPreviewProductFilm } from "@/components/earlypreview/EarlyPreviewProductFilmFrame";
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
import { p22Mackinac } from "@/lib/home/fonts";

const FilmFrame = dynamic(
  () => import("@/components/earlypreview/EarlyPreviewProductFilmFrame").then((mod) => mod.EarlyPreviewProductFilmFrame),
  { ssr: false },
);

/** The /doehealthproduct artboard and the films' frame, in their own pixels. */
const ARTBOARD = { w: 1440, h: 900 };
const FILM = { w: 1920, h: 1080 };

type Align = "start" | "center" | "end";
/** The part of the source a box may show, in the source's pixels, and which edge it holds to when the box is narrower or shorter. */
type Crop = { x: number; y: number; w: number; h: number; ax?: Align; ay?: Align };

type Visual =
  | { kind: "app"; tab: DoeHealthProductTab; menu?: boolean; crop: Crop; aspect: number }
  | { kind: "film"; film: EarlyPreviewProductFilm; frame: number; crop: Crop; aspect: number };

/**
 * What each box shows: a corner of the whole product (outer and inner shell) or one component on its own, cropped so
 * the box is filled edge to edge. `aspect` is the box's width over its height.
 */
const VISUALS: Record<EarlyPreviewProductSlideId, Visual> = {
  index: { kind: "app", tab: "integrations", crop: { x: 0, y: 0, w: 900, h: 640, ax: "start", ay: "start" }, aspect: 1.4 },
  interface: { kind: "app", tab: "search", crop: { x: 118, y: 150, w: 826, h: 700, ay: "start" }, aspect: 1.3 },
  auth: { kind: "film", film: "permissions", frame: 660, crop: { x: 410, y: 250, w: 1110, h: 560, ax: "end" }, aspect: 1.7 },
  permissions: { kind: "app", tab: "permissions", crop: { x: 560, y: 125, w: 880, h: 704, ax: "end", ay: "start" }, aspect: 1.25 },
  insurance: { kind: "film", film: "communication", frame: 575, crop: { x: 310, y: 225, w: 1270, h: 705 }, aspect: 1.75 },
  forms: { kind: "app", tab: "forms", crop: { x: 388, y: 150, w: 676, h: 690, ax: "start", ay: "start" }, aspect: 1.4 },
  followUp: { kind: "film", film: "coordinate", frame: 500, crop: { x: 450, y: 15, w: 1015, h: 1030, ay: "start" }, aspect: 1.5 },
  multiSite: { kind: "app", tab: "integrations", menu: true, crop: { x: 0, y: 500, w: 394, h: 400, ax: "start", ay: "end" }, aspect: 1 },
  clinics: { kind: "app", tab: "referrals", crop: { x: 100, y: 125, w: 1000, h: 400, ax: "start", ay: "start" }, aspect: 1.5 },
  departments: { kind: "film", film: "permissions", frame: 380, crop: { x: 120, y: 40, w: 990, h: 1000, ay: "start" }, aspect: 1 },
  directory: { kind: "film", film: "network", frame: 440, crop: { x: 0, y: 0, w: 1400, h: 1080, ax: "start", ay: "start" }, aspect: 1.3 },
  payments: { kind: "app", tab: "payments", crop: { x: 600, y: 300, w: 840, h: 600, ax: "end", ay: "end" }, aspect: 1.4 },
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
      <CropView source={FILM} crop={visual.crop}>
        <FilmFrame film={visual.film} frame={visual.frame} />
      </CropView>
    );
  }
  return (
    <CropView source={ARTBOARD} crop={visual.crop}>
      <div className="doehealth-product-page" style={{ width: ARTBOARD.w, height: ARTBOARD.h }}>
        <DoeHealthProductArtboard initialTab={visual.tab} initialAccountMenuOpen={visual.menu} mountAll={false} />
      </div>
    </CropView>
  );
});

/* ------------------------------------------------------------------ timing */

const HEAD = [0.25, 1.0] as const;
const RECT = [0.75, 1.45] as const;
const SLIDES_IN = [1.15, 1.6] as const;
/** Progress the carousel takes per box as it pans right to left. */
const PER_SLIDE = 0.5;
const PAN = [1.6, 1.6 + PER_SLIDE * (SLIDES.length - 1)] as const;
/** The last box holds a moment before the lock lets go. */
const END = PAN[1] + 0.35;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (p: number, range: readonly [number, number]) => smooth(ramp(p, range));

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

/** How far the row of boxes runs past the rectangle, so the pan ends on the last box. */
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
 * in centred between the side dots; scrolling lifts it to the top while the dots sink away, a big rounded rectangle
 * opens under it, and the boxes inside pan right to left, one piece of the product each. The lock lets go on the last.
 * On an iPhone it scrubs through a sticky track, as the market section does.
 */
export function EarlyPreviewProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);
  useNavReveal(sectionRef);
  const near = useNear(sectionRef);
  const toCenter = useCenterOffset(headRef);
  const distance = usePanDistance(trackRef);

  const lift = en(p, HEAD);
  const open = en(p, RECT);
  const shown = en(p, SLIDES_IN);
  const pan = en(p, PAN);

  return (
    <div className="earlypreview-product-track" style={vars({ "--product-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section
        ref={sectionRef}
        className="earlypreview-product doehealth-desk2-nav-wash-surface"
        data-nav-beige="1"
        aria-label="Product design, built by providers"
      >
        <div className="earlypreview-product__tide" style={vars({ "--d": lift })} aria-hidden>
          <div className="doehealth-desk2-visible__tide" style={vars({ "--s": 1 })}>
            <DoeHealthDesk2DotTide color="rgba(110, 92, 64, 0.45)" active={near && lift < 1} />
          </div>
        </div>
        <div
          ref={headRef}
          className={`earlypreview-product__head ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
          style={vars({ "--y": toCenter * (1 - lift) })}
        >
          <h2 className={`earlypreview-product__title ${p22Mackinac.className}`}>
            <span>{HEADLINE.line1}</span>
            <span>{HEADLINE.line2}</span>
          </h2>
        </div>
        <div className={`earlypreview-product__frame ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <div className="earlypreview-product__stage" style={vars({ "--r": open })}>
            <ol
              ref={trackRef}
              className="earlypreview-product__track"
              style={{ ...vars({ "--k": shown }), transform: `translate3d(${-pan * distance}px, 0, 0)` }}
            >
              {SLIDES.map((slide) => (
                <li
                  key={slide.id}
                  className="earlypreview-product__slide"
                  style={vars({ "--a": VISUALS[slide.id].aspect })}
                >
                  <h3 className={`earlypreview-product__slide-title ${p22Mackinac.className}`}>{slide.title}</h3>
                  <div className="earlypreview-product__box">{near ? <SlideVisual visual={VISUALS[slide.id]} /> : null}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip the product section" onClick={skip}>
            <SkipIcon />
          </button>
        ) : null}
      </section>
    </div>
  );
}
