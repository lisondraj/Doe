"use client";

import Image from "next/image";
import { type MouseEvent, useRef, useState } from "react";

import styles from "@/components/doehealth-blog/DoeHealthBlogVideo.module.css";
import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";
import { type FilmStart, startFilm } from "@/lib/earlypreview/start-film";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";

/**
 * An article's hero: the same film and the same thumbnail as on /earlypreview. The thumbnail is a full-resolution
 * screenshot of the film's frame, so it is there at first paint with the play button; the film loads on a click and plays
 * in place, and the screenshot stays up until it is showing frames, so there is never a black box.
 */
export function DoeHealthBlogFilm({
  film,
  thumbnail,
  label,
  className = "",
}: {
  film: EarlyPreviewFilmId;
  /** A screenshot of the film's thumbnail frame, 16:9. */
  thumbnail: string;
  /** What the film is, for assistive tech. */
  label: string;
  className?: string;
}) {
  const src = useEarlyPreviewFilm(film);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef<FilmStart>({ rewound: false });
  const [playing, setPlaying] = useState(false);
  const [rolling, setRolling] = useState(false);

  const begin = () => {
    const video = videoRef.current;
    if (video && src) startFilm(video, startRef.current);
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (playing || (event.target as HTMLElement).closest("a")) return;
    setPlaying(true);
    begin();
  };

  return (
    <figure
      className={`${styles.film}${playing ? ` ${styles.filmPlaying}` : ""}${rolling ? ` ${styles.filmRolling}` : ""} ${className}`}
      onClick={onClick}
    >
      <Image
        src={thumbnail}
        alt={label}
        fill
        sizes="(min-width: 1024px) 1210px, 100vw"
        quality={95}
        priority
      />
      <video
        ref={videoRef}
        className={styles.filmVideo}
        src={playing ? src : undefined}
        preload={playing ? "auto" : "none"}
        playsInline
        controls={playing}
        aria-label={`${label}, video`}
        onLoadedMetadata={begin}
        onPlaying={() => setRolling(true)}
      />
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="1.35 0 24 24" fill="currentColor">
          <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
        </svg>
      </span>
    </figure>
  );
}
