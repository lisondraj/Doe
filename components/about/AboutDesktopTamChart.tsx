import {
  ABOUT_DESKTOP_CHART_CITATION_TW,
  ABOUT_DESKTOP_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_MOBILE_TAM_CHART } from "@/lib/about/about-page-article";
import {
  ABOUT_IPHONE_SHADER_CHART_MUTED,
  ABOUT_IPHONE_SHADER_CHART_PRIMARY,
} from "@/lib/home/doe-page-colors";
import { dmSans, inter, suisseIntl } from "@/lib/home/fonts";

const TAM_Y_MAX = 28;
const TAM_Y_TICKS = [0, 7, 14, 21, 28] as const;
const TAM_GOLD_AXIS = "rgba(232, 192, 142, 0.28)";
const TAM_GOLD_GRID = "rgba(232, 192, 142, 0.12)";

/** Shorter axis labels so six bars fit the desktop half-column without overlap. */
const DESKTOP_TAM_AXIS_LABELS: Record<string, string> = {
  "Canadian doctors": "CA docs",
  "Canadian health providers": "CA providers",
  "U.S. doctors": "US docs",
  "U.S. health providers": "US providers",
  "Canada + U.S. doctors": "CA+US docs",
  "Canada + U.S. health providers": "CA+US providers",
};

function formatTamAxis(value: number) {
  return value === 0 ? "0" : value >= 10 ? `$${value}B` : `$${value.toFixed(0)}B`;
}

/** Desktop /about — vertical TAM chart beside beige panel. */
export function AboutDesktopTamChart() {
  const bars = ABOUT_MOBILE_TAM_CHART.bars;

  return (
    <figure className="about-stat-charts about-desktop-tam shrink-0">
      <figcaption
        className={`mb-4 font-medium leading-snug tracking-[-0.01em] text-[#F2E8DA] md:mb-5 ${dmSans.className} ${ABOUT_DESKTOP_PIE_CHART_TITLE_TW}`}
      >
        {ABOUT_MOBILE_TAM_CHART.title}
      </figcaption>

      <div className="aspect-[5/4] w-full max-h-[min(100%,20rem)]">
        <div className="grid h-full grid-cols-[clamp(2.75rem,2.2vw,3.35rem)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-3">
          <div className="relative col-start-1 row-start-1">
            {TAM_Y_TICKS.slice()
              .reverse()
              .map((tick) => (
                <span
                  key={tick}
                  className={`absolute right-0 -translate-y-1/2 text-right tabular-nums font-normal leading-none ${inter.className} text-[clamp(0.78rem,0.72vw,0.92rem)] md:text-[clamp(0.84rem,0.76vw,0.98rem)]`}
                  style={{ bottom: `${(tick / TAM_Y_MAX) * 100}%`, color: ABOUT_IPHONE_SHADER_CHART_MUTED }}
                >
                  {formatTamAxis(tick)}
                </span>
              ))}
          </div>

          <div
            className="relative col-start-2 row-start-1 min-h-0 border-b border-l"
            style={{ borderColor: TAM_GOLD_AXIS }}
          >
            {TAM_Y_TICKS.map((tick) => (
              <div
                key={`grid-${tick}`}
                className="pointer-events-none absolute left-0 right-0 border-t"
                style={{
                  bottom: `${(tick / TAM_Y_MAX) * 100}%`,
                  borderColor: tick === 0 ? TAM_GOLD_AXIS : TAM_GOLD_GRID,
                }}
                aria-hidden
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-around gap-1 px-1 pb-px">
              {bars.map((bar) => {
                const heightPct = `${Math.max(2, Math.round((bar.value / TAM_Y_MAX) * 100))}%`;

                return (
                  <div key={bar.label} className="h-full max-w-[2.5rem] flex-1 md:max-w-[2.85rem]" aria-hidden>
                    <div className="flex h-full flex-col justify-end">
                      <div
                        className="about-chart-tam-bar about-chart-bar-fill--gold w-full rounded-t-[0.35rem] transition-[height] duration-500 ease-out md:rounded-t-[0.42rem]"
                        style={{ height: heightPct }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-start-2 row-start-2 flex justify-around gap-1 px-1 pt-2.5 md:pt-3">
            {bars.map((bar) => (
              <span
                key={`${bar.label}-label`}
                className={`about-desktop-tam__axis-label min-w-0 flex-1 text-center font-normal leading-[1.15] tracking-[-0.01em] text-[#F2E8DA]/72 ${inter.className} text-[clamp(0.72rem,0.66vw,0.86rem)] md:text-[clamp(0.78rem,0.7vw,0.92rem)]`}
                title={bar.label}
              >
                {DESKTOP_TAM_AXIS_LABELS[bar.label] ?? bar.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-4 border px-4 py-3.5 md:mt-5 md:px-5 md:py-4"
        style={{ borderColor: TAM_GOLD_AXIS }}
      >
        <p
          className={`font-medium leading-none tracking-[-0.03em] ${suisseIntl.className} text-[clamp(2.15rem,1.95vw,2.75rem)] md:text-[clamp(2.35rem,2.1vw,2.95rem)]`}
          style={{
            background: "linear-gradient(180deg, #e8c08e 0%, #d4a574 52%, rgba(212, 165, 116, 0.82) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          ${ABOUT_MOBILE_TAM_CHART.highlight.valueB}B
        </p>
        <p
          className={`mt-1.5 font-medium leading-snug tracking-[-0.02em] text-[#F2E8DA] md:mt-2 ${dmSans.className} text-[clamp(1.02rem,0.95vw,1.18rem)] md:text-[clamp(1.08rem,0.98vw,1.28rem)]`}
        >
          {ABOUT_MOBILE_TAM_CHART.highlight.tamLabel}
        </p>
        <p
          className={`mt-1 font-normal leading-snug md:mt-1.5 ${inter.className} text-[clamp(0.92rem,0.85vw,1.05rem)] md:text-[clamp(0.98rem,0.9vw,1.12rem)]`}
          style={{ color: ABOUT_IPHONE_SHADER_CHART_PRIMARY }}
        >
          {ABOUT_MOBILE_TAM_CHART.highlight.headline}
        </p>
      </div>

      <p className={ABOUT_DESKTOP_CHART_CITATION_TW}>{ABOUT_MOBILE_TAM_CHART.citation}</p>
    </figure>
  );
}
