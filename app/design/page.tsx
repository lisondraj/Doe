import { DesignHeroBackdropSection } from "@/components/design-hero-backdrop-section";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Hero gradient + Referral Intake crosshatch (original /design). */
export default function DesignPage() {
  return (
    <main className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden">
      {/* Desktop: match the main page hero shader only. */}
      <div className="hidden lg:block h-full w-full">
        <BlogHeroVisual
          backdrop={CARE_COORDINATION_BACKDROP}
          useHomeHeroDuskShader
          boxClassName="min-h-[100dvh] w-full"
          gapClassName=""
        />
      </div>

      {/* Smaller screens: keep the original /design crosshatch backdrop. */}
      <div className="lg:hidden h-full w-full">
        <DesignHeroBackdropSection className="min-h-[100dvh]" />
      </div>
    </main>
  );
}
