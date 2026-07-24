import { DOEHEALTH_CALL_SUMMARY } from "@/lib/doehealth/doehealth-call-history-tree";
import "@/lib/doehealth/doehealth-initiatives.css";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

function SummaryPointCheckIcon() {
  return (
    <svg className="doehealth-call-summary__point-check" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.25 6.1 4.65 8.5 9.75 3.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Intro band — overlapping call summary card (bottom-right of Sarah Westfield card). */
export function DoeHealthCallSummaryCard({ className = "" }: { className?: string }) {
  const { title, answeredBy, points } = DOEHEALTH_CALL_SUMMARY;

  return (
    <aside
      className={`doehealth-call-summary doehealth-initiatives__card ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      aria-label={`${title}, ${answeredBy}`}
    >
      <h3 className={`doehealth-call-summary__title ${dmSans.className}`}>{title}</h3>
      <p className={`doehealth-call-summary__agent ${suisseIntl.className}`}>{answeredBy}</p>
      <ul className="doehealth-call-summary__points">
        {points.map((point) => (
          <li key={point} className={`doehealth-call-summary__point ${dmSans.className}`}>
            <span className="doehealth-call-summary__point-check-wrap" aria-hidden>
              <SummaryPointCheckIcon />
            </span>
            <span className="doehealth-call-summary__point-label">{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
