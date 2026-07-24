import { DoeHealthRoutedCallsShaderPanel } from "@/components/doehealth/DoeHealthRoutedCallsShaderPanel";
import "@/lib/doehealth/doehealth-initiatives.css";

/** /doehealth — routed calls shader shell on the brown band. */
export function DoeHealthRoutedCallsCard({ className = "" }: { className?: string }) {
  return (
    <div className={`doehealth-routed-calls${className ? ` ${className}` : ""}`}>
      <div className="doehealth-routed-calls__shader-card">
        <DoeHealthRoutedCallsShaderPanel />
      </div>
    </div>
  );
}
