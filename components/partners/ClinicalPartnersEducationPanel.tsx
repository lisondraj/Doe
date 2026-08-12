import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import {
  CLINICAL_PARTNERS_EDUCATION_DESCRIPTION,
  CLINICAL_PARTNERS_EDUCATION_HEADING,
} from "@/lib/partners/clinical-partners-copy";

/** /partners — Doe Education panel below the application survey. */
export function ClinicalPartnersEducationPanel() {
  return (
    <aside
      className={`clinical-partners-education-panel relative flex w-full flex-col items-center overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[rgba(39,31,23,0.72)] text-center ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Doe Education"
    >
      <div className="relative z-10 flex w-full max-w-[34rem] flex-col items-center gap-4 px-6 py-7 iphone-page:gap-5 iphone-page:px-8 iphone-page:py-8">
        <h2
          className={`clinical-partners-education-panel__heading m-0 font-normal leading-[1.08] tracking-[-0.035em] text-[#F2E8DA] text-[clamp(1.85rem,1.45rem+1.35vmin,2.45rem)] iphone-page:text-[clamp(2rem,1.55rem+1.55vmin,2.75rem)] ${lora.className}`}
        >
          {CLINICAL_PARTNERS_EDUCATION_HEADING}
        </h2>

        <p
          className={`clinical-partners-education-panel__description m-0 max-w-[36ch] font-normal leading-[1.42] tracking-[-0.01em] text-[clamp(0.98rem,0.88rem+0.42vmin,1.1rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.48vmin,1.14rem)] ${inter.className}`}
        >
          {CLINICAL_PARTNERS_EDUCATION_DESCRIPTION}
        </p>
      </div>
    </aside>
  );
}
