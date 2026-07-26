import { DoePhoneHomePriorAuthVisual } from "@/components/doephone/DoePhoneHomePriorAuthVisual";

/** Last left-bleed overlay — main-page prior auth brown UI (iPhone). */
export function DoeHealthPriorAuthBleedUi() {
  return (
    <div className="doehealth-prior-auth-bleed" aria-hidden>
      <div className="home-feature-section__prior-auth relative z-[20] w-full min-h-0 flex-1">
        <DoePhoneHomePriorAuthVisual />
      </div>
    </div>
  );
}
