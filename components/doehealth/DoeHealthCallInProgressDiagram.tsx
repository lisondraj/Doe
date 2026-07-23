import { CallProgressPhoneIcon } from "@/components/doehealth/DoeHealthCallProgressPhoneIcon";
import { DOEHEALTH_CALL_IN_PROGRESS } from "@/lib/doehealth/doehealth-call-history-tree";
import "@/lib/doehealth/doehealth-initiatives.css";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

/** Live-call card — product2 brown / gold console styling. */
export function DoeHealthCallInProgressDiagram({ className = "" }: { className?: string }) {
  const { callerName, duration, phone, pickedUpBy } = DOEHEALTH_CALL_IN_PROGRESS;

  return (
    <div
      className={`doehealth-initiatives ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      aria-label={`${callerName}, ${pickedUpBy.prefix} ${pickedUpBy.agent}`}
    >
      <div className="doehealth-initiatives__card doehealth-call-progress__card">
        <div className="doehealth-call-progress__head">
          <h2 className={`doehealth-initiatives__hero doehealth-call-progress__name ${dmSans.className}`}>
            {callerName}
          </h2>
          <span className={`doehealth-call-progress__duration ${dmSans.className}`}>{duration}</span>
        </div>

        <div className="doehealth-call-progress__phone-row">
          <span className="doehealth-call-progress__phone-icon" aria-hidden>
            <CallProgressPhoneIcon />
          </span>
          <p className={`doehealth-call-progress__phone ${dmSans.className}`}>{phone}</p>
        </div>

        <p className={`doehealth-call-progress__agent ${suisseIntl.className}`}>
          <span className="doehealth-call-progress__agent-prefix">{pickedUpBy.prefix} </span>
          <span className={`doehealth-call-progress__agent-name ${dmSans.className}`}>{pickedUpBy.agent}</span>
        </p>
      </div>
    </div>
  );
}
