import Image from "next/image";
import { type CSSProperties, useEffect, useRef } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DOEHEALTH_DESK2_NAV_WASH_EVENT } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { EarlyPreviewVideoOverlay } from "@/components/earlypreview/EarlyPreviewVideoOverlay";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { EARLYPREVIEW_ENTERPRISE_DEK } from "@/lib/earlypreview/earlypreview-hero-copy";
import { useNavReveal } from "@/lib/earlypreview/use-nav-reveal";
import {
  EARLYPREVIEW_AESTHETICS_VIDEO,
  EARLYPREVIEW_BEYOND_VIDEO,
  EARLYPREVIEW_CONCIERGE_VIDEO,
  EARLYPREVIEW_HOSPITALS_VIDEO,
  type EarlyPreviewVideo,
} from "@/lib/earlypreview/earlypreview-videos";

/** The hospital video has its own section, under the blank section below the main video. */
const HOSPITAL_TILE: { src: string; alt: string; video: EarlyPreviewVideo; wide?: boolean; position?: string } = {
  src: "/doehealthdesk2/golden-loft.png",
  alt: "A golden-lit loft",
  video: EARLYPREVIEW_HOSPITALS_VIDEO,
  wide: true,
};

type GalleryTileData = { src: string; alt: string; video: EarlyPreviewVideo; wide?: boolean; position?: string };

/** Two videos side by side, the first row of the beige section's video grid. */
const PAIR_TILES: readonly GalleryTileData[] = [
  {
    src: "/doehealthdesk2/sunlit-minimalist-wooden-stools.jpg",
    alt: "Sunlit room with minimalist wooden stools",
    video: EARLYPREVIEW_BEYOND_VIDEO,
  },
  { src: "/doehealthdesk2/other.png", alt: "A calm, sunlit interior", video: EARLYPREVIEW_AESTHETICS_VIDEO },
];

/** The last video, full width, under the pair. */
const LAST_TILE: GalleryTileData = {
  src: "/doehealthdesk2/newhero.jpg",
  alt: "A bright, minimal lounge by a sunlit window",
  video: EARLYPREVIEW_CONCIERGE_VIDEO,
  position: "20% 50%",
  wide: true,
};

function GalleryTile({ tile }: { tile: GalleryTileData }) {
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
  // The section starts beige, like the band above it, and fades to brown when the nav reaches it. The headline starts
  // in the brown and fades to its colours at the same time.
  useNavReveal(sectionRef);
  // While the section is still beige the nav reads as beige. Once it has faded to brown, the nav follows.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const syncNavBeige = () => {
      const revealed = el.classList.contains("is-in");
      const next = revealed ? "0" : "1";
      if (el.getAttribute("data-nav-beige") === next) return;
      el.setAttribute("data-nav-beige", next);
      window.dispatchEvent(new Event(DOEHEALTH_DESK2_NAV_WASH_EVENT));
    };
    syncNavBeige();
    const observer = new MutationObserver(syncNavBeige);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`earlypreview-gallery earlypreview-hospital doehealth-desk2-nav-wash-surface ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      data-nav-beige="1"
      aria-label="Doe for Hospitals video"
      style={sectionStyle}
    >
      {/* Its own headline, matching the hero's type. The hero's reveal classes are not used, since they stay hidden outside the hero. */}
      <h2 className={`earlypreview-hospital__headline ${p22Mackinac.className}`} style={titleStyle}>
        <span className="earlypreview-hospital__line">Expand through clinics and</span>
        <span className="earlypreview-hospital__line earlypreview-hospital__line--salmon">finish with enterprise.</span>
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
