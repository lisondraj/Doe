"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const CALL = {
  patient: "Brooks, J.",
  order: "MRI lumbar spine",
  duration: "On call 3:12",
  quote: "Can you help get my MRI approved? My doctor wants it next Thursday.",
} as const;

const CHART_ROWS = [
  { id: "cpt", code: "72148", detail: "MRI lumbar spine", state: "done" as const },
  { id: "dx", code: "M54.5", detail: "Low back pain", state: "done" as const },
  { id: "payer", code: "UHC PPO", detail: "UnitedHealthcare", state: "active" as const },
] as const;

const FOOTER = {
  payer: "UnitedHealthcare",
  status: "Submitted · Ref PA-48219",
} as const;

function RowMark({ state }: { state: (typeof CHART_ROWS)[number]["state"] }) {
  if (state === "done") {
    return (
      <span className="home-prior-auth-visual__row-mark home-prior-auth-visual__row-mark--done" aria-hidden>
        ✓
      </span>
    );
  }

  return <span className="home-prior-auth-visual__row-mark home-prior-auth-visual__row-mark--active" aria-hidden />;
}

/** Prior auth — phone agent pulls chart facts and files while the patient is on the line. */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div
      className={`home-prior-auth-visual mx-auto w-full ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="home-prior-auth-visual__card">
        <header className="home-prior-auth-visual__header">
          <div className="home-prior-auth-visual__header-copy">
            <p className="home-prior-auth-visual__patient">{CALL.patient}</p>
            <p className={`home-prior-auth-visual__order ${inter.className}`}>{CALL.order}</p>
          </div>
          <span className={`home-prior-auth-visual__duration ${inter.className}`}>{CALL.duration}</span>
        </header>

        <div className="home-prior-auth-visual__body">
          <div className={`home-prior-auth-visual__quote-panel ${inter.className}`}>
            <p className="home-prior-auth-visual__section-label">On the line</p>
            <p className="home-prior-auth-visual__quote">&ldquo;{CALL.quote}&rdquo;</p>
          </div>

          <div className="home-prior-auth-visual__chart">
            <p className={`home-prior-auth-visual__section-label ${inter.className}`}>Pulled from chart</p>
            <ul className="home-prior-auth-visual__rows">
              {CHART_ROWS.map((row) => (
                <li
                  key={row.id}
                  className={`home-prior-auth-visual__row home-prior-auth-visual__row--${row.state}`}
                >
                  <span className={`home-prior-auth-visual__row-code ${inter.className}`}>{row.code}</span>
                  <span className="home-prior-auth-visual__row-detail">{row.detail}</span>
                  <RowMark state={row.state} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className={`home-prior-auth-visual__footer ${inter.className}`}>
          <span className="home-prior-auth-visual__footer-payer">{FOOTER.payer}</span>
          <span className="home-prior-auth-visual__footer-status">{FOOTER.status}</span>
        </footer>
      </div>
    </div>
  );
}
