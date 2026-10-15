import type { DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";

type DoeHealthBlogPlaceholderProps = {
  tone: DoeHealthBlogPlaceholderTone;
  className?: string;
};

/** Flat tinted image slot with a small picture glyph — stands in for article art. */
export function DoeHealthBlogPlaceholder({ tone, className = "" }: DoeHealthBlogPlaceholderProps) {
  return (
    <div className={`doehealth-blog-placeholder doehealth-blog-placeholder--${tone} ${className}`} aria-hidden>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.3" />
        <path d="m3.5 17 5-4.5 3.5 3 3-2.5 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
