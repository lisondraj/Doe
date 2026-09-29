"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import {
  DOEHEALTH_DESK_GENOME_BEAT_TOTAL,
  DOEHEALTH_DESK_GENOME_BELIEVE,
  DOEHEALTH_DESK_GENOME_INTRO_PROGRESS,
  DOEHEALTH_DESK_GENOME_LOCKUP,
  DOEHEALTH_DESK_GENOME_PROBLEM,
  doehealthDeskGenomeBeat,
} from "@/lib/doehealth/doehealth-desk-genome-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

function swipeClass(tone: "cream" | "salmon", dim: boolean) {
  return `desk-genome-swipe desk-genome-swipe--${tone}${dim ? "-dim" : ""}`;
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
export function DoeHealthDeskGenomeSection() {
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

    const setSwipe = (nodes: HTMLElement[], on: boolean) => {
      for (const node of nodes) node.classList.toggle("is-headline-in", on);
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight;
      const range = Math.max(1, rect.height - view);
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const beat = doehealthDeskGenomeBeat(progress);

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

      pin.style.setProperty("--desk-genome-problem", problem.toFixed(4));
      pin.style.setProperty("--desk-genome-believe", believe.toFixed(4));
      pin.style.setProperty("--desk-genome-believe-swipe", believeSwipe.toFixed(4));
      pin.style.setProperty("--desk-genome-intro", intro.toFixed(4));
      pin.style.setProperty("--desk-genome-title", title.toFixed(4));
      pin.style.setProperty("--desk-genome-dek", dek.toFixed(4));
      reel.style.setProperty("--desk-genome-index", index.toFixed(4));
      for (let i = 0; i < slides.length; i += 1) {
        slides[i]?.style.setProperty("--desk-genome-dist", Math.abs(i - index).toFixed(4));
      }
      pin.classList.toggle("is-at-intro", intro > 0.04);
      setSwipe(firstSwipe, firstOn);
      genomeTitle?.classList.toggle("is-headline-in", genomeOn);
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
    if (!section) return;
    const view = window.innerHeight;
    const range = Math.max(1, section.offsetHeight - view);
    const fromTop = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({ top: fromTop + DOEHEALTH_DESK_GENOME_INTRO_PROGRESS * range, behavior: "auto" });
  };

  return (
    <section
      ref={sectionRef}
      id="genome"
      className="doehealth-desk-genome doehealth-desk-nav-wash-surface"
      aria-label="Genome 1.0"
      style={{ "--desk-genome-beats": DOEHEALTH_DESK_GENOME_BEAT_TOTAL } as CSSProperties}
    >
      <div ref={pinRef} className="doehealth-desk-genome__pin">
        <div className="doehealth-desk-genome__stage">
          <div className="doehealth-desk-genome__scene doehealth-desk-genome__scene--problem">
            <div ref={reelRef} className={`doehealth-desk-genome__reel ${p22Mackinac.className}`}>
              {DOEHEALTH_DESK_GENOME_PROBLEM.map((slide, slideIndex) => (
                <p key={slide.parts.map((part) => part.text).join("")} className="doehealth-desk-genome__slide">
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
                        className={part.tone === "salmon" ? "doehealth-desk-genome__tone-salmon" : undefined}
                      >
                        {part.text}
                      </span>
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>

          <div className="doehealth-desk-genome__scene doehealth-desk-genome__scene--believe">
            <p className={`doehealth-desk-genome__believe ${p22Mackinac.className}`}>
              {DOEHEALTH_DESK_GENOME_BELIEVE.parts.map((part) => (
                <span
                  key={part.text}
                  className={part.tone === "salmon" ? "doehealth-desk-genome__tone-salmon" : undefined}
                >
                  {part.text}
                </span>
              ))}
            </p>
          </div>

          <div className={`doehealth-desk-genome__scene doehealth-desk-genome__scene--lockup ${p22Mackinac.className}`}>
            <p className="doehealth-desk-genome__eyebrow">{DOEHEALTH_DESK_GENOME_LOCKUP.eyebrow}</p>
            <h2 className="doehealth-desk-genome__title desk-genome-headline-highlight" data-genome-swipe="genome">
              {DOEHEALTH_DESK_GENOME_LOCKUP.title}
            </h2>
            <p className={`doehealth-desk-genome__dek ${inter.className}`}>{DOEHEALTH_DESK_GENOME_LOCKUP.dek}</p>
          </div>
        </div>
        <button
          type="button"
          className="doehealth-desk-genome__skip"
          aria-label="Skip to Introducing"
          onClick={skipToIntro}
        >
          <GenomeSkipIcon />
        </button>
      </div>
    </section>
  );
}
