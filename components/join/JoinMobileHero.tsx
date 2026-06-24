import { ArticleGraphicDesign } from "@/components/blog/ArticleInlineVisual";
import { JOIN_MOBILE_HERO_HEIGHT } from "@/lib/join/join-mobile-layout";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { lora } from "@/lib/home/fonts";

/** Join mobile hero — orbit arcs, centered title. */
export function JoinMobileHero() {
  return (
    <div
      className={`relative w-full overflow-hidden ${JOIN_MOBILE_HERO_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} border border-[#D9D4CC] bg-[#EBE7E0]`}
    >
      <ArticleGraphicDesign design={1} />

      <p
        className={`absolute inset-0 z-[2] flex items-center justify-center px-6 text-center font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[clamp(2.35rem,1.75rem+3.2vmin,3.35rem)] iphone-page:text-[clamp(2.65rem,1.95rem+3.8vmin,3.75rem)] ${lora.className}`}
      >
        <span className="inline-flex items-center gap-[0.35em]">
          <span>Doe</span>
          <span
            className="inline-block h-[0.82em] w-px shrink-0 bg-[#1E343A]/40"
            aria-hidden
          />
          <span>Intern</span>
        </span>
      </p>
    </div>
  );
}
