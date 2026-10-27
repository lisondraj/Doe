"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotField } from "@/components/doehealth-blog/DoeHealthBlogDotField";
import { articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthProductArtboard } from "@/components/doehealth-product/DoeHealthProductHome";
import type { DoeHealthBlogAppView, DoeHealthBlogFilmView, DoeHealthBlogView } from "@/lib/doehealth/doehealth-blog-articles";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_LIST, VIDEO1_WIDTH, type Video1Entry } from "@/remotion/video1";
import { VIDEO2_LIST } from "@/remotion/video2";
import { VIDEO3_LIST } from "@/remotion/video3";
import { VIDEO4_LIST } from "@/remotion/video4";
import { VIDEO5_LIST } from "@/remotion/video5";
import { VIDEO6_LIST } from "@/remotion/video6";

/** Every /video1–/video6 section, by its composition id. */
const FILMS: Record<string, Video1Entry> = Object.fromEntries(
  [...VIDEO1_LIST, ...VIDEO2_LIST, ...VIDEO3_LIST, ...VIDEO4_LIST, ...VIDEO5_LIST, ...VIDEO6_LIST].map((entry) => [entry.id, entry]),
);

/** The /doehealthproduct artboard, and the paper panel inside its brown shell. */
const ARTBOARD = { w: 1440, h: 900 };
const PAPER = { x: 64, y: 12, w: 1364, h: 876, r: 24 };
/** The corner of the product a cut-off box shows, as on /earlypreview. */
const CORNER = { w: 960, h: 640 };
/** Frames each loop fades over at its ends, so the loop never jumps. */
const SEAM = 10;

/** True while at least a quarter of the element is on screen. */
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return on;
}

function useBoxSize(ref: React.RefObject<HTMLElement | null>) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w && h) setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return box;
}

/* ------------------------------------------------------------------ films */

/**
 * A stretch of a /video film, looping while it is on screen. The film covers the box (16:9 on desktop, cropped at the
 * sides on the phone's 4:3), and `zoom` pushes in on one part of it so a single card or a corner of the shell fills it.
 */
function FilmView({ view }: { view: DoeHealthBlogFilmView }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const on = useOnScreen(boxRef);
  const entry = FILMS[view.film];

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (on && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) player.play();
    else player.pause();
  }, [on]);

  useEffect(() => {
    const player = playerRef.current;
    const fade = fadeRef.current;
    if (!player || !fade) return undefined;
    const onFrame = (event: { detail: { frame: number } }) => {
      const { frame } = event.detail;
      fade.style.opacity = String(Math.min(1, (frame - view.from) / SEAM, (view.to - frame) / SEAM));
    };
    player.addEventListener("frameupdate", onFrame);
    return () => player.removeEventListener("frameupdate", onFrame);
  }, [view.from, view.to]);

  const zoom = view.zoom ?? { s: 1, x: 0.5, y: 0.5 };
  return (
    <div ref={boxRef} className={`doehealth-blog-view doehealth-blog-view--film ${dmSans.variable} ${p22Mackinac.variable}`} aria-hidden>
      <div ref={fadeRef} className="doehealth-blog-view__film">
        <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom.s})`, transformOrigin: `${zoom.x * 100}% ${zoom.y * 100}%` }}>
          <Player
            ref={playerRef}
            component={entry.component}
            durationInFrames={entry.durationInFrames}
            compositionWidth={VIDEO1_WIDTH}
            compositionHeight={VIDEO1_HEIGHT}
            fps={VIDEO1_FPS}
            inFrame={view.from}
            outFrame={view.to}
            initialFrame={view.still ?? view.from}
            style={{ width: "100%", height: "100%" }}
            initiallyMuted
            numberOfSharedAudioTags={0}
            loop
            controls={false}
            clickToPlay={false}
            spaceKeyToPlayOrPause={false}
            acknowledgeRemotionLicense
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- product pages */

/** Where the artboard sits in the box, and how far it is scaled, from how the view is framed. */
function frameApp(sit: DoeHealthBlogAppView["sit"], box: { w: number; h: number }) {
  const pad = Math.round(box.w * 0.06);
  if (sit === "full") {
    const s = Math.min((box.w - 2 * pad) / ARTBOARD.w, (box.h - 2 * pad) / ARTBOARD.h);
    return { s, x: (box.w - ARTBOARD.w * s) / 2, y: (box.h - ARTBOARD.h * s) / 2 };
  }
  if (sit === "inner") {
    const s = Math.min((box.w - 2 * pad) / PAPER.w, (box.h - 2 * pad) / PAPER.h);
    return { s, x: (box.w - PAPER.w * s) / 2 - PAPER.x * s, y: (box.h - PAPER.h * s) / 2 - PAPER.y * s };
  }
  // A corner: the product's top-left (br) or top-right (bl) corner sits in the box, and it runs off the other two edges.
  const s = Math.max((box.w - pad) / CORNER.w, (box.h - pad) / CORNER.h);
  return sit === "br" ? { s, x: pad, y: pad } : { s, x: box.w - pad - ARTBOARD.w * s, y: pad };
}

/**
 * The element showing `text` (its `nth` match), found by its own text so the script reads like the page. A label the page
 * truncates matches by its start.
 */
function findByText(root: HTMLElement, text: string, nth = 0) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let seen = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim().startsWith(text)) continue;
    if (seen++ === nth) return node.parentElement;
  }
  return null;
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** The films' cursor: ink arrow with a paper outline, no shadow. */
function CursorArrow() {
  return (
    <svg width={30} height={41} viewBox="0 0 22 30" style={{ display: "block" }}>
      <path d="M2 1.8v22.4l6-5.6 4.1 9.3 3.6-1.6-4-9.1h8.2z" fill="#140C04" stroke="#FFFCF1" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A live /doehealthproduct page, framed whole (brown shell and all), as its paper page alone, or as one corner running off
 * the box. A cursor moves to each target in turn and clicks it, and the page answers as it does on /doehealthproduct;
 * then the page resets and the script runs again. It plays only while on screen.
 */
function AppView({ view }: { view: DoeHealthBlogAppView }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const box = useBoxSize(boxRef);
  const on = useOnScreen(boxRef);
  const [cycle, setCycle] = useState(0);
  const fit = box ? frameApp(view.sit, box) : null;

  useEffect(() => {
    const source = sourceRef.current;
    if (source) source.inert = true;
  }, []);

  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let live = true;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const stage = stageRef.current;
    const source = sourceRef.current;
    if (!cursor || !ring || !stage || !source) return undefined;
    const pos = { x: view.start?.x ?? ARTBOARD.w * 0.7, y: view.start?.y ?? ARTBOARD.h * 0.85 };
    const place = (scale = 1) => {
      cursor.style.transform = `translate(${pos.x - 2}px, ${pos.y - 2}px) scale(${scale})`;
    };
    const glideTo = (x: number, y: number, ms: number) =>
      new Promise<void>((resolve) => {
        const from = { ...pos };
        const t0 = performance.now();
        const step = (now: number) => {
          if (!live) return resolve();
          const p = easeInOut(Math.min(1, (now - t0) / ms));
          pos.x = from.x + (x - from.x) * p;
          pos.y = from.y + (y - from.y) * p;
          place();
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    const run = async () => {
      stage.style.opacity = "1";
      cursor.style.opacity = "1";
      place();
      await wait(900);
      for (const target of view.clicks) {
        if (!live) return;
        const el = findByText(source, target.text, target.nth);
        if (!el) continue;
        const s = source.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const k = s.width / ARTBOARD.w;
        const x = (r.left + r.width / 2 - s.left) / k;
        const y = (r.top + r.height / 2 - s.top) / k;
        await glideTo(x, y, 950);
        if (!live) return;
        place(0.86);
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        ring.classList.remove("is-on");
        void ring.offsetWidth;
        ring.classList.add("is-on");
        el.click();
        await wait(140);
        place();
        await wait(target.hold ?? 1500);
      }
      await wait(1400);
      if (!live) return;
      stage.style.opacity = "0";
      cursor.style.opacity = "0";
      await wait(450);
      if (live) setCycle((c) => c + 1);
    };
    void run();
    return () => {
      live = false;
    };
  }, [on, cycle, view]);

  const { bg, dot } = articleBoxColors(view.tone);
  const stageStyle: CSSProperties = fit
    ? { width: ARTBOARD.w, height: ARTBOARD.h, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.s})` }
    : { width: ARTBOARD.w, height: ARTBOARD.h, visibility: "hidden" };
  return (
    <div ref={boxRef} className="doehealth-blog-view doehealth-blog-view--app" style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotField dots={view.dots} color={dot} />
      <div ref={stageRef} className="doehealth-blog-view__stage" data-sit={view.sit} style={stageStyle}>
        <div ref={sourceRef} className={`doehealth-product-page doehealth-blog-view__source ${dmSans.variable} ${inter.className}`}>
          <DoeHealthProductArtboard key={cycle} initialTab={view.tab} mountAll={false} />
        </div>
        <div ref={ringRef} className="doehealth-blog-view__ring" />
        <div ref={cursorRef} className="doehealth-blog-view__cursor">
          <CursorArrow />
        </div>
      </div>
    </div>
  );
}

/** A body figure: a stretch of a /video film, or a live /doehealthproduct page with a cursor at work. */
export function DoeHealthBlogProductView({ view }: { view: DoeHealthBlogView }) {
  return view.kind === "film" ? <FilmView view={view} /> : <AppView view={view} />;
}
