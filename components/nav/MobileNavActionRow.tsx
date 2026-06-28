import { MobileMainNavCta } from "@/components/nav/MobileMainNavCta";
import { MobileNavEmailButton } from "@/components/nav/MobileNavEmailButton";

const MOBILE_NAV_ACTION_ROW_GAP =
  "gap-3 iphone-page:gap-[clamp(0.55rem,0.42rem+0.72vmin,0.82rem)]";

/** iPhone nav — mail icon + investors split button. */
export function MobileNavActionRow() {
  return (
    <div className={`flex shrink-0 items-center ${MOBILE_NAV_ACTION_ROW_GAP}`}>
      <MobileNavEmailButton />
      <MobileMainNavCta />
    </div>
  );
}
