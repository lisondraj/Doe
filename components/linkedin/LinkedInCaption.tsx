import {
  LINKEDIN_BYLINE,
  LINKEDIN_DATE,
  LINKEDIN_HEADLINE_LINES,
  LINKEDIN_MEMO_LABEL,
  LINKEDIN_READ_MORE_LABEL,
} from "@/lib/linkedin/linkedin-copy";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

function LinkedInCommentsArrow() {
  return (
    <svg className="linkedin-caption__comments-cta-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h9M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bottom-right LinkedIn capture copy — gold headline, byline, comments CTA. */
export function LinkedInCaption() {
  return (
    <div className="linkedin-caption">
      <p className={`linkedin-caption__memo ${dmSans.className}`}>{LINKEDIN_MEMO_LABEL}</p>

      <h1 className={`linkedin-caption__headline ${suisseIntl.className}`}>
        <span className="linkedin-caption__headline-line">{LINKEDIN_HEADLINE_LINES[0]}</span>
        <span className="linkedin-caption__headline-line">{LINKEDIN_HEADLINE_LINES[1]}</span>
      </h1>

      <p className={`linkedin-caption__byline ${dmSans.className}`}>
        {LINKEDIN_BYLINE}
        <span className="mx-[0.45em] text-[0.72em] opacity-70" aria-hidden>
          ·
        </span>
        <span className="linkedin-caption__date">{LINKEDIN_DATE}</span>
      </p>

      <p className={`linkedin-caption__comments-cta ${dmSans.className}`}>
        {LINKEDIN_READ_MORE_LABEL}
        <LinkedInCommentsArrow />
      </p>
    </div>
  );
}
