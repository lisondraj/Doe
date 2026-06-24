import { ArticleGraphicDesign } from "@/components/blog/ArticleInlineVisual";
import { BLOG_FEATURE_BOX_TW } from "@/lib/blog/blog-layout-styles";
import { lora } from "@/lib/home/fonts";

/** Join mobile hero — closing-section box height, orbit arcs, centered title. */
export function JoinMobileHero() {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_FEATURE_BOX_TW} border border-[#D9D4CC] bg-[#EBE7E0]`}
    >
      <ArticleGraphicDesign design={1} />

      <p
        className={`absolute inset-0 z-[2] flex items-center justify-center px-6 text-center font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[clamp(1.75rem,1.35rem+1.8vmin,2.35rem)] iphone-page:text-[clamp(1.9rem,1.45rem+2vmin,2.55rem)] ${lora.className}`}
      >
        Doe Internship
      </p>
    </div>
  );
}
