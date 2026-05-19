import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HERO_BACKDROP_GRADIENT } from "@/lib/hero-backdrop";

export default function DesignPage() {
  return (
    <main className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: HERO_BACKDROP_GRADIENT }}
        aria-hidden
      />
      <HeroCarouselTextureOverlay patternId="designCrosshatchGrid" />
    </main>
  );
}
