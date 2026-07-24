import { Product2DaySummaryLast24h } from "@/components/product2/Product2DaySummaryLast24h";
import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/product2/product2-landing.css";
import { suisseIntl } from "@/lib/home/fonts";

/** Intro band — Dr. Chen day summary in the same brown console card as Sarah Westfield. */
export function DoeHealthDaySummaryCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`doehealth-initiatives doehealth-initiatives--wide doehealth-day-summary${className ? ` ${className}` : ""} ${suisseIntl.className}`}
      aria-label="Good morning, Dr. Chen, last 24 hours call summary"
    >
      <div className="doehealth-initiatives__card doehealth-day-summary__card">
        <div className="product-landing-call__stage doehealth-day-summary__stage">
          <Product2DaySummaryLast24h inConsole />
        </div>
      </div>
    </div>
  );
}
