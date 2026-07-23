import { DoeHealthCallHistoryScroll } from "@/components/doehealth/DoeHealthCallHistoryScroll";
import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { DOEHEALTH_CALL_HISTORY_INTRO_TURNS, DOEHEALTH_CALL_HISTORY_TREE } from "@/lib/doehealth/doehealth-call-history-tree";
import "@/lib/doehealth/doehealth-initiatives.css";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import "@/lib/product2/product2-landing.css";

/** Centered call history tree — product2 brown / gold card styling. */
export function DoeHealthCallHistoryDiagram({
  className = "",
  width = "default",
  showConditions = true,
  showCallHistory = true,
}: {
  className?: string;
  width?: "default" | "wide";
  showConditions?: boolean;
  showCallHistory?: boolean;
}) {
  const { heroName, phone, totalDuration, conditions } = DOEHEALTH_CALL_HISTORY_TREE;
  const conditionsLabel = conditions.join(", ");

  return (
    <div
      className={`doehealth-initiatives doehealth-initiatives--${width} ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      aria-label={
        showConditions
          ? `${heroName}, Called ${phone}, ${totalDuration}, ${conditionsLabel}`
          : `${heroName}, Called ${phone}, ${totalDuration}`
      }
    >
      <div className="doehealth-initiatives__card">
        <div className="doehealth-initiatives__hero-block">
          <div className="doehealth-initiatives__hero-row">
            <h2 className={`doehealth-initiatives__hero doehealth-initiatives__hero--bold ${dmSans.className}`}>
              {heroName}
            </h2>
            <span className={`doehealth-initiatives__hero-duration ${dmSans.className}`}>{totalDuration}</span>
          </div>
          <p className={`doehealth-initiatives__called-line ${suisseIntl.className}`}>
            <span className="doehealth-initiatives__called-prefix">Called </span>
            <span className={`doehealth-initiatives__called-number ${dmSans.className}`}>{phone}</span>
          </p>
        </div>

        {showConditions ? (
          <ul className="doehealth-initiatives__conditions" aria-label="Active conditions">
            {conditions.map((condition) => (
              <li key={condition} className={`doehealth-initiatives__condition ${dmSans.className}`}>
                {condition}
              </li>
            ))}
          </ul>
        ) : null}

        {showCallHistory ? (
          <DoeHealthCallHistoryScroll>
            <Product2LandingLiveThread
              className="product-call-history-rail__thread doehealth-initiatives__call-history"
              showOutcome={false}
              showActions={false}
              showChartProfile={false}
              turns={DOEHEALTH_CALL_HISTORY_INTRO_TURNS}
            />
          </DoeHealthCallHistoryScroll>
        ) : null}
      </div>
    </div>
  );
}
