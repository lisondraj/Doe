import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import type { DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";

type DoeHealthBlogPlaceholderProps = {
  tone: DoeHealthBlogPlaceholderTone;
  className?: string;
  /** Draws the video1 dot wave on the box, in dots matched to its tone. */
  pattern?: boolean;
  /** Animates the dot wave; omitted (or false) holds it on one still frame — every box but the article hero. */
  motion?: boolean;
};

/** Background and dot colour for each tone — Doe brand colours only (see DESIGNERS_BRAND_COLORS). */
const PATTERN_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#F2D8A8", dot: "#B9814A" },
  panel: { bg: "#EDE8DF", dot: "#B3A68C" },
  cream: { bg: "#FAF0D8", dot: "#D9BE8E" },
  gold: { bg: "#E8A060", dot: "#A85A2E" },
  clay: { bg: "#C45C42", dot: "#F2D8A8" },
  umber: { bg: "#1A1208", dot: "#6E5540" },
};

/** Flat tinted image slot that stands in for article art. */
export function DoeHealthBlogPlaceholder({ tone, className = "", pattern = false, motion = false }: DoeHealthBlogPlaceholderProps) {
  if (!pattern) {
    return <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--${tone} ${className}`} aria-hidden />;
  }
  const { bg, dot } = PATTERN_COLORS[tone];
  return (
    <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--pattern ${className}`} style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotWave color={dot} motion={motion} />
    </div>
  );
}
