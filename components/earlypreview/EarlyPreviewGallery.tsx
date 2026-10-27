import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import { EarlyPreviewVideoOverlay } from "@/components/earlypreview/EarlyPreviewVideoOverlay";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { EARLYPREVIEW_ENTERPRISE_DEK } from "@/lib/earlypreview/earlypreview-hero-copy";
import { type FilmStart, startFilm } from "@/lib/earlypreview/start-film";
import { useNavReveal } from "@/lib/earlypreview/use-nav-reveal";
import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";
import { useAdaptiveSrc } from "@/lib/earlypreview/use-adaptive-src";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";
import {
  EARLYPREVIEW_AESTHETICS_VIDEO,
  EARLYPREVIEW_BEYOND_VIDEO,
  EARLYPREVIEW_CONCIERGE_VIDEO,
  EARLYPREVIEW_HOSPITALS_VIDEO,
  type EarlyPreviewVideo,
} from "@/lib/earlypreview/earlypreview-videos";

/** The hospital video has its own section, under the blank section below the main video. */
const HOSPITAL_TILE: GalleryTileData = {
  src: "/earlypreview/thumbs/hospitals-open.jpg",
  alt: "The opening of the Doe for Hospitals film",
  video: EARLYPREVIEW_HOSPITALS_VIDEO,
  wide: true,
  film: "hospitals",
  still: true,
};

type GalleryTileData = {
  src: string;
  alt: string;
  video: EarlyPreviewVideo;
  wide?: boolean;
  position?: string;
  /** The film itself, if it plays in place on the tile. */
  film?: EarlyPreviewFilmId;
  /**
   * The thumbnail is the still image (`src`), a screenshot of the film's frame, never the paused film, so nothing waits
   * on the video to show. The film loads and plays in place on a click.
   */
  still?: boolean;
  /** Only the centred play button over the still, no card. */
  plain?: boolean;
};

/** Two videos side by side, the first row of the beige section's video grid. */
const PAIR_TILES: readonly GalleryTileData[] = [
  {
    src: "/doehealthdesk2/sunlit-minimalist-wooden-stools.jpg",
    alt: "Sunlit room with minimalist wooden stools",
    video: EARLYPREVIEW_BEYOND_VIDEO,
  },
  {
    src: "/earlypreview/thumbs/derm-open.jpg",
    alt: "The opening of the Doe for Derm film",
    video: EARLYPREVIEW_AESTHETICS_VIDEO,
    film: "derm",
    still: true,
  },
];

/** The last video, full width, under the pair. */
const LAST_TILE: GalleryTileData = {
  src: "/earlypreview/thumbs/concierge-open.jpg",
  alt: "The opening of the Doe for Concierge film",
  video: EARLYPREVIEW_CONCIERGE_VIDEO,
  wide: true,
  film: "concierge",
  still: true,
};

/**
 * A tile whose film plays on the tile. At rest the thumbnail is the film's first frame, with the card over it. On a
 * mouse, hovering shows the middle frame. A click starts the film from the top, with sound and the film's own controls
 * (mute, full screen), and the card goes away so the controls are clear.
 */
function FilmGalleryTile({ tile, film }: { tile: GalleryTileData; film: EarlyPreviewFilmId }) {
  const src = useEarlyPreviewFilm(film);
  const posterTime = 0.04;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveredRef = useRef(false);
  const playingRef = useRef(false);
  const srcSeen = useRef(src);
  const figureRef = useRef<HTMLElement>(null);
  const filmStartRef = useRef<FilmStart>({ rewound: false });
  // The film file is only requested once the tile is near the screen (or clicked), so the tiles do not compete with the
  // hero film for bandwidth. The signed link itself is fetched at once and shared (see `useEarlyPreviewFilm`).
  const [near, setNear] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [poster, setPoster] = useState(false);
  const [playing, setPlaying] = useState(false);
  // True once the film is actually showing frames. Until then the still stays up, so a click never shows a black box.
  const [rolling, setRolling] = useState(false);
  playingRef.current = playing;
  const videoSource = useAdaptiveSrc(videoRef, src && near ? `${src}#t=${posterTime}` : undefined);
  if (srcSeen.current !== src) {
    srcSeen.current = src;
    setPoster(false);
  }

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(figure);
    return () => observer.disconnect();
  }, [near]);

  /** Seeks to the middle of the film, once its length is known (see `onLoadedMetadata`). */
  const seekToMiddle = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const middle = video.duration / 2;
    // Setting the same time again fires no `seeked`, so show the frame straight away if it is already there.
    if (video.readyState >= 2 && Math.abs(video.currentTime - middle) < 0.05) {
      setShowFrame(true);
    } else {
      video.currentTime = middle;
    }
  };

  /** The opening frame. Time 0 often stays black until a short seek makes the browser decode it. */
  const revealFirstFrame = () => {
    const video = videoRef.current;
    if (tile.still || !video || playingRef.current || hoveredRef.current) return;
    if (video.readyState >= 2 && Math.abs(video.currentTime - posterTime) < 0.2) {
      setPoster(true);
      return;
    }
    try {
      video.currentTime = posterTime;
    } catch {
      // Not seekable yet. `loadeddata` tries again.
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (tile.still || event.pointerType !== "mouse" || playing) return;
    hoveredRef.current = true;
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
    if (!video || !src) return;
    startFilm(video, filmStartRef.current);
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    // The film's own controls and the article link keep their clicks.
    if (playing || (event.target as HTMLElement).closest("a")) return;
    playingRef.current = true;
    setNear(true);
    setPlaying(true);
    startPlayback();
  };

  useEffect(() => {
    if (playing) startPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, playing]);

  const visible = playing || showFrame;

  return (
    <figure
      ref={figureRef}
      className={`earlypreview-gallery__tile earlypreview-gallery__tile--film${tile.still ? " earlypreview-gallery__tile--still" : ""}${tile.plain ? " earlypreview-gallery__tile--plain" : ""}${tile.wide ? " earlypreview-gallery__tile--wide" : ""}${playing ? " is-playing" : ""}${rolling ? " is-rolling" : ""}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        width={2500}
        height={1445}
        // The hero gallery's boxes are a full column on the iPhone (so 100vw, not the half the other grid's pair takes) and
        // are sharp screenshots of 4K films, so they are served at high quality and at the screen's full pixel width.
        sizes={
          tile.plain
            ? tile.wide
              ? "(min-width: 1024px) 80vw, 100vw"
              : "(min-width: 1024px) 45vw, 100vw"
            : tile.wide
              ? "(min-width: 1024px) 80vw, 100vw"
              : "(min-width: 1024px) 40vw, 50vw"
        }
        quality={tile.plain ? 95 : 90}
        style={tile.position ? { objectPosition: tile.position } : undefined}
      />
      <video
        ref={videoRef}
        className={`earlypreview-film${poster ? " is-poster" : ""}${visible ? " is-visible" : ""}`}
        {...videoSource}
        preload={playing ? "auto" : "metadata"}
        playsInline
        controls={playing}
        aria-label={`${tile.video.title.join(" ")}, video`}
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
          if (tile.still || playingRef.current) return;
          if (hoveredRef.current) setShowFrame(true);
          else setPoster(true);
        }}
      />
      <span className="desk2-workspace__play" aria-hidden="true">
        <svg viewBox="1.35 0 24 24" fill="currentColor">
          <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
        </svg>
      </span>
      {!tile.plain ? <EarlyPreviewVideoOverlay video={tile.video} compact={!tile.wide} /> : null}
    </figure>
  );
}

function GalleryTile({ tile }: { tile: GalleryTileData }) {
  if (tile.film) return <FilmGalleryTile tile={tile} film={tile.film} />;

  return (
    <figure className={`earlypreview-gallery__tile${tile.wide ? " earlypreview-gallery__tile--wide" : ""}`}>
      <Image
        src={tile.src}
        alt={tile.alt}
        width={2500}
        height={1445}
        sizes={tile.wide ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 1024px) 40vw, 50vw"}
        quality={90}
        style={tile.position ? { objectPosition: tile.position } : undefined}
      />
      <span className="desk2-workspace__play" aria-hidden="true">
        <svg viewBox="1.35 0 24 24" fill="currentColor">
          <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
        </svg>
      </span>
      <EarlyPreviewVideoOverlay video={tile.video} compact={!tile.wide} />
    </figure>
  );
}

/** The hospital video, in its own section under the blank section below the main video. */
export function EarlyPreviewHospitalSection({
  sectionStyle,
  titleStyle,
}: {
  /** Layout from the band above, so this section is the same height and its title and video sit at the same offsets. */
  sectionStyle?: CSSProperties;
  titleStyle?: CSSProperties;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  // The headline starts in the brown and fades to its colours when the nav reaches the section.
  useNavReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={`earlypreview-gallery earlypreview-hospital doehealth-desk2-nav-wash-surface ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Doe for Hospitals video"
      style={sectionStyle}
    >
      {/* Its own headline, matching the hero's type. The hero's reveal classes are not used, since they stay hidden outside the hero. */}
      <h2 className={`earlypreview-hospital__headline ${p22Mackinac.className}`} style={titleStyle}>
        <span className="earlypreview-hospital__line earlypreview-hospital__line--desk">Expand through clinics and</span>
        <span className="earlypreview-hospital__line earlypreview-hospital__line--salmon earlypreview-hospital__line--desk">
          finish with enterprise.
        </span>
        {/* The iPhone view breaks the title in three (and says "small clinics"), keeping the salmon clause together on the last line. */}
        <span className="earlypreview-hospital__line earlypreview-hospital__line--phone">Expand through</span>
        <span className="earlypreview-hospital__line earlypreview-hospital__line--phone">small clinics and</span>
        <span className="earlypreview-hospital__line earlypreview-hospital__line--salmon earlypreview-hospital__line--phone">
          finish with enterprise.
        </span>
      </h2>
      {/* The description under the title, in the same type as the two above it. It also keeps the wave and the video at the same height as there. */}
      <p className={`earlypreview-band__dek earlypreview-hospital__dek ${inter.className}`}>
        {EARLYPREVIEW_ENTERPRISE_DEK.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      {/* The same dot wave as the hero, in the gap between the title and the video. */}
      <div className="earlypreview-hero-wave" aria-hidden>
        <div className="earlypreview-hero-wave__fade">
          <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={0.42} amp={60} fade={0.5} />
        </div>
      </div>
      <div className="earlypreview-gallery__grid">
        <GalleryTile tile={HOSPITAL_TILE} />
      </div>
    </section>
  );
}

/**
 * /earlypreview: the three videos that sit in the beige section under the enterprise one, each a still with the same
 * play button: two side by side, then the last one full width. On hover each shows what the film covers. The grid is
 * the main video's width, so the play button is sized from the grid and matches the main video's.
 */
export function EarlyPreviewVideoGrid() {
  return (
    <div className="earlypreview-gallery__grid">
      {PAIR_TILES.map((tile) => (
        <GalleryTile key={tile.src} tile={tile} />
      ))}
      <GalleryTile tile={LAST_TILE} />
    </div>
  );
}

/** The title above each hero-gallery video, one entry per line. The first line's last word and the second line are salmon. */
const HERO_GALLERY_TITLES: Record<string, readonly [string, string]> = {
  hospitals: ["Doe for Hospitals", "& Health Systems"],
  dentists: ["Doe for Dentists", "& Home Care"],
  derm: ["Doe for Derm,", "Plastics & Aesthetics"],
  concierge: ["Doe for Concierge", "Medicine"],
};

const HERO_GALLERY_ITEMS: readonly { key: string; tile: GalleryTileData }[] = [
  // Screenshots of each film at its thumbnail time: hospitals 0:02.5, dentists (the concierge film) 0:42, derm 0:04,
  // concierge 0:57.
  {
    key: "hospitals",
    tile: { ...HOSPITAL_TILE, src: "/earlypreview/thumbs/hospitals.jpg", alt: "Doe for Hospitals film", plain: true },
  },
  {
    key: "dentists",
    tile: { ...PAIR_TILES[0], src: "/earlypreview/thumbs/dentists.jpg", alt: "Doe for Dentists film", film: "concierge", still: true, plain: true },
  },
  { key: "derm", tile: { ...PAIR_TILES[1], src: "/earlypreview/thumbs/derm.jpg", alt: "Doe for Derm film", plain: true } },
  {
    key: "concierge",
    tile: { ...LAST_TILE, src: "/earlypreview/thumbs/concierge.jpg", alt: "Doe for Concierge film", plain: true },
  },
];

/**
 * The videos attached under the hero video: Doe for Hospitals full width, the dentist and derm pair under it, then
 * Doe for Concierge full width. Each has a centred title (white with its last word salmon, then salmon) above its box,
 * in the hero's type. The boxes are the still images with the brown card (title, link, play button) always showing.
 */
export function EarlyPreviewHeroGallery() {
  const gridRef = useRef<HTMLDivElement>(null);

  // The parts come up one after another as they reach the screen: each item's title and description first, then its
  // box a beat later (see the CSS). The two side-by-side items follow each other.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll<HTMLElement>(".earlypreview-hero-gallery__item"));
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`earlypreview-gallery earlypreview-hero-gallery doehealth-desk2-nav-wash-surface ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Doe videos"
    >
      <div ref={gridRef} className="earlypreview-gallery__grid">
        {HERO_GALLERY_ITEMS.map(({ key, tile }) => {
          const [first, second] = HERO_GALLERY_TITLES[key];
          const cut = first.lastIndexOf(" ") + 1;
          return (
            <div
              key={key}
              className={`earlypreview-hero-gallery__item${tile.wide ? " earlypreview-gallery__tile--wide" : ""}`}
            >
              {/* Hospitals and Concierge sit between the dot tides from the second section's Index screen, one on each side. */}
              {key === "hospitals" || key === "concierge" ? (
                <div className="doehealth-desk2-visible__tide earlypreview-hero-gallery__tide" aria-hidden>
                  <DoeHealthDesk2DotTide color="rgba(252, 207, 184, 0.6)" />
                </div>
              ) : null}
              {/* iPhone: the hero's dot wave (same box, dots and fade) in the space above Derm, out of the layout. */}
              {key === "derm" ? (
                <div className="earlypreview-hero-wave earlypreview-hero-gallery__wave" aria-hidden>
                  <div className="earlypreview-hero-wave__fade">
                    <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={0.42} amp={60} fade={0.5} />
                  </div>
                </div>
              ) : null}
              <div className="earlypreview-hero-gallery__caption">
                <h3 className={`earlypreview-hero-gallery__title ${p22Mackinac.className}`}>
                  <span className="earlypreview-hero-gallery__line">
                    {first.slice(0, cut)}
                    <span className="earlypreview-hero-gallery__line--salmon">{first.slice(cut)}</span>
                  </span>
                  <span className="earlypreview-hero-gallery__line earlypreview-hero-gallery__line--salmon">{second}</span>
                </h3>
                {tile.video.link ? (
                  <Link href={tile.video.link.href} className="earlypreview-overlay__link earlypreview-hero-gallery__link earlypreview-hero-gallery__link--title">
                    <span className="earlypreview-overlay__label">{tile.video.link.label}</span>
                    <span className="earlypreview-overlay__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ) : null}
              </div>
              <GalleryTile tile={tile} />
              {/* iPhone: "See Article" sits under the video box instead of under the title, without the arrow. */}
              {tile.video.link ? (
                <Link href={tile.video.link.href} className="earlypreview-overlay__link earlypreview-hero-gallery__link earlypreview-hero-gallery__link--box">
                  <span className="earlypreview-overlay__label">{tile.video.link.label}</span>
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
