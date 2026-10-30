/** A line of copy with its figures set apart. */
function FigureLine({ line }: { line: EarlyPreviewMarketLine }) {
  return (
    <>
      {line.map((part) => ("figure" in part ? <strong key={part.text}>{part.text}</strong> : <span key={part.text}>{part.text}</span>))}
    </>
  );
}

/** The target at Seed: the metrics one a line in the top right, the title building in the bottom left. */
function SeedScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "seed");
  return (
    <Scene o={o} label="Target at Seed" className="earlypreview-market__scene--corners">
      <ol className="earlypreview-market__seed-lines">
        {SEED.lines.map((line, index) => (
          <li key={line[0].text} style={vars({ "--e": en(t, 0.55 + index * 0.1, 0.85 + index * 0.1) })}>
            <FigureLine line={line} />
          </li>
        ))}
      </ol>
      <SceneTitle title={SEED.title} t={t} />
    </Scene>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 7.4 5.8 10 11 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The three plans in open columns, free to paid. A paid plan shows its founding price beside the price it becomes
 * after the first year; the founding offer is spelled out once under them.
 */
function PlansScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "plans");
  const hover = useHover<string>();
  return (
    <Scene o={o} label="Plans">
      <SceneTitle title={PLANS.title} t={t} />
      <div className="earlypreview-market__body">
        <ol className="earlypreview-market__plans">
          {PLANS.plans.map((plan, index) => (
            <li
              key={plan.id}
              className={`earlypreview-market__plan is-${plan.id}${hover.state(plan.id)}`}
              style={vars({ "--e": en(t, 0.3 + index * 0.14, 0.62 + index * 0.14) })}
              {...hover.bind(plan.id)}
            >
              <span className="earlypreview-market__plan-name">{plan.name}</span>
              <span className="earlypreview-market__plan-tagline">{plan.tagline}</span>
              {"foundingMo" in plan ? (
                <span className="earlypreview-market__plan-prices">
                  <span className="earlypreview-market__plan-price is-founding">
                    <span className="earlypreview-market__plan-value">${plan.foundingMo}</span>
                    <span className="earlypreview-market__plan-when">Founding</span>
                  </span>
                  <span className="earlypreview-market__plan-arrow" aria-hidden>
                    →
                  </span>
                  <span className="earlypreview-market__plan-price">
                    <span className="earlypreview-market__plan-value">${plan.priceMo}</span>
                    <span className="earlypreview-market__plan-when">After year one</span>
                  </span>
                </span>
              ) : (
                <span className="earlypreview-market__plan-prices">
                  <span className="earlypreview-market__plan-price">
                    <span className="earlypreview-market__plan-value">${plan.priceMo}</span>
                    <span className="earlypreview-market__plan-when">Always</span>
                  </span>
                </span>
              )}
              <ul className="earlypreview-market__plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="earlypreview-market__plan-founding" style={vars({ "--e": en(t, 0.85, 1.15) })}>
          <strong>{PLANS.founding.label}</strong>
          <span>{PLANS.founding.detail}</span>
        </p>
      </div>
    </Scene>
  );
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** The dot grid: claimed clinics fill it a row at a time from the bottom left, the paying ones first, in salmon. */
const GRID = { cols: 25, pitch: 10 } as const;
const dots = (clinics: number) => Math.round(clinics / CITIES.dotClinics);
const GRID_ROWS = Math.ceil(dots(Math.max(CITIES.canada.claimed, CITIES.us.claimed)) / GRID.cols);

/** One country's claimed clinics as dots. `k` brings the dots in, `pk` turns the paying ones salmon; both 0 → 1. */
function ClinicDots({ claimed, paying, k, pk }: { claimed: number; paying: number; k: number; pk: number }) {
  return (
    <>
      {Array.from({ length: claimed }, (_, i) => {
        const x = (i % GRID.cols) * GRID.pitch + GRID.pitch / 2;
        const y = (GRID_ROWS - 1 - Math.floor(i / GRID.cols)) * GRID.pitch + GRID.pitch / 2;
        const lit = clamp01((k - (i / claimed) * 0.75) / 0.25);
        const pay = i < paying ? clamp01((pk - (i / paying) * 0.7) / 0.3) : 0;
        return (
          <g key={i} style={{ opacity: lit }}>
            <circle cx={x} cy={y} r={3} className="is-claimed" style={{ opacity: 1 - pay }} />
            {pay > 0 ? <circle cx={x} cy={y} r={3} className="is-paying" style={{ opacity: pay }} /> : null}
          </g>
        );
      })}
    </>
  );
}

/** A layer stacked with others in one grid cell; only the visible one takes the pointer. */
function Layer({ o, className, children }: { o: number; className: string; children: ReactNode }) {
  return (
    <div className={`${className}${o < 0.5 ? " is-off" : ""}${o <= 0.001 ? " is-gone" : ""}`} style={vars({ "--o": o })} aria-hidden={o < 0.5}>
      {children}
    </div>
  );
}

/** A country's ARR target over its paying, claimed and indexed clinics, all in large type. */
function CountryPanel({ o, t, market }: { o: number; t: number; market: typeof CITIES.canada | typeof CITIES.us }) {
  const lines = [
    { id: "paying", value: market.paying, label: "paying" },
    { id: "claimed", value: market.claimed, label: "claimed" },
    { id: "indexed", value: market.indexed, label: "indexed" },
  ];
  return (
    <Layer o={o} className="earlypreview-market__country-panel">
      <span className="earlypreview-market__country-arr" style={vars({ "--e": en(t, 0.35, 0.7) })}>
        {market.arr}
      </span>
      <span className="earlypreview-market__country-arr-label" style={vars({ "--e": en(t, 0.4, 0.75) })}>
        {market.arrLabel}
      </span>
      <ul className="earlypreview-market__country-lines">
        {lines.map((line, index) => (
          <li key={line.id} className={`is-${line.id}`} style={vars({ "--e": en(t, 0.55 + index * 0.1, 0.85 + index * 0.1) })}>
            <strong>{count(line.value)}</strong> {line.label}
          </li>
        ))}
      </ul>
    </Layer>
  );
}

/** Where each stage of the cities screen starts on its clock. */
const CITY_STEP = { us: 1.6, breakdown: 3.0 } as const;

/**
 * Toronto, then the U.S., then the clinics that add up to ARR at Seed: one screen that changes on scroll. The dot
 * grid holds the middle; Canada's dots give way to the U.S.'s larger grid, and then to the breakdown.
 */
function CitiesScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "cities");
  const { canada, us, breakdown } = CITIES;
  const toUs = ramp(t, [CITY_STEP.us - 0.05, CITY_STEP.us + 0.2]);
  const toTable = ramp(t, [CITY_STEP.breakdown - 0.05, CITY_STEP.breakdown + 0.2]);
  const usT = t - CITY_STEP.us + 0.1;
  const tableT = t - CITY_STEP.breakdown + 0.1;

  return (
    <Scene o={o} label="Toronto, then the U.S.">
      <div className="earlypreview-market__title-stack">
        <Layer o={1 - toUs} className="earlypreview-market__title-layer">
          <SceneTitle title={canada.title} t={t} />
        </Layer>
        <Layer o={toUs * (1 - toTable)} className="earlypreview-market__title-layer">
          <SceneTitle title={us.title} t={usT} />
        </Layer>
        <Layer o={toTable} className="earlypreview-market__title-layer">
          <SceneTitle title={breakdown.title} t={tableT} />
        </Layer>
      </div>
      <div className="earlypreview-market__body">
        <div className="earlypreview-market__stack">
          <Layer o={1 - toTable} className="earlypreview-market__country-view">
            <svg className="earlypreview-market__country-dots" viewBox={`0 0 ${GRID.cols * GRID.pitch} ${GRID_ROWS * GRID.pitch}`} aria-hidden>
              <g style={{ opacity: 1 - toUs }}>
                <ClinicDots claimed={dots(canada.claimed)} paying={dots(canada.paying)} k={en(t, 0.25, 1.0)} pk={en(t, 0.8, 1.3)} />
              </g>
              <g style={{ opacity: toUs }}>
                <ClinicDots claimed={dots(us.claimed)} paying={dots(us.paying)} k={en(usT, 0.1, 0.85)} pk={en(usT, 0.65, 1.15)} />
              </g>
            </svg>
            <div className="earlypreview-market__country-panels">
              <CountryPanel o={1 - toUs} t={t} market={canada} />
              <CountryPanel o={toUs} t={usT} market={us} />
            </div>
          </Layer>
          <Layer o={toTable} className="earlypreview-market__mix-view">
            <div className="earlypreview-market__mix" role="table" aria-label="Clinics at Seed by plan and country, and the ARR each plan adds">
              <div className="earlypreview-market__mix-row is-head" role="row" style={vars({ "--e": en(tableT, 0.3, 0.55) })}>
                <span role="columnheader" />
                <span role="columnheader">Canada</span>
                <span role="columnheader">U.S.</span>
                <span role="columnheader">ARR</span>
              </div>
              {breakdown.rows.map((row, index) => (
                <div
                  key={row.id}
                  className={`earlypreview-market__mix-row is-${row.id}`}
                  role="row"
                  style={vars({ "--e": en(tableT, 0.35 + index * 0.1, 0.65 + index * 0.1) })}
                >
                  <span role="rowheader">
                    {row.name} <em>{row.price}</em>
                  </span>
                  <span role="cell">{count(row.canada)}</span>
                  <span role="cell">{count(row.us)}</span>
                  <span role="cell">{row.arr}</span>
                </div>
              ))}
              <div className="earlypreview-market__mix-row is-total" role="row" style={vars({ "--e": en(tableT, 0.75, 1.05) })}>
                <span role="rowheader">Paying</span>
                <span role="cell">{breakdown.total.canada}</span>
                <span role="cell">{breakdown.total.us}</span>
                <span role="cell">{breakdown.total.arr}</span>
              </div>
            </div>
            <ul className="earlypreview-market__mix-facts">
              {breakdown.facts.map((line, index) => (
                <li key={line[0].text} style={vars({ "--e": en(tableT, 1.0 + index * 0.1, 1.3 + index * 0.1) })}>
                  <FigureLine line={line} />
                </li>
              ))}
            </ul>
          </Layer>
        </div>
      </div>
    </Scene>
  );
}

