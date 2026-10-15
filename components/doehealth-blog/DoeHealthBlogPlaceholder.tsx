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

/**
 * Background and dot colour for each tone — the /doehealthdesk2 site palette only: cream, beige, and peach,
 * with its muted brown for dots. The tone names are legacy; they no longer mean the old deep colours.
 */
const PATTERN_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#F4EEDF", dot: "#6E5C40" },
  panel: { bg: "#F2E8DA", dot: "rgba(110, 92, 64, 0.6)" },
  cream: { bg: "#F8F4EB", dot: "rgba(110, 92, 64, 0.45)" },
  gold: { bg: "#FCCFB8", dot: "#6E5C40" },
  clay: { bg: "#F6D3C4", dot: "rgba(110, 92, 64, 0.8)" },
  umber: { bg: "#E6DAC2", dot: "#6E5C40" },
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
