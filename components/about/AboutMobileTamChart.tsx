import {
  ABOUT_MOBILE_CHART_CITATION_TW,
  ABOUT_MOBILE_CHART_JOINT_CAPTION_TW,
  ABOUT_MOBILE_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_MOBILE_TAM_CHART } from "@/lib/about/about-page-article";
import { dmSans, inter } from "@/lib/home/fonts";

const TRACK = "rgba(30, 52, 58, 0.08)";
const BAR = "#D2774C";

function formatTamValue(value: number) {
  return value >= 10 ? `$${value}B` : `$${value.toFixed(1)}B`;
}

/** iPhone /about — vertical TAM columns below the FAQ accordion. */
export function AboutMobileTamChart() {
  const maxValue = Math.max(...ABOUT_MOBILE_TAM_CHART.bars.map((bar) => bar.value), 1);

  return (
    <figure>
      <figcaption
        className={`mb-5 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] ${dmSans.className} ${ABOUT_MOBILE_PIE_CHART_TITLE_TW} iphone-page:mb-6`}
      >
        {ABOUT_MOBILE_TAM_CHART.title}
      </figcaption>

      <div className="flex h-[clamp(11rem,34vmin,15.5rem)] items-end justify-between gap-1 iphone-page:gap-1.5">
        {ABOUT_MOBILE_TAM_CHART.bars.map((bar) => {
          const heightPct = `${Math.round((bar.value / maxValue) * 100)}%`;

          return (
            <div key={bar.label} className="flex h-full min-w-0 flex-1 flex-col items-center">
              <span
                className={`mb-2 shrink-0 text-center tabular-nums font-medium leading-none text-[#1E343A] ${dmSans.className} text-[clamp(0.72rem,0.62rem+0.45vmin,0.88rem)] iphone-page:text-[clamp(0.78rem,0.66rem+0.52vmin,0.95rem)]`}
              >
                {formatTamValue(bar.value)}
              </span>

              <div
                className="flex w-full max-w-[2.75rem] flex-1 flex-col justify-end overflow-hidden rounded-full iphone-page:max-w-[3rem]"
                style={{ background: TRACK }}
                aria-hidden
              >
                <div
                  className="w-full rounded-full transition-[height] duration-500 ease-out"
                  style={{ height: heightPct, background: BAR }}
                />
              </div>

              <span
                className={`mt-2.5 text-center font-normal leading-[1.2] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className} text-[clamp(0.68rem,0.58rem+0.42vmin,0.82rem)] iphone-page:mt-3 iphone-page:text-[clamp(0.72rem,0.62rem+0.48vmin,0.88rem)]`}
              >
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className={ABOUT_MOBILE_CHART_JOINT_CAPTION_TW}>{ABOUT_MOBILE_TAM_CHART.caption}</p>
      <p className={ABOUT_MOBILE_CHART_CITATION_TW}>{ABOUT_MOBILE_TAM_CHART.citation}</p>
    </figure>
  );
}
