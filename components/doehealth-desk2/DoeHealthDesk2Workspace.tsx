"use client";

import Image from "next/image";
import { type MouseEvent, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { type FilmStart, startFilm } from "@/lib/earlypreview/start-film";
import { useAdaptiveSrc } from "@/lib/earlypreview/use-adaptive-src";
import { useFilmWarmUp } from "@/lib/earlypreview/use-film-warm-up";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** Where the hero film rests before a click, on /earlypreview and /doehealthdesk2. */
const HERO_POSTER_SECONDS = 4;

/**
 * Lounge photo (2500 × 1667), rounded to the page's corner radius, with the two founder names on it. The bottom veil
 * lifts as you scroll. `overlay` is laid over the photo (the hover card on /earlypreview). `film` is that page's
 * hero video: the frame at 0:04 replaces the photo, and a click plays it from the start.
 */
export function DoeHealthDesk2Workspace({
  overlay,
  className = "",
  film,
  filmLabel,
  thumbnail,
}: {
  overlay?: ReactNode;
  className?: string;
  /** A playable URL. The /doehealthdesk2 hero and /earlypreview both use the hero film. */
  film?: string;
  /** Present whenever this photo is a film, including before the signed URL arrives. */
  filmLabel?: string;
  /**
   * A screenshot of the film's thumbnail frame. When set it is the thumbnail, shown at once, in place of the paused film,
   * and the film only loads on a click; it stays up until the film is actually showing frames.
   */
  thumbnail?: string;
} = {}) {
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [poster, setPoster] = useState(false);
  const [rolling, setRolling] = useState(false);
  const fadeRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveredRef = useRef(false);
  const playingRef = useRef(false);
  const filmStartRef = useRef<FilmStart>({ rewound: false });
  const filmSeen = useRef(film);
  playingRef.current = playing;
  const videoSource = useAdaptiveSrc(videoRef, film ? (thumbnail ? film : `${film}#t=${HERO_POSTER_SECONDS}`) : undefined);
  if (filmSeen.current !== film) {
    filmSeen.current = film;
    setPoster(false);
  }
  // The hero film fills a few seconds of buffer as soon as it has a link and is on or near the screen.
  useFilmWarmUp(videoRef, photoRef, !!film, "100% 0px");

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

  /** The thumbnail is four seconds in. Seeking there makes the browser decode that frame. */
  const revealFirstFrame = () => {
    const video = videoRef.current;
    if (thumbnail || !video || playingRef.current || hoveredRef.current) return;
    if (video.readyState >= 2 && Math.abs(video.currentTime - HERO_POSTER_SECONDS) < 0.15) {
      setPoster(true);
      return;
    }
    try {
      video.currentTime = HERO_POSTER_SECONDS;
    } catch {
      // Not seekable yet. `loadeddata` tries again.
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || playing) return;
    hoveredRef.current = true;
    // Show the film immediately. The middle frame replaces the opening frame once the seek lands.
    setShowFrame(true);
    seekToMiddle();
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    hoveredRef.current = false;
    setShowFrame(false);
    if (!playingRef.current) revealFirstFrame();
  };

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video || !film) return;
    startFilm(video, filmStartRef.current);
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (playing || (event.target as HTMLElement).closest("a")) return;
    // The still comes off whether or not the URL is ready or valid, so a bad link still shows the player.
    playingRef.current = true;
    setPlaying(true);
    startPlayback();
  };

  useEffect(() => {
    if (playing) startPlayback();
    // startPlayback reads the video element; it should run again only when the URL arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [film, playing]);

  const filmVisible = playing || showFrame;
  // The early preview passes a label even before the signed URL arrives, so the film element is there
  // for a hover. The middle frame shows under the card; the card itself stays until a click plays it.
  const isFilm = filmLabel !== undefined;

  return (
    <section className={`desk2-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`} aria-label="Doe clinic">
      <div className="desk2-workspace__stage">
        <figure
          ref={photoRef}
          className={`desk2-workspace__photo${thumbnail ? " has-thumb" : ""}${playing ? " is-playing" : ""}${rolling ? " is-rolling" : ""}`}
          onPointerEnter={isFilm && overlay && !thumbnail ? onPointerEnter : undefined}
          onPointerLeave={isFilm && overlay && !thumbnail ? onPointerLeave : undefined}
          onClick={isFilm ? onClick : undefined}
        >
          {isFilm ? null : (
            <Image
              src="/doehealthdesk2/newhero.jpg"
              alt="A bright, minimal lounge with a cream curved sofa, a sculpted coffee table and a grey lounge chair by a sunlit window"
              width={2500}
              height={1445}
              sizes="(min-width: 1024px) 80vw, 100vw"
              priority
            />
          )}
          {isFilm && thumbnail ? (
            <Image src={thumbnail} alt="" width={2560} height={1440} sizes="(min-width: 1024px) 80vw, 100vw" quality={90} priority />
          ) : null}
          {isFilm ? (
            <video
              ref={videoRef}
              className={`earlypreview-film${poster ? " is-poster" : ""}${filmVisible ? " is-visible" : ""}`}
              {...videoSource}
              preload={playing ? "auto" : "metadata"}
              playsInline
              controls={playing}
              aria-label={filmLabel ? `${filmLabel}, video` : "Video"}
              onLoadedMetadata={() => {
                if (playingRef.current) {
                  startPlayback();
                  return;
                }
                if (hoveredRef.current) seekToMiddle();
                else revealFirstFrame();
              }}
              onLoadedData={() => {
                if (!playingRef.current && !hoveredRef.current) revealFirstFrame();
              }}
              onPlaying={() => setRolling(true)}
              onSeeked={() => {
                if (playingRef.current) return;
                if (hoveredRef.current) setShowFrame(true);
                else setPoster(true);
              }}
            />
          ) : null}
          {isFilm ? null : (
            <>
              <div className={`desk2-workspace__person desk2-workspace__person--james ${p22Mackinac.className}`}>
                <p className="desk2-workspace__name">James Lisondra</p>
                <p className={`desk2-workspace__role ${inter.className}`}>Founder, Medicine</p>
              </div>
              <div className={`desk2-workspace__person desk2-workspace__person--matthew ${p22Mackinac.className}`}>
                <p className="desk2-workspace__name">Matthew Lisondra</p>
                <p className={`desk2-workspace__role ${inter.className}`}>Founder, Engineering</p>
              </div>
            </>
          )}
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
