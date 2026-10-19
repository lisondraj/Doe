import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

type DoeHealthBlogPlaceholderProps = {
  tone: DoeHealthBlogPlaceholderTone;
  /** A one-off background and dot colour, for a band that needs its own brightness. Overrides the tone's colours. */
  colors?: { bg: string; dot: string };
  className?: string;
  /** Draws the video1 dot wave on the box, in dots matched to its tone. */
  pattern?: boolean;
  /** Wave shape for this article; omitted keeps the default wave. */
  wave?: DoeHealthBlogWave;
  /** Animates the dot wave; omitted (or false) holds it on one still frame — every box but the article hero. */
  motion?: boolean;
  /** Content laid over the dot wave (pattern boxes only). */
  children?: React.ReactNode;
};

/**
 * Background and dot colour for each tone: the original Doe tone families, lightened well away from the deep
 * originals (no pink; the Doe salmon is fine). The tone names are the original ones.
 */
export const PATTERN_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#F7E6C4", dot: "#D4AE7A" },
  panel: { bg: "#F5F2EC", dot: "#C9BDA8" },
  cream: { bg: "#FBF5E6", dot: "#E2CB9F" },
  gold: { bg: "#F8D9A8", dot: "#E8B679" },
  clay: { bg: "#F4CDB0", dot: "#E0A67F" },
  umber: { bg: "#E4D5C0", dot: "#A8917A" },
};

/**
 * Article and news boxes use light warm beige: not pure white, no pink, and nothing deep. Each tone keeps its own
 * shade so the boxes differ slightly, and the dot colours sit a step darker so the pattern still reads.
 */
const ARTICLE_BOX_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#FAF1DD", dot: "#D4AE7A" },
  panel: { bg: "#F8F2E4", dot: "#C9BDA8" },
  cream: { bg: "#FBF4E2", dot: "#D9BC8A" },
  gold: { bg: "#FBF0D9", dot: "#E0AB62" },
  clay: { bg: "#FAF0E0", dot: "#CDAE84" },
  umber: { bg: "#F9F1E0", dot: "#A8917A" },
};

/** Background and dot colour for a box on /news or inside an article. */
export function articleBoxColors(tone: DoeHealthBlogPlaceholderTone): { bg: string; dot: string } {
  return ARTICLE_BOX_COLORS[tone];
}

/** Flat tinted image slot that stands in for article art. */
export function DoeHealthBlogPlaceholder({
  tone,
  colors,
  className = "",
  pattern = false,
  wave,
  motion = false,
  children,
}: DoeHealthBlogPlaceholderProps) {
  if (!pattern) {
    return <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--${tone} ${className}`} aria-hidden />;
  }
  const { bg, dot } = colors ?? PATTERN_COLORS[tone];
  return (
    <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--pattern ${className}`} style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotWave color={dot} motion={motion} {...wave} />
      {children ? <div className="doehealth-blog-placeholder__content">{children}</div> : null}
    </div>
  );
}
