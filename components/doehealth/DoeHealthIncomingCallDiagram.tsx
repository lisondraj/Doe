import { DoeHealthCallHistoryDiagram } from "@/components/doehealth/DoeHealthCallHistoryDiagram";
import { DoeHealthCallSummaryCard } from "@/components/doehealth/DoeHealthCallSummaryCard";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Intro band — Sarah Westfield call card (left) + overlapping call summary (bottom-right). */
export function DoeHealthIncomingCallDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={`doehealth-intro-call-sequence doehealth-content-rail${className ? ` ${className}` : ""}`}>
      <div className="doehealth-intro-call-sequence__stage">
        <DoeHealthCallHistoryDiagram className="doehealth-intro-call-sequence__call-card" showConditions={false} />
      </div>
      <DoeHealthCallSummaryCard className="doehealth-intro-call-sequence__summary-card" />
    </div>
  );
}
