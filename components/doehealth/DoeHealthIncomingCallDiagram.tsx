import { DoeHealthCallHistoryDiagram } from "@/components/doehealth/DoeHealthCallHistoryDiagram";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Intro band — Sarah Westfield call history card (product2 brown / gold console). */
export function DoeHealthIncomingCallDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={`doehealth-intro-call-sequence${className ? ` ${className}` : ""}`}>
      <div className="doehealth-intro-call-sequence__stack">
        <DoeHealthCallHistoryDiagram className="doehealth-intro-call-sequence__call-card" showConditions={false} />
      </div>
    </div>
  );
}
