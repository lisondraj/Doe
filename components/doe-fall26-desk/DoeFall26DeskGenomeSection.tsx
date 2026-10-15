"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import {
  DOE_FALL26_DESK_GENOME_BEAT_TOTAL,
  DOE_FALL26_DESK_GENOME_BELIEVE,
  DOE_FALL26_DESK_GENOME_INTRO_PROGRESS,
  DOE_FALL26_DESK_GENOME_LOCKUP,
  DOE_FALL26_DESK_GENOME_PROBLEM,
  doeFall26DeskGenomeBeat,
} from "@/lib/doefall26/doefall26-desk-genome-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

function swipeClass(tone: "cream" | "salmon", dim: boolean) {
  return `fall26-genome-swipe fall26-genome-swipe--${tone}${dim ? "-dim" : ""}`;
}

function GenomeSkipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 5.5 13 12 7 18.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.35 5.5v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Pinned Genome band — scroll-locked scenes: problem roll, belief, then Introducing / Genome 1.0. */
export function DoeFall26DeskGenomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const reel = reelRef.current;
    if (!section || !pin || !reel) return;

    const slides = Array.from(reel.children) as HTMLElement[];
    const firstSwipe = Array.from(pin.querySelectorAll<HTMLElement>("[data-genome-swipe='first']"));
    const genomeTitle = pin.querySelector<HTMLElement>("[data-genome-swipe='genome']");
    let raf = 0;
    let latchedIntro = 0;
    let latchedTitle = 0;
    let latchedDek = 0;
    let latchedGenomeOn = false;
    let complete = false;
    let unpin = false;

    const setSwipe = (nodes: HTMLElement[], on: boolean) => {
      for (const node of nodes) node.classList.toggle("is-headline-in", on);
    };

    const paint = (
      index: number,
      problem: number,
      believe: number,
      believeSwipe: number,
      intro: number,
      title: number,
      dek: number,
      firstOn: boolean,
      genomeOn: boolean,
    ) => {
      pin.style.setProperty("--fall26-genome-problem", problem.toFixed(4));
      pin.style.setProperty("--fall26-genome-believe", believe.toFixed(4));
      pin.style.setProperty("--fall26-genome-believe-swipe", believeSwipe.toFixed(4));
      pin.style.setProperty("--fall26-genome-intro", intro.toFixed(4));
      pin.style.setProperty("--fall26-genome-title", title.toFixed(4));
      pin.style.setProperty("--fall26-genome-dek", dek.toFixed(4));
      reel.style.setProperty("--fall26-genome-index", index.toFixed(4));
      reel.classList.toggle("is-first", index < 0.02);
      for (let i = 0; i < slides.length; i += 1) {
        slides[i]?.style.setProperty("--fall26-genome-dist", Math.abs(i - index).toFixed(4));
      }
      pin.classList.toggle("is-at-intro", intro > 0.04);
      setSwipe(firstSwipe, firstOn);
      genomeTitle?.classList.toggle("is-headline-in", genomeOn);
    };

    const releaseToPageScroll = () => {
      if (complete) return;
      complete = true;
      const top = section.getBoundingClientRect().top;
      const y = window.scrollY;
      section.classList.add("is-complete");
      window.scrollTo({ top: y + top, behavior: "auto" });
      window.requestAnimationFrame(() => {
        unpin = true;
        pin.classList.remove("is-locked", "is-released");
      });
    };

    const update = () => {
      raf = 0;

      if (complete) {
        if (unpin) pin.classList.remove("is-locked", "is-released");
        paint(0, 0, 0, 1, 1, 1, 1, false, true);
        return;
      }

      const rect = section.getBoundingClientRect();
      const view = window.innerHeight;
      const range = Math.max(1, rect.height - view);
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const beat = doeFall26DeskGenomeBeat(progress);

      if (rect.top > 0) {
        pin.classList.remove("is-locked", "is-released");
      } else if (rect.bottom <= view) {
        pin.classList.remove("is-locked");
        pin.classList.add("is-released");
      } else {
        pin.classList.add("is-locked");
        pin.classList.remove("is-released");
      }

      let index = 0;
      let problem = 0;
      let believe = 0;
      let believeSwipe = 0;
      let intro = 0;
      let title = 0;
      let dek = 0;
      let firstOn = false;
      let genomeOn = false;

      switch (beat.id) {
        case "open":
          problem = beat.t;
          firstOn = beat.t > 0.08;
          break;
        case "hold0":
          problem = 1;
          firstOn = true;
          break;
        case "roll1":
          problem = 1;
          index = beat.t;
          firstOn = true;
          break;
        case "hold1":
          problem = 1;
          index = 1;
          firstOn = true;
          break;
        case "roll2":
          problem = 1;
          index = 1 + beat.t;
          firstOn = true;
          break;
        case "hold2":
          problem = 1;
          index = 2;
          firstOn = true;
          break;
        case "roll3":
          problem = 1;
          index = 2 + beat.t;
          firstOn = true;
          break;
        case "holdTrust":
          problem = 1;
          index = 3;
          firstOn = true;
          break;
        case "outTrust":
          problem = 1 - beat.t;
          index = 3;
          firstOn = true;
          break;
        case "inBelieve":
          believe = beat.t;
          believeSwipe = 0;
          break;
        case "swipeBelieve":
          believe = 1;
          believeSwipe = beat.t;
          break;
        case "holdBelieve":
          believe = 1;
          believeSwipe = 1;
          break;
        case "outBelieve":
          believe = 1 - beat.t;
          believeSwipe = 1;
          break;
        case "inIntro":
          intro = beat.t;
          title = beat.t;
          genomeOn = beat.t > 0.2;
          break;
        case "inGenome":
          intro = 1;
          title = 1;
          dek = beat.t;
          genomeOn = true;
          break;
        case "holdGenome":
          intro = 1;
          title = 1;
          dek = 1;
          genomeOn = true;
          break;
        default:
          break;
      }

      latchedIntro = Math.max(latchedIntro, intro);
      latchedTitle = Math.max(latchedTitle, title);
      latchedDek = Math.max(latchedDek, dek);
      latchedGenomeOn = latchedGenomeOn || genomeOn;

      if (latchedIntro > 0) {
        problem = 0;
        believe = 0;
        index = 0;
        firstOn = false;
        intro = latchedIntro;
        title = latchedTitle;
        dek = latchedDek;
        genomeOn = latchedGenomeOn;
      }

      paint(index, problem, believe, believeSwipe, intro, title, dek, firstOn, genomeOn);

      if (latchedDek >= 0.98) releaseToPageScroll();
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const skipToIntro = () => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const reel = reelRef.current;
    if (!section || !pin || !reel) return;
    pin.style.setProperty("--fall26-genome-problem", "0");
    pin.style.setProperty("--fall26-genome-believe", "0");
    pin.style.setProperty("--fall26-genome-believe-swipe", "1");
    pin.style.setProperty("--fall26-genome-intro", "1");
    pin.style.setProperty("--fall26-genome-title", "1");
    pin.style.setProperty("--fall26-genome-dek", "0");
    pin.classList.add("is-at-intro");
    pin.querySelector<HTMLElement>("[data-genome-swipe='genome']")?.classList.add("is-headline-in");
    const view = window.innerHeight;
    const range = Math.max(1, section.offsetHeight - view);
    const fromTop = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({ top: fromTop + DOE_FALL26_DESK_GENOME_INTRO_PROGRESS * range, behavior: "auto" });
  };

  return (
    <section
      ref={sectionRef}
      id="genome"
      className="doefall26-desk-genome doefall26-desk-nav-wash-surface"
      aria-label="Genome 1.0"
      style={{ "--fall26-genome-beats": DOE_FALL26_DESK_GENOME_BEAT_TOTAL } as CSSProperties}
    >
      <div ref={pinRef} className="doefall26-desk-genome__pin">
        <div className="doefall26-desk-genome__stage">
          <div className="doefall26-desk-genome__scene doefall26-desk-genome__scene--problem">
            <div ref={reelRef} className={`doefall26-desk-genome__reel ${p22Mackinac.className}`}>
              {DOE_FALL26_DESK_GENOME_PROBLEM.map((slide, slideIndex) => (
                <p key={slide.parts.map((part) => part.text).join("")} className="doefall26-desk-genome__slide">
                  {slide.parts.map((part) =>
                    slideIndex === 0 ? (
                      <span
                        key={part.text}
                        className={swipeClass(part.tone, false)}
                        data-genome-swipe="first"
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span
                        key={part.text}
                        className={part.tone === "salmon" ? "doefall26-desk-genome__tone-salmon" : undefined}
                      >
                        {part.text}
                      </span>
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>

          <div className="doefall26-desk-genome__scene doefall26-desk-genome__scene--believe">
            <p className={`doefall26-desk-genome__believe ${p22Mackinac.className}`}>
              {DOE_FALL26_DESK_GENOME_BELIEVE.parts.map((part) => (
                <span
                  key={part.text}
                  className={part.tone === "salmon" ? "doefall26-desk-genome__tone-salmon" : undefined}
                >
                  {part.text}
                </span>
              ))}
            </p>
          </div>

          <div className={`doefall26-desk-genome__scene doefall26-desk-genome__scene--lockup ${p22Mackinac.className}`}>
            <p className="doefall26-desk-genome__eyebrow">{DOE_FALL26_DESK_GENOME_LOCKUP.eyebrow}</p>
            <h2 className="doefall26-desk-genome__title fall26-genome-headline-highlight" data-genome-swipe="genome">
              {DOE_FALL26_DESK_GENOME_LOCKUP.title}
            </h2>
            <p className={`doefall26-desk-genome__dek ${inter.className}`}>{DOE_FALL26_DESK_GENOME_LOCKUP.dek}</p>
          </div>
        </div>
        <button
          type="button"
          className="doefall26-desk-genome__skip"
          aria-label="Skip to Introducing"
          onClick={skipToIntro}
        >
          <GenomeSkipIcon />
        </button>
      </div>
    </section>
  );
}
