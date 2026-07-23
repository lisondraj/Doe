import { dmSans } from "@/lib/home/fonts";

const BP_SCALE_MIN = 75;
const BP_SCALE_MAX = 150;

function bpHeightPercent(value: number) {
  return ((value - BP_SCALE_MIN) / (BP_SCALE_MAX - BP_SCALE_MIN)) * 100;
}

/** BP history — vertical pressure columns per visit (no line graph). */
export function Product2ChartProfileBpTrend({
  readings,
}: {
  readings: readonly { date: string; systolic: number; diastolic: number }[];
}) {
  const latestIndex = readings.length - 1;
  const yTicks = [BP_SCALE_MAX, Math.round((BP_SCALE_MAX + BP_SCALE_MIN) / 2), BP_SCALE_MIN];

  return (
    <div className="product-landing-live-quote__chart-profile-bp">
      <div className="product-landing-live-quote__chart-profile-a1c-plot">
        <div className={`product-landing-live-quote__chart-profile-a1c-y-axis ${dmSans.className}`} aria-hidden>
          {yTicks.map((tick) => (
            <span key={tick} className="product-landing-live-quote__chart-profile-a1c-axis-label">
              {tick}
            </span>
          ))}
        </div>
        <div className="product-landing-live-quote__chart-profile-bp-columns">
          {readings.map((reading, index) => {
            const isLatest = index === latestIndex;
            const sysHeight = bpHeightPercent(reading.systolic);
            const diaHeight = bpHeightPercent(reading.diastolic);
            const coreHeight = sysHeight > 0 ? (diaHeight / sysHeight) * 100 : 0;

            return (
              <div
                key={reading.date}
                className={`product-landing-live-quote__chart-profile-bp-column${
                  isLatest ? " product-landing-live-quote__chart-profile-bp-column--latest" : ""
                }`}
              >
                <div className="product-landing-live-quote__chart-profile-bp-column-body">
                  <div
                    className="product-landing-live-quote__chart-profile-bp-column-shell"
                    style={{ height: `${sysHeight}%` }}
                  >
                    <div
                      className="product-landing-live-quote__chart-profile-bp-column-core"
                      style={{ height: `${coreHeight}%` }}
                    />
                  </div>
                  {isLatest ? (
                    <span className={`product-landing-live-quote__chart-profile-bp-column-reading ${dmSans.className}`}>
                      {reading.systolic}/{reading.diastolic}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`product-landing-live-quote__chart-profile-a1c-x-axis ${dmSans.className}`} aria-hidden>
        <span className="product-landing-live-quote__chart-profile-a1c-x-axis-spacer" />
        <div className="product-landing-live-quote__chart-profile-a1c-x-axis-labels">
          {readings.map((reading) => (
            <span key={reading.date} className="product-landing-live-quote__chart-profile-a1c-axis-label">
              {reading.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
