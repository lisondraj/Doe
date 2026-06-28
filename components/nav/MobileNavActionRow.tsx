import { MobileMainNavCta } from "@/components/nav/MobileMainNavCta";
import { MobileNavEmailButton } from "@/components/nav/MobileNavEmailButton";

const MOBILE_NAV_ACTION_ROW_GAP =
  "gap-3 iphone-page:gap-[clamp(0.55rem,0.42rem+0.72vmin,0.82rem)]";

export type MobileNavActionChrome = {
  bg?: string;
  fg?: string;
  shadow?: string;
  divider?: string;
};

/** iPhone nav — mail icon + investors split button. */
export function MobileNavActionRow({
  bg,
  fg,
  shadow,
  divider,
}: MobileNavActionChrome = {}) {
  const chrome = { bg, fg, shadow, divider };

  return (
    <div className={`flex shrink-0 items-center ${MOBILE_NAV_ACTION_ROW_GAP}`}>
      <MobileNavEmailButton {...chrome} />
      <MobileMainNavCta {...chrome} />
    </div>
  );
}
