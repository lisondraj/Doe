import { LinkedIn2ModelDropdown } from "@/components/linkedin/LinkedIn2ModelDropdown";
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

/** /linkedin2 — caption copy with static model dropdown to the right. */
export function LinkedIn2Caption() {
  return (
    <div className="linkedin2-banner">
      <div className="linkedin-caption linkedin2-caption">
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

        <p className={`linkedin-caption__read-more ${dmSans.className}`}>
          {LINKEDIN_READ_MORE_LABEL}
          <LinkedInReadMoreArrow />
        </p>
      </div>

      <LinkedIn2ModelDropdown />
    </div>
  );
}
