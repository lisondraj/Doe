import {
  ABOUT_STYLE_BULLET_ITEM_TW,
  ABOUT_STYLE_BULLET_LIST_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans } from "@/lib/home/fonts";
import {
  CAMPUS_AMBASSADOR_BENEFITS_HEADING,
  CAMPUS_AMBASSADOR_BENEFITS_ITEMS,
} from "@/lib/join/campus-ambassador-copy";

/** /join — raised benefits panel above the application survey. */
export function CampusAmbassadorBenefitsPanel() {
  return (
    <aside
      className={`campus-ambassador-benefits-panel relative flex w-full flex-col overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[#271F17] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Campus Ambassador Program benefits"
    >
      <div className="relative z-10 flex w-full flex-col gap-5 px-6 py-8 iphone-page:gap-6 iphone-page:px-8 iphone-page:py-10">
        <h2
          className={`campus-ambassador-benefits-panel__heading broader-doe-thesis-headline broader-doe-thesis-headline-gold m-0 font-medium leading-[1.12] tracking-[-0.02em] ${dmSans.className}`}
        >
          {CAMPUS_AMBASSADOR_BENEFITS_HEADING}
        </h2>

        <ul className={`campus-ambassador-benefits-panel__list ${ABOUT_STYLE_BULLET_LIST_TW}`}>
          {CAMPUS_AMBASSADOR_BENEFITS_ITEMS.map((item) => (
            <li key={item} className={ABOUT_STYLE_BULLET_ITEM_TW}>
              <span
                className="absolute left-0 top-[0.62em] h-[6px] w-[6px] rounded-full bg-[#E8C08E]"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
