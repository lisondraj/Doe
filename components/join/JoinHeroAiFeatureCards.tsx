import { inter } from "@/lib/home/fonts";
import {
  JOIN_HERO_AI_FEATURE_CARDS,
  type JoinHeroAiFeatureCardConfig,
} from "@/lib/home/hero-triage-theme";

function JoinHeroAiFeatureCard({ config }: { config: JoinHeroAiFeatureCardConfig }) {
  const { label, title, rows, status, placement } = config;

  return (
    <div
      className={`pointer-events-none absolute select-none ${inter.className}`}
      style={{
        top: placement.top,
        right: placement.right,
        zIndex: placement.zIndex,
        transform: `scale(${placement.scale}) rotate(${placement.rotate}deg)`,
        transformOrigin: placement.transformOrigin ?? "bottom right",
      }}
      aria-hidden
    >
      <div
        className="w-[15.75rem] overflow-hidden rounded-xl border bg-white"
        style={{
          borderColor: "#E5E1DA",
          boxShadow: "0 16px 48px rgba(30, 52, 58, 0.16)",
        }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b px-3.5 py-2.5"
          style={{ borderColor: "#EEEAE3", background: "#FAFAF8" }}
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#1E343A]/58">
            {label}
          </span>
          {status ? (
            <span
              className="rounded-md px-2 py-0.5 text-[0.58rem] font-medium tracking-[-0.01em] text-white"
              style={{ background: "#D2774C" }}
            >
              {status}
            </span>
          ) : null}
        </div>

        <div className="px-3.5 py-3">
          <p className="text-[0.82rem] font-medium leading-snug tracking-[-0.02em] text-[#1E343A]">
            {title}
          </p>
          <ul className="mt-2.5 space-y-2 border-t pt-2.5" style={{ borderColor: "#EEEAE3" }}>
            {rows.map((row) => (
              <li key={row} className="flex gap-2 text-[0.68rem] font-normal leading-snug text-[#1E343A]/68">
                <span
                  className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-sm"
                  style={{ background: "#D2774C" }}
                  aria-hidden
                />
                <span>{row}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Desktop join hero — compact AI feature cards overlapping the inbox preview. */
export function JoinHeroAiFeatureCards({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {JOIN_HERO_AI_FEATURE_CARDS.map((config) => (
        <JoinHeroAiFeatureCard key={config.label} config={config} />
      ))}
    </div>
  );
}
