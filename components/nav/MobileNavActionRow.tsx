import { MobileMainNavCta } from "@/components/nav/MobileMainNavCta";
import { MobileNavEmailButton } from "@/components/nav/MobileNavEmailButton";

const MOBILE_NAV_ACTION_ROW_GAP =
  "gap-2.5 iphone-page:gap-[clamp(0.45rem,0.35rem+0.65vmin,0.7rem)]";

/** iPhone nav — mail icon + investors split button. */
export function MobileNavActionRow() {
  return (
    <div className={`flex shrink-0 items-center ${MOBILE_NAV_ACTION_ROW_GAP}`}>
      <MobileNavEmailButton />
      <MobileMainNavCta />
    </div>
  );
}
