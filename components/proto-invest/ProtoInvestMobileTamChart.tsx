import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import {
  PROTO_INVEST_CHART_CAPTION_TW,
  PROTO_INVEST_CHART_CITATION_TW,
  PROTO_INVEST_CHART_TITLE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import { ABOUT_MOBILE_TAM_CHART } from "@/lib/about/about-page-article";
import {
  PROTO_INVEST_TAM_CAPTION,
  PROTO_INVEST_TAM_CITATION,
} from "@/lib/proto-invest/proto-invest-content";

import { PROTO_INVEST_CHART_COLORS } from "@/lib/proto-invest/proto-invest-theme";

const TAM_Y_MAX = 28;
const TAM_Y_TICKS = [0, 7, 14, 21, 28] as const;

function formatTamAxis(value: number) {
  return value === 0 ? "0" : value >= 10 ? `$${value}B` : `$${value.toFixed(0)}B`;
}

/** /proto-invest — TAM vertical bar chart with dark-theme palette. */
export function ProtoInvestMobileTamChart() {
  const bars = ABOUT_MOBILE_TAM_CHART.bars;

  return (
    <figure className="proto-invest-chart-zone">
      <figcaption
        className={`mb-5 font-medium leading-snug tracking-[-0.01em] text-white ${PROTO_INVEST_CHART_TITLE_TW} iphone-page:mb-6 ${PROTO_FONT_CLASS}`}
      >
        {ABOUT_MOBILE_TAM_CHART.title}
      </figcaption>

      <div className="aspect-[5/4] w-full">
        <div className="grid h-full grid-cols-[clamp(2.65rem,10.5vw,3.35rem)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-2.5">
          <div className="relative col-start-1 row-start-1">
            {TAM_Y_TICKS.slice()
              .reverse()
              .map((tick) => (
                <span
                  key={tick}
                  className={`absolute right-0 -translate-y-1/2 text-right tabular-nums font-normal leading-none text-[clamp(0.72rem,0.62rem+0.45vmin,0.88rem)] iphone-page:text-[clamp(0.82rem,0.7rem+0.52vmin,0.98rem)] ${PROTO_FONT_CLASS}`}
                  style={{ bottom: `${(tick / TAM_Y_MAX) * 100}%`, color: PROTO_INVEST_CHART_COLORS.labelMuted }}
                >
                  {formatTamAxis(tick)}
                </span>
              ))}
          </div>

          <div
            className="relative col-start-2 row-start-1 min-h-0 border-b border-l"
            style={{ borderColor: PROTO_INVEST_CHART_COLORS.axis }}
          >
            {TAM_Y_TICKS.map((tick) => (
              <div
                key={`grid-${tick}`}
                className="pointer-events-none absolute left-0 right-0 border-t"
                style={{
                  bottom: `${(tick / TAM_Y_MAX) * 100}%`,
                  borderColor: tick === 0 ? PROTO_INVEST_CHART_COLORS.axis : PROTO_INVEST_CHART_COLORS.gridLine,
                }}
                aria-hidden
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-around gap-0.5 px-0.5 pb-px iphone-page:gap-1 iphone-page:px-1">
              {bars.map((bar) => {
                const heightPct = `${Math.max(2, Math.round((bar.value / TAM_Y_MAX) * 100))}%`;

                return (
                  <div
                    key={bar.label}
                    className="h-full max-w-[2.35rem] flex-1 iphone-page:max-w-[2.65rem]"
                    aria-hidden
                  >
                    <div className="flex h-full flex-col justify-end">
                      <div
                        className="w-full rounded-t-[0.35rem] transition-[height] duration-500 ease-out iphone-page:rounded-t-[0.42rem]"
                        style={{ height: heightPct, background: PROTO_INVEST_CHART_COLORS.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-start-2 row-start-2 flex justify-around gap-0.5 px-0.5 pt-2.5 iphone-page:gap-1 iphone-page:px-1 iphone-page:pt-3">
            {bars.map((bar) => (
              <span
                key={`${bar.label}-label`}
                className={`min-w-0 flex-1 text-center font-normal leading-[1.15] tracking-[-0.01em] text-[clamp(0.72rem,0.62rem+0.45vmin,0.88rem)] iphone-page:text-[clamp(0.82rem,0.7rem+0.52vmin,0.98rem)] ${PROTO_FONT_CLASS}`}
                style={{ color: PROTO_INVEST_CHART_COLORS.label }}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="proto-invest-tam-highlight mt-6 border border-[#2A3538] px-4 py-4 iphone-page:mt-7 iphone-page:px-5 iphone-page:py-5">
        <p
          className={`font-medium leading-none tracking-[-0.03em] text-white ${PROTO_FONT_CLASS} text-[clamp(2.55rem,2rem+2.35vmin,3.35rem)] iphone-page:text-[clamp(2.85rem,2.2rem+2.75vmin,3.75rem)]`}
        >
          ${ABOUT_MOBILE_TAM_CHART.highlight.valueB}B
        </p>
        <p
          className={`mt-2 font-medium leading-snug tracking-[-0.02em] text-white ${PROTO_FONT_CLASS} text-[clamp(1.08rem,0.92rem+0.75vmin,1.32rem)] iphone-page:mt-2.5 iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.48rem)]`}
        >
          {ABOUT_MOBILE_TAM_CHART.highlight.tamLabel}
        </p>
        <p
          className={`mt-1.5 font-normal leading-snug text-[clamp(1rem,0.88rem+0.58vmin,1.18rem)] iphone-page:mt-2 iphone-page:text-[clamp(1.12rem,0.96rem+0.72vmin,1.32rem)] ${PROTO_FONT_CLASS}`}
          style={{ color: PROTO_INVEST_CHART_COLORS.labelMuted }}
        >
          {ABOUT_MOBILE_TAM_CHART.highlight.headline}
        </p>
      </div>

      <p className={PROTO_INVEST_CHART_CAPTION_TW}>{PROTO_INVEST_TAM_CAPTION}</p>
      <p className={PROTO_INVEST_CHART_CITATION_TW}>{PROTO_INVEST_TAM_CITATION}</p>
    </figure>
  );
}
