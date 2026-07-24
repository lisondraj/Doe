import { Product2ActiveAgentsOrbit } from "@/components/product2/Product2ActiveAgentsOrbit";
import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/product2/product2-landing.css";
import { suisseIntl } from "@/lib/home/fonts";

/** Active agents orbit — no outer console shell, sits directly on the brown band. */
export function DoeHealthActiveAgentsCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`doehealth-active-agents${className ? ` ${className}` : ""} ${suisseIntl.className}`}
      aria-label="Seven active agents"
    >
      <div className="doehealth-active-agents__stage">
        <Product2ActiveAgentsOrbit
          showEditButton={false}
          showAgentIcons={false}
          variant="brown-console"
          className="doehealth-active-agents__orbit"
        />
      </div>
    </div>
  );
}
