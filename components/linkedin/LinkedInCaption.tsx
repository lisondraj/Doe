import { ABOUT_PATH } from "@/lib/site-domains";
import {
  LINKEDIN_BYLINE,
  LINKEDIN_DATE,
  LINKEDIN_HEADLINE_LINES,
  LINKEDIN_READ_MORE_LABEL,
} from "@/lib/linkedin/linkedin-copy";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

function LinkedInReadMoreArrow() {
  return (
    <svg className="linkedin-caption__read-more-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
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

/** Bottom-right LinkedIn capture copy — gold headline, byline, read more. */
export function LinkedInCaption() {
  return (
    <div className="linkedin-caption">
      <h1 className={`linkedin-caption__headline ${suisseIntl.className}`}>
        {LINKEDIN_HEADLINE_LINES[0]}
        <br />
        {LINKEDIN_HEADLINE_LINES[1]}
      </h1>

      <p className={`linkedin-caption__byline ${dmSans.className}`}>
        {LINKEDIN_BYLINE}
        <span className="mx-[0.45em] text-[0.72em] opacity-70" aria-hidden>
          ·
        </span>
        <span className="linkedin-caption__date">{LINKEDIN_DATE}</span>
      </p>

      <a href={ABOUT_PATH} className={`linkedin-caption__read-more ${dmSans.className}`}>
        {LINKEDIN_READ_MORE_LABEL}
        <LinkedInReadMoreArrow />
      </a>
    </div>
  );
}
