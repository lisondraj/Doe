import {
  ABOUT_MOBILE_CHART_CITATION_TW,
  ABOUT_MOBILE_CHART_JOINT_CAPTION_TW,
  ABOUT_MOBILE_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_MOBILE_TAM_CHART } from "@/lib/about/about-page-article";
import { dmSans, inter } from "@/lib/home/fonts";

const BAR = "#D2774C";
const AXIS = "rgba(30, 52, 58, 0.22)";
const GRID_LINE = "rgba(30, 52, 58, 0.07)";

const TAM_Y_MAX = 24;
const TAM_Y_TICKS = [0, 6, 12, 18, 24] as const;

function formatTamAxis(value: number) {
  return value === 0 ? "0" : value >= 10 ? `$${value}B` : `$${value.toFixed(0)}B`;
}

/** iPhone /about — square vertical TAM chart with axes below the FAQ accordion. */
export function AboutMobileTamChart() {
  const bars = ABOUT_MOBILE_TAM_CHART.bars;

  return (
    <figure>
      <figcaption
        className={`mb-5 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] ${dmSans.className} ${ABOUT_MOBILE_PIE_CHART_TITLE_TW} iphone-page:mb-6`}
      >
        {ABOUT_MOBILE_TAM_CHART.title}
      </figcaption>

      <div className="aspect-square w-full">
        <div className="grid h-full grid-cols-[clamp(2.35rem,9.5vw,3rem)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-2">
          <div className="relative col-start-1 row-start-1">
            {TAM_Y_TICKS.slice()
              .reverse()
              .map((tick) => (
                <span
                  key={tick}
                  className={`absolute right-0 -translate-y-1/2 text-right tabular-nums font-normal leading-none text-[#9A8F82] ${inter.className} text-[clamp(0.62rem,0.54rem+0.38vmin,0.76rem)] iphone-page:text-[clamp(0.68rem,0.58rem+0.42vmin,0.82rem)]`}
                  style={{ bottom: `${(tick / TAM_Y_MAX) * 100}%` }}
                >
                  {formatTamAxis(tick)}
                </span>
              ))}
          </div>

          <div
            className="relative col-start-2 row-start-1 min-h-0 border-b border-l"
            style={{ borderColor: AXIS }}
          >
            {TAM_Y_TICKS.map((tick) => (
              <div
                key={`grid-${tick}`}
                className="pointer-events-none absolute left-0 right-0 border-t"
                style={{
                  bottom: `${(tick / TAM_Y_MAX) * 100}%`,
                  borderColor: tick === 0 ? AXIS : GRID_LINE,
                }}
                aria-hidden
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-around gap-1 px-1 pb-px iphone-page:gap-1.5 iphone-page:px-1.5">
              {bars.map((bar) => {
                const heightPct = `${Math.max(2, Math.round((bar.value / TAM_Y_MAX) * 100))}%`;

                return (
                  <div
                    key={bar.label}
                    className="h-full max-w-[2.85rem] flex-1 iphone-page:max-w-[3.15rem]"
                    aria-hidden
                  >
                    <div className="flex h-full flex-col justify-end">
                      <div
                        className="w-full rounded-t-[0.35rem] transition-[height] duration-500 ease-out iphone-page:rounded-t-[0.42rem]"
                        style={{ height: heightPct, background: BAR }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-start-2 row-start-2 flex justify-around gap-1 px-1 pt-2.5 iphone-page:gap-1.5 iphone-page:px-1.5 iphone-page:pt-3">
            {bars.map((bar) => (
              <span
                key={`${bar.label}-label`}
                className={`min-w-0 flex-1 text-center font-normal leading-[1.15] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className} text-[clamp(0.62rem,0.54rem+0.38vmin,0.76rem)] iphone-page:text-[clamp(0.68rem,0.58rem+0.42vmin,0.82rem)]`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className={ABOUT_MOBILE_CHART_JOINT_CAPTION_TW}>{ABOUT_MOBILE_TAM_CHART.caption}</p>
      <p className={ABOUT_MOBILE_CHART_CITATION_TW}>{ABOUT_MOBILE_TAM_CHART.citation}</p>
    </figure>
  );
}
