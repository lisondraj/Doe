import {
  ABOUT_STYLE_BULLET_ITEM_TW,
  ABOUT_STYLE_BULLET_LIST_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans, inter, lora } from "@/lib/home/fonts";
import {
  CAMPUS_AMBASSADOR_BENEFITS_HEADING,
  CAMPUS_AMBASSADOR_BENEFITS_ITEMS,
  CAMPUS_AMBASSADOR_EDUCATION_DESCRIPTION,
  CAMPUS_AMBASSADOR_EDUCATION_HEADING,
} from "@/lib/join/campus-ambassador-copy";

/** /join — benefits + Doe Education panel above the application survey. */
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
            <li key={item} className={`campus-ambassador-benefits-panel__list-item ${ABOUT_STYLE_BULLET_ITEM_TW}`}>
              <span
                className="absolute left-0 top-[0.62em] h-[6px] w-[6px] rounded-full bg-[#E8C08E]"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="campus-ambassador-benefits-panel__education">
          <h3
            className={`campus-ambassador-benefits-panel__education-heading broader-doe-thesis-headline broader-doe-thesis-headline-gold m-0 font-normal leading-[1.14] tracking-[-0.035em] ${lora.className}`}
          >
            {CAMPUS_AMBASSADOR_EDUCATION_HEADING}
          </h3>
          <p
            className={`campus-ambassador-benefits-panel__education-description m-0 font-normal leading-[1.42] tracking-[-0.01em] text-[clamp(0.98rem,0.88rem+0.42vmin,1.1rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.48vmin,1.14rem)] ${inter.className}`}
          >
            {CAMPUS_AMBASSADOR_EDUCATION_DESCRIPTION}
          </p>
        </div>
      </div>
    </aside>
  );
}
