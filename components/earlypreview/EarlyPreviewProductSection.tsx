"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, type ReactNode, memo, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthProductArtboard, type DoeHealthProductTab } from "@/components/doehealth-product/DoeHealthProductHome";
import type { EarlyPreviewProductFilm } from "@/components/earlypreview/EarlyPreviewProductFilmFrame";
import type { ProductRailKey } from "@/components/earlypreview/EarlyPreviewProductShell";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
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
  | { kind: "app"; tab: DoeHealthProductTab; menu?: boolean; providerPanel?: boolean; crop: Crop; sit: Sit }
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
  multiSite: { kind: "app", tab: "integrations", menu: true, providerPanel: true, crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  scheduling: { kind: "app", tab: "schedule", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  clinics: { kind: "app", tab: "transit", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  departments: { kind: "film", film: "permissions", frame: 200, active: "permissions", focus: { x: 240, y: 58, w: 1497, h: 964 }, inset: PAGE_INSET, crop: CORNER, sit: "br" },
  directory: { kind: "film", film: "network", frame: 440, active: "providers", focus: { x: 150, y: 0, w: 1560, h: 995 }, inset: PAGE_INSET, crop: CORNER, sit: "br" },
  insights: { kind: "app", tab: "insights", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  automations: { kind: "app", tab: "automations", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
  services: { kind: "app", tab: "services", crop: { x: 0, y: 0, w: 960, h: 640, ax: "start", ay: "start" }, sit: "br" },
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
          showProviderPermissions={visual.providerPanel}
          mountAll={false}
        />
      </div>
    </CropView>
  );
});

/* ------------------------------------------------------------------ timing */

/** The intro plays once, on a clock, as the section comes into view: the title lifts and fades, the boxes rise in. */
const HEAD = [0.25, 1.0] as const;
const SLIDES_IN = [0.85, 1.6] as const;
/** Desktop: the title, once risen, fades away as the first four boxes come up into the grid beneath it. */
const DESK_SLIDES_IN = [1.0, 1.7] as const;
const TITLE_OUT = [0.85, 1.4] as const;
/** iPhone: the title fades out over this stretch, as the first boxes come up under it. */
const HEAD_OUT = [0.45, 1.15] as const;
const INTRO_END = 1.7;
/** How long the intro takes, start to end. */
const INTRO_MS = 1700;
/** How much of the wave's strength it gives up as the title rises: full at rest, this much fainter once it has risen. */
const WAVE_FADE = 0.72;
/** The boxes per screen: two by two on the desktop, two at a time in the iPhone's column. */
const DESK_PER_PAGE = 4;
const PHONE_PER_PAGE = 2;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (p: number, range: readonly [number, number]) => smooth(ramp(p, range));

/**
 * Plays the intro once most of the section is on screen: progress runs 0 → INTRO_END on a clock, not the scroll, so
 * the page never holds. With reduced motion it starts at the end.
 */
function useIntro(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(INTRO_END);
      return undefined;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / INTRO_MS);
          setP(t * INTRO_END);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.55 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

/**
 * iPhone: glides the column to `target` (in boxes) instead of jumping. Each box's offset (`--d`, its place in the
 * column less the column's position) is written straight onto its own element every frame; the property does not
 * inherit (see the CSS), so only the box moves and nothing inside the product it shows is restyled.
 */
function useColumnGlide(trackRef: React.RefObject<HTMLOListElement | null>, target: number) {
  const state = useRef({ at: target, raf: 0 });
  useEffect(() => {
    const track = trackRef.current;
    // The desktop pans its screens sideways instead (see the track's CSS).
    if (!track || !track.closest(".doehealth-desk2-page")?.querySelector(".doephone-mobile-root")) return undefined;
    const st = state.current;
    const items = Array.from(track.children) as HTMLElement[];
    // The window shows boxes at offsets -1 to 2; a box past those is hidden, so it is not painted or composited.
    const write = (at: number) =>
      items.forEach((item, i) => {
        const d = i - at;
        item.style.setProperty("--d", d.toFixed(4));
        item.style.visibility = d <= -1.01 || d >= 2.01 ? "hidden" : "";
      });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      st.at = target;
      write(target);
      return undefined;
    }
    const step = () => {
      const gap = target - st.at;
      if (Math.abs(gap) < 0.0015) {
        st.at = target;
        write(target);
        st.raf = 0;
        return;
      }
      st.at += gap * 0.12;
      write(st.at);
      st.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, [trackRef, target]);
}

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
 * One line per screen of boxes (four on the desktop, two on the iPhone), under the boxes; a click or tap brings that
 * screen in. The line in view is filled. Until the first tap the next line breathes, to show the lines can be tapped.
 */
function ProductNav({
  pages,
  page,
  perPage,
  goTo,
  fresh,
}: {
  pages: number;
  page: number;
  perPage: number;
  goTo: (page: number) => void;
  fresh: boolean;
}) {
  return (
    <nav className={`earlypreview-product__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}${fresh ? " is-fresh" : ""}`} aria-label="Product screens">
      {Array.from({ length: pages }, (_, i) => {
        const names = SLIDES.slice(i * perPage, (i + 1) * perPage).map((slide) => slide.title);
        const live = i === page;
        return (
          <button
            key={i}
            type="button"
            className={`earlypreview-product__nav-item${live ? " is-live" : ""}${i === page + 1 ? " is-next" : ""}`}
            style={vars({ "--f": i <= page ? 1 : 0 })}
            aria-label={names.join(", ")}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(i)}
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

/** iPhone: whether the page is the phone layout, read once mounted (null until then). */
function usePhoneLayout(ref: React.RefObject<HTMLElement | null>) {
  const [phone, setPhone] = useState<boolean | null>(null);
  useEffect(() => {
    setPhone(!!ref.current?.closest(".doehealth-desk2-page")?.querySelector(".doephone-mobile-root"));
  }, [ref]);
  return phone;
}

/**
 * Desktop: once the section is near, lets the live products mount one at a time, a frame or two apart, instead of all
 * in the same frame, so reaching the section does not stall the scroll.
 */
function useStaggeredMount(near: boolean, count: number) {
  const [ready, setReady] = useState(0);
  useEffect(() => {
    if (!near) return undefined;
    let n = 0;
    let id = 0;
    const next = () => {
      n += 1;
      setReady(n);
      if (n < count) id = window.setTimeout(() => requestAnimationFrame(next), 90);
    };
    id = window.setTimeout(() => requestAnimationFrame(next), 0);
    return () => window.clearTimeout(id);
  }, [near, count]);
  return ready;
}

/**
 * /earlypreview: the product, in a beige section under "We've been building together". It never holds the scroll. As it
 * comes into view the title, centred over a dot wave, lifts and fades and the boxes rise in: two by two on the desktop,
 * two at a time in a column on the iPhone, one piece of the product per box with its name underneath. The lines under
 * them bring in the next screen of boxes.
 */
export function EarlyPreviewProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const phone = usePhoneLayout(sectionRef);
  const p = useIntro(sectionRef);
  useNavReveal(sectionRef);
  const near = useNear(sectionRef);
  const ready = useStaggeredMount(near && phone === false, SLIDES.length);
  const toCenter = useCenterOffset(headRef);
  const [page, setPage] = useState(0);
  const [fresh, setFresh] = useState(true);

  const perPage = phone ? PHONE_PER_PAGE : DESK_PER_PAGE;
  const pages = Math.ceil(SLIDES.length / perPage);
  const goTo = (next: number) => {
    setFresh(false);
    setPage(Math.min(pages - 1, Math.max(0, next)));
  };
  // The layout is known only once mounted; keep the screen in range when it is.
  useEffect(() => setPage((current) => Math.min(current, pages - 1)), [pages]);

  const lift = en(p, HEAD);
  const shown = en(p, phone ? SLIDES_IN : DESK_SLIDES_IN);
  const gone = en(p, TITLE_OUT);
  const headOut = en(p, HEAD_OUT);
  useColumnGlide(trackRef, page * PHONE_PER_PAGE);

  return (
    <div className="earlypreview-product-track">
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
          style={vars({ "--y": toCenter * (1 - lift), "--hf": 1 - headOut })}
        >
          {/* The dot wave hangs from the title's bottom edge and climbs with it. It keeps rolling while the section is
              on screen, including after the title has risen. */}
          <div className="earlypreview-product__wave" style={{ opacity: 1 - WAVE_FADE * lift, ...vars({ "--wv-rise": gone }) }} aria-hidden>
            <DoeHealthBlogDotWave color="rgba(110, 92, 64, 0.3)" top={0.04} amp={40} fade={0.25} active={near && headOut < 1} />
          </div>
          <h2 className={`earlypreview-product__title ${p22Mackinac.className}`} style={vars({ "--tf": 1 - gone })}>
            <span>{HEADLINE.line1}</span>
            <span>{HEADLINE.line2}</span>
          </h2>
        </div>
        <div className={`earlypreview-product__frame ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <div className="earlypreview-product__stage">
            <ol ref={trackRef} className="earlypreview-product__track" style={vars({ "--pg": page })}>
              {SLIDES.map((slide, i) => {
                const onPage = Math.floor(i / DESK_PER_PAGE);
                return (
                  <li
                    key={slide.id}
                    data-index={i}
                    className="earlypreview-product__slide"
                    aria-hidden={Math.floor(i / perPage) !== page || undefined}
                    style={vars({
                      "--pk": shown,
                      "--i": Math.min(i % DESK_PER_PAGE, 3),
                      "--d": i,
                      "--len": slide.title.length,
                      "--col": onPage * 3 + (i % 2) + 1,
                      "--row": Math.floor((i % DESK_PER_PAGE) / 2) + 1,
                    })}
                  >
                    <div className="earlypreview-product__box">
                      <div className="earlypreview-product__ui" data-sit={VISUALS[slide.id].sit} data-still={phone ? "" : undefined}>
                        {/* iPhone: each box is a still of the product, already toned (public/earlypreview/product), so
                            the column moves pictures rather than live products under a colour filter. */}
                        {phone ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="earlypreview-product__still" src={`/earlypreview/product/${slide.id}.webp`} alt="" loading="lazy" decoding="async" draggable={false} />
                        ) : null}
                        {/* Desktop: only the screen in view and the ones either side hold live products. */}
                        {near && phone === false && Math.abs(onPage - page) <= 1 && i < ready ? <SlideVisual visual={VISUALS[slide.id]} /> : null}
                      </div>
                    </div>
                    <h3 className={`earlypreview-product__slide-title ${dmSans.className}`}>{slide.title}</h3>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <ProductNav pages={pages} page={page} perPage={perPage} goTo={goTo} fresh={fresh} />
      </section>
    </div>
  );
}
