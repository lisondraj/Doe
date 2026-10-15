import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import type { DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";

type DoeHealthBlogPlaceholderProps = {
  tone: DoeHealthBlogPlaceholderTone;
  className?: string;
  /** Draws the video1 dot wave on the box, in dots matched to its tone. */
  pattern?: boolean;
};

/** Background and dot colour for each tone. `sand` is the beige box; its dots are video1's dot colour. */
const PATTERN_COLORS: Record<DoeHealthBlogPlaceholderTone, { bg: string; dot: string }> = {
  sand: { bg: "#f3ead9", dot: "#C2A987" },
  salmon: { bg: "#fde3d4", dot: "#E9A98A" },
  sage: { bg: "#e3e8d8", dot: "#9FAE8A" },
  brown: { bg: "#281910", dot: "#6E5C40" },
};

/** Flat tinted image slot that stands in for article art. */
export function DoeHealthBlogPlaceholder({ tone, className = "", pattern = false }: DoeHealthBlogPlaceholderProps) {
  if (!pattern) {
    return <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--${tone} ${className}`} aria-hidden />;
  }
  const { bg, dot } = PATTERN_COLORS[tone];
  return (
    <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--pattern ${className}`} style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotWave color={dot} />
    </div>
  );
}
