import Image from "next/image";
import { type CSSProperties, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { EarlyPreviewVideoOverlay } from "@/components/earlypreview/EarlyPreviewVideoOverlay";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { EARLYPREVIEW_ENTERPRISE_DEK } from "@/lib/earlypreview/earlypreview-hero-copy";
import { useNavReveal } from "@/lib/earlypreview/use-nav-reveal";
import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";
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
  src: "/doehealthdesk2/golden-loft.png",
  alt: "A golden-lit loft",
  video: EARLYPREVIEW_HOSPITALS_VIDEO,
  wide: true,
  film: "hospitals",
};

type GalleryTileData = {
  src: string;
  alt: string;
  video: EarlyPreviewVideo;
  wide?: boolean;
  position?: string;
  /** The film itself, if it plays in place on the tile. Its first frame is the thumbnail. */
  film?: EarlyPreviewFilmId;
  /** Shows the still image as the thumbnail, never the film's frame. The film still plays in place on a click. */
  still?: boolean;
  /** Shows the film's own frame at this second as the thumbnail, with only the centred play button (no card). */
  frameAt?: number;
};

/** Two videos side by side, the first row of the beige section's video grid. */
const PAIR_TILES: readonly GalleryTileData[] = [
  {
    src: "/doehealthdesk2/sunlit-minimalist-wooden-stools.jpg",
    alt: "Sunlit room with minimalist wooden stools",
    video: EARLYPREVIEW_BEYOND_VIDEO,
  },
  {
    src: "/doehealthdesk2/other.png",
    alt: "A calm, sunlit interior",
    video: EARLYPREVIEW_AESTHETICS_VIDEO,
    film: "derm",
  },
];

/** The last video, full width, under the pair. */
const LAST_TILE: GalleryTileData = {
  src: "/doehealthdesk2/newhero.jpg",
  alt: "A bright, minimal lounge by a sunlit window",
  video: EARLYPREVIEW_CONCIERGE_VIDEO,
  position: "20% 50%",
  wide: true,
  film: "concierge",
};

/**
 * A tile whose film plays on the tile. At rest the thumbnail is the film's first frame, with the card over it. On a
 * mouse, hovering shows the middle frame. A click starts the film from the top, with sound and the film's own controls
 * (mute, full screen), and the card goes away so the controls are clear.
 */
function FilmGalleryTile({ tile, film }: { tile: GalleryTileData; film: EarlyPreviewFilmId }) {
  const src = useEarlyPreviewFilm(film);
  const posterTime = tile.frameAt ?? 0.04;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveredRef = useRef(false);
  const playingRef = useRef(false);
  const srcSeen = useRef(src);
  const [showFrame, setShowFrame] = useState(false);
  const [poster, setPoster] = useState(false);
  const [playing, setPlaying] = useState(false);
  playingRef.current = playing;
  if (srcSeen.current !== src) {
    srcSeen.current = src;
    setPoster(false);
  }

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
    if (tile.still || tile.frameAt !== undefined || event.pointerType !== "mouse" || playing) return;
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
    video.muted = false;
    try {
      video.currentTime = 0;
    } catch {
      // Metadata may not be in yet. `onLoadedMetadata` starts it from the top.
    }
    void video.play();
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    // The film's own controls and the article link keep their clicks.
    if (playing || (event.target as HTMLElement).closest("a")) return;
    playingRef.current = true;
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
      className={`earlypreview-gallery__tile earlypreview-gallery__tile--film${tile.still ? " earlypreview-gallery__tile--still" : ""}${tile.frameAt !== undefined ? " earlypreview-gallery__tile--plain" : ""}${tile.wide ? " earlypreview-gallery__tile--wide" : ""}${playing ? " is-playing" : ""}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        width={2500}
        height={1445}
        sizes={tile.wide ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 1024px) 40vw, 50vw"}
        style={tile.position ? { objectPosition: tile.position } : undefined}
      />
      <video
        ref={videoRef}
        className={`earlypreview-film${poster ? " is-poster" : ""}${visible ? " is-visible" : ""}`}
        src={src ? `${src}#t=${posterTime}` : undefined}
        preload={tile.still ? "none" : "metadata"}
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
      {tile.frameAt === undefined ? <EarlyPreviewVideoOverlay video={tile.video} compact={!tile.wide} /> : null}
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

/** The title above each hero-gallery video, one entry per line (the first white, the second salmon), and a description. */
const HERO_GALLERY_CAPTIONS: Record<string, { title: readonly [string, string]; dek: string }> = {
  hospitals: {
    title: ["Doe for", "Hospitals & Health Systems"],
    dek: "One front door for every patient, across every site, built to scale through enterprise.",
  },
  dentists: {
    title: ["Doe for", "Dentists"],
    dek: "Calls, scheduling and follow-ups handled, so the chair stays full and the team stays focused.",
  },
  derm: {
    title: ["Doe for", "Derm & Plastic Surgery"],
    dek: "Consults, before-and-afters and aftercare, answered the way your practice would.",
  },
  concierge: {
    title: ["Doe for", "Concierge Medicine"],
    dek: "Round-the-clock access for members, with the personal touch your practice is known for.",
  },
};

const HERO_GALLERY_ITEMS: readonly { key: string; tile: GalleryTileData }[] = [
  { key: "hospitals", tile: { ...HOSPITAL_TILE, frameAt: 2 } },
  { key: "dentists", tile: { ...PAIR_TILES[0], still: true } },
  { key: "derm", tile: { ...PAIR_TILES[1], frameAt: 4 } },
  { key: "concierge", tile: { ...LAST_TILE, frameAt: 57 } },
];

/**
 * The videos attached under the hero video: Doe for Hospitals full width, the dentist and derm pair under it, then
 * Doe for Concierge full width. Each has a centred title (white, then salmon) and description above its box, in the
 * hero's type. The boxes are the still images with the brown card (title, link, play button) always showing.
 */
export function EarlyPreviewHeroGallery() {
  return (
    <section
      className={`earlypreview-gallery earlypreview-hero-gallery ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Doe videos"
    >
      <div className="earlypreview-gallery__grid">
        {HERO_GALLERY_ITEMS.map(({ key, tile }) => {
          const caption = HERO_GALLERY_CAPTIONS[key];
          return (
            <div
              key={key}
              className={`earlypreview-hero-gallery__item${tile.wide ? " earlypreview-gallery__tile--wide" : ""}`}
            >
              <div className="earlypreview-hero-gallery__caption">
                <h3 className={`earlypreview-hero-gallery__title ${p22Mackinac.className}`}>
                  <span className="earlypreview-hero-gallery__line">{caption.title[0]}</span>
                  <span className="earlypreview-hero-gallery__line earlypreview-hero-gallery__line--salmon">
                    {caption.title[1]}
                  </span>
                </h3>
                <p className={`earlypreview-hero-gallery__dek ${inter.className}`}>{caption.dek}</p>
              </div>
              <GalleryTile tile={tile} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
