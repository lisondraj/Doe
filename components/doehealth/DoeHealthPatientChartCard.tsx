import { Product2CallHistoryChartMosaic } from "@/components/product2/Product2CallHistoryChartMosaic";
import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/product2/product2-landing.css";
import { suisseIntl } from "@/lib/home/fonts";

/** Patient chart mosaic — bare on iPhone brown band; desktop gets console shell via CSS. */
export function DoeHealthPatientChartCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`doehealth-patient-chart${className ? ` ${className}` : ""} ${suisseIntl.className}`}
      aria-label="Patient chart, recent labs vitals medications and visits"
    >
      <div className="doehealth-patient-chart__stage">
        <Product2CallHistoryChartMosaic />
      </div>
    </div>
  );
}
