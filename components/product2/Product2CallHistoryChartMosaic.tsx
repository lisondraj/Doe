import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { Product2CallHistoryOpenTaskIcon } from "@/components/product2/Product2CallHistoryOpenTaskIcon";
import { Product2CallHistoryRecentLabs } from "@/components/product2/Product2CallHistoryRecentLabs";
import { Product2CallHistoryRecentVitals } from "@/components/product2/Product2CallHistoryRecentVitals";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT2_CALL_HISTORY_A1C_TREND,
  PRODUCT2_CALL_HISTORY_ALLERGIES,
  PRODUCT2_CALL_HISTORY_CONDITIONS,
  PRODUCT2_CALL_HISTORY_MEDICATIONS,
  PRODUCT2_CALL_HISTORY_MOSAIC_IPHONE,
  PRODUCT2_CALL_HISTORY_OPEN_TASKS,
  PRODUCT2_CALL_HISTORY_RECENT_VISITS,
} from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-call-history-mosaic.css";
import "@/lib/product2/product2-landing.css";

type MosaicTask = {
  title: string;
  when: string;
  tone: "due" | "overdue";
  icon: "rx" | "eye";
};

function MosaicTasksList({ tasks, className = "" }: { tasks: readonly MosaicTask[]; className?: string }) {
  return (
    <ul className={`product-call-history-panel__tasks-list m-0 ${dmSans.className}${className ? ` ${className}` : ""}`}>
      {tasks.map((task) => (
        <li
          key={task.title}
          className={`product-call-history-panel__tasks-item product-call-history-panel__tasks-item--${task.tone}`}
        >
          <span className="product-call-history-panel__tasks-item-icon" aria-hidden>
            <Product2CallHistoryOpenTaskIcon kind={task.icon} />
          </span>
          <div className="product-call-history-panel__tasks-item-copy">
            <span className="product-call-history-panel__tasks-item-title">{task.title}</span>
            <span className="product-call-history-panel__tasks-item-badge">{task.when}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

type MosaicVisit = {
  title: string;
  when: string;
  month: string;
  day: number;
  weekday: string;
};

function MosaicVisitsList({ visits, className = "" }: { visits: readonly MosaicVisit[]; className?: string }) {
  return (
    <ul className={`product-call-history-panel__visits-list m-0 ${dmSans.className}${className ? ` ${className}` : ""}`}>
      {visits.map((visit) => (
        <li key={visit.title} className="product-call-history-panel__visits-item">
          <div className="product-call-history-panel__visits-date" aria-hidden>
            <span className="product-call-history-panel__visits-date-month">{visit.month}</span>
            <span className="product-call-history-panel__visits-date-day">{visit.day}</span>
            <span className="product-call-history-panel__visits-date-weekday">{visit.weekday}</span>
          </div>
          <div className="product-call-history-panel__visits-item-copy">
            <span className="product-call-history-panel__visits-item-title">{visit.title}</span>
            <span className="product-call-history-panel__visits-item-when">{visit.when}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MosaicProfilePanel() {
  const { medications, conditions, allergies } = PRODUCT2_CALL_HISTORY_MOSAIC_IPHONE;

  return (
    <div className="product-call-history-panel__profile-shell">
      <section className="product-call-history-panel__profile-section" aria-label={medications.label}>
        <p className={`product-call-history-panel__meds-label m-0 ${suisseIntl.className}`}>{medications.label}</p>
        <ul className={`product-call-history-panel__meds-list m-0 ${dmSans.className}`}>
          {medications.items.map((medication) => (
            <li key={medication} className="product-call-history-panel__meds-item">
              {medication}
            </li>
          ))}
        </ul>
      </section>
      <section className="product-call-history-panel__profile-section" aria-label={conditions.label}>
        <p className={`product-call-history-panel__conditions-label m-0 ${suisseIntl.className}`}>
          {conditions.label}
        </p>
        <ul className={`product-call-history-panel__conditions-list m-0 ${dmSans.className}`}>
          {conditions.items.map((condition) => (
            <li key={condition} className="product-call-history-panel__conditions-item">
              {condition}
            </li>
          ))}
        </ul>
      </section>
      <section className="product-call-history-panel__profile-section" aria-label={allergies.label}>
        <p className={`product-call-history-panel__allergies-label m-0 ${suisseIntl.className}`}>
          {allergies.label}
        </p>
        <ul className={`product-call-history-panel__allergies-list m-0 ${dmSans.className}`}>
          {allergies.items.map((allergy) => (
            <li key={allergy} className="product-call-history-panel__allergies-item">
              {allergy}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Sarah Westfield call-history chart boxes in a square interlocking grid (no hero overlay). */
export function Product2CallHistoryChartMosaic() {
  return (
    <div
      className="product-call-history-mosaic product-call-history-mosaic--doehealth product-brown-mock product-brown-call-history-mode"
      aria-label="Patient chart summary"
    >
      <div className="product-call-history-mosaic__grid">
        <div className="product-call-history-mosaic__cell product-call-history-mosaic__cell--a1c">
          <div
            className="product-call-history-panel__a1c-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
          >
            <Product2ChartProfileA1cTrend
              label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
              readings={PRODUCT2_CALL_HISTORY_A1C_TREND.readings}
              doseChanges={PRODUCT2_CALL_HISTORY_A1C_TREND.doseChanges}
            />
          </div>
        </div>

        <div className="product-call-history-mosaic__cell product-call-history-mosaic__cell--vitals">
          <div
            className="product-call-history-panel__vitals-card product-landing-live-quote__chart-profile"
            aria-label="Recent vitals"
          >
            <Product2CallHistoryRecentVitals />
          </div>
        </div>

        <div className="product-call-history-mosaic__cell product-call-history-mosaic__cell--tasks">
          <div
            className="product-call-history-panel__tasks-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
          >
            <div className="product-call-history-panel__tasks-shell">
              <p className={`product-call-history-panel__tasks-label m-0 ${suisseIntl.className}`}>
                {PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
              </p>
              <MosaicTasksList
                tasks={PRODUCT2_CALL_HISTORY_OPEN_TASKS.items}
                className="product-call-history-mosaic__copy--desktop"
              />
              <MosaicTasksList
                tasks={PRODUCT2_CALL_HISTORY_MOSAIC_IPHONE.tasks.items}
                className="product-call-history-mosaic__copy--mobile"
              />
            </div>
          </div>
        </div>

        <div
          className="product-call-history-mosaic__cell product-call-history-mosaic__cell--profile product-call-history-mosaic__cell--mobile-only"
        >
          <div
            className="product-call-history-panel__profile-card product-landing-live-quote__chart-profile"
            aria-label="Medications, conditions, and allergies"
          >
            <MosaicProfilePanel />
          </div>
        </div>

        <div
          className="product-call-history-mosaic__cell product-call-history-mosaic__cell--meds product-call-history-mosaic__cell--desktop-only"
        >
          <div
            className="product-call-history-panel__meds-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
          >
            <div className="product-call-history-panel__meds-shell">
              <p className={`product-call-history-panel__meds-label m-0 ${suisseIntl.className}`}>
                {PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
              </p>
              <ul className={`product-call-history-panel__meds-list m-0 ${dmSans.className}`}>
                {PRODUCT2_CALL_HISTORY_MEDICATIONS.items.map((medication) => (
                  <li key={medication} className="product-call-history-panel__meds-item">
                    {medication}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="product-call-history-mosaic__cell product-call-history-mosaic__cell--visits">
          <div
            className="product-call-history-panel__visits-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
          >
            <div className="product-call-history-panel__visits-shell">
              <p className={`product-call-history-panel__visits-label m-0 ${suisseIntl.className}`}>
                {PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
              </p>
              <MosaicVisitsList
                visits={PRODUCT2_CALL_HISTORY_RECENT_VISITS.items}
                className="product-call-history-mosaic__copy--desktop"
              />
              <MosaicVisitsList
                visits={PRODUCT2_CALL_HISTORY_MOSAIC_IPHONE.visits.items}
                className="product-call-history-mosaic__copy--mobile"
              />
            </div>
          </div>
        </div>

        <div className="product-call-history-mosaic__cell product-call-history-mosaic__cell--labs">
          <div
            className="product-call-history-panel__labs-card product-landing-live-quote__chart-profile"
            aria-label="Recent labs"
          >
            <Product2CallHistoryRecentLabs />
          </div>
        </div>

        <div
          className="product-call-history-mosaic__cell product-call-history-mosaic__cell--conditions product-call-history-mosaic__cell--desktop-only"
        >
          <div
            className="product-call-history-panel__conditions-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_CONDITIONS.label}
          >
            <div className="product-call-history-panel__conditions-shell">
              <p className={`product-call-history-panel__conditions-label m-0 ${suisseIntl.className}`}>
                {PRODUCT2_CALL_HISTORY_CONDITIONS.label}
              </p>
              <ul className={`product-call-history-panel__conditions-list m-0 ${dmSans.className}`}>
                {PRODUCT2_CALL_HISTORY_CONDITIONS.items.map((condition) => (
                  <li key={condition} className="product-call-history-panel__conditions-item">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="product-call-history-mosaic__cell product-call-history-mosaic__cell--allergies product-call-history-mosaic__cell--desktop-only"
        >
          <div
            className="product-call-history-panel__allergies-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT2_CALL_HISTORY_ALLERGIES.label}
          >
            <div className="product-call-history-panel__allergies-shell">
              <p className={`product-call-history-panel__allergies-label m-0 ${suisseIntl.className}`}>
                {PRODUCT2_CALL_HISTORY_ALLERGIES.label}
              </p>
              <ul className={`product-call-history-panel__allergies-list m-0 ${dmSans.className}`}>
                {PRODUCT2_CALL_HISTORY_ALLERGIES.items.map((allergy) => (
                  <li key={allergy} className="product-call-history-panel__allergies-item">
                    {allergy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
