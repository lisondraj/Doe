"use client";

import Image from "next/image";
import { type MouseEvent, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/**
 * Lounge photo (2500 × 1667), rounded to the page's corner radius, with the two founder names on it. The bottom veil
 * lifts as you scroll. `overlay` is laid over the photo (the hover card on /earlypreview). `film` is that page's
 * hero video: the still stays until a click plays it.
 */
export function DoeHealthDesk2Workspace({
  overlay,
  className = "",
  film,
  filmLabel,
}: {
  overlay?: ReactNode;
  className?: string;
  /** A playable URL. Absent on /doehealthdesk2, which stays a still. */
  film?: string;
  filmLabel?: string;
} = {}) {
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const fadeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setShown(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const fade = fadeRef.current;
    if (!fade) return;
    let raf = 0;
    let lastOpacity = -1;
    const update = () => {
      raf = 0;
      const range = 200;
      const opacity = Math.max(0, 1 - window.scrollY / range);
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded === lastOpacity) return;
      lastOpacity = rounded;
      fade.style.setProperty("--desk2-product-fade", rounded.toFixed(2));
      // Once it has lifted it stays gone, and display: none also stops its drifting mask animation.
      if (rounded === 0) {
        fade.style.display = "none";
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    if (lastOpacity > 0) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const seekToMiddle = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const middle = video.duration / 2;
    if (video.readyState >= 2 && Math.abs(video.currentTime - middle) < 0.05) {
      setShowFrame(true);
    } else {
      video.currentTime = middle;
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || playing) return;
    hoveredRef.current = true;
    seekToMiddle();
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    hoveredRef.current = false;
    setShowFrame(false);
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (!film || playing || (event.target as HTMLElement).closest("a")) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    setPlaying(true);
    video.play().catch(() => setPlaying(false));
  };

  const filmVisible = playing || showFrame;
  // The early preview passes a label even before the signed URL arrives, so the film element is there
  // for a hover. The middle frame shows under the card; the card itself stays until a click plays it.
  const isFilm = filmLabel !== undefined;

  return (
    <section className={`desk2-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`} aria-label="Doe clinic">
      <div className="desk2-workspace__stage">
        <figure
          className={`desk2-workspace__photo${playing ? " is-playing" : ""}`}
          onPointerEnter={isFilm ? onPointerEnter : undefined}
          onPointerLeave={isFilm ? onPointerLeave : undefined}
          onClick={isFilm ? onClick : undefined}
        >
          <Image
            src="/doehealthdesk2/newhero.jpg"
            alt="A bright, minimal lounge with a cream curved sofa, a sculpted coffee table and a grey lounge chair by a sunlit window"
            width={2500}
            height={1445}
            sizes="(min-width: 1024px) 80vw, 100vw"
            priority
          />
          {isFilm ? (
            <video
              ref={videoRef}
              className={`earlypreview-film${filmVisible ? " is-visible" : ""}`}
              src={film}
              preload="metadata"
              playsInline
              controls={playing}
              aria-label={filmLabel ? `${filmLabel}, video` : "Video"}
              onLoadedMetadata={() => {
                if (hoveredRef.current) seekToMiddle();
              }}
              onSeeked={() => {
                if (hoveredRef.current) setShowFrame(true);
              }}
            />
          ) : null}
          <div className={`desk2-workspace__person desk2-workspace__person--james ${p22Mackinac.className}`}>
            <p className="desk2-workspace__name">James Lisondra</p>
            <p className={`desk2-workspace__role ${inter.className}`}>Founder, Medicine</p>
          </div>
          <div className={`desk2-workspace__person desk2-workspace__person--matthew ${p22Mackinac.className}`}>
            <p className="desk2-workspace__name">Matthew Lisondra</p>
            <p className={`desk2-workspace__role ${inter.className}`}>Founder, Engineering</p>
          </div>
          <span className="desk2-workspace__play" aria-hidden="true">
            <svg viewBox="1.35 0 24 24" fill="currentColor">
              <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
            </svg>
          </span>
          {overlay}
        </figure>
      </div>
      <div ref={fadeRef} className="desk2-workspace__fade" aria-hidden />
    </section>
  );
}
