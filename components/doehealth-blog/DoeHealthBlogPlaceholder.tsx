import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

type DoeHealthBlogPlaceholderProps = {
  tone: DoeHealthBlogPlaceholderTone;
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
const PATTERN_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#F7E6C4", dot: "#D4AE7A" },
  panel: { bg: "#F5F2EC", dot: "#C9BDA8" },
  cream: { bg: "#FBF5E6", dot: "#E2CB9F" },
  gold: { bg: "#F8D9A8", dot: "#E8B679" },
  clay: { bg: "#F4CDB0", dot: "#E0A67F" },
  umber: { bg: "#E4D5C0", dot: "#A8917A" },
};

/** Flat tinted image slot that stands in for article art. */
export function DoeHealthBlogPlaceholder({
  tone,
  className = "",
  pattern = false,
  wave,
  motion = false,
  children,
}: DoeHealthBlogPlaceholderProps) {
  if (!pattern) {
    return <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--${tone} ${className}`} aria-hidden />;
  }
  const { bg, dot } = PATTERN_COLORS[tone];
  return (
    <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--pattern ${className}`} style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotWave color={dot} motion={motion} {...wave} />
      {children ? <div className="doehealth-blog-placeholder__content">{children}</div> : null}
    </div>
  );
}
