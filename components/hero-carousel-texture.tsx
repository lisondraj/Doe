/**
 * Grain + fine crosshatch grid from workflow carousel “Referral Intake” slide (box 5).
 * Used on the home hero (gradient unchanged) and /design.
 */
export const HERO_CAROUSEL_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

export function HeroCarouselTextureOverlay({
  patternId = "heroCrosshatchGrid",
}: {
  patternId?: string;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: HERO_CAROUSEL_GRAIN_BG,
          backgroundSize: "200px 200px",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
        >
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 56 0 M 0 0 L 0 56"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="0.8"
              />
              <circle cx="28" cy="28" r="1" fill="rgba(255, 255, 255, 0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    </>
  );
}
