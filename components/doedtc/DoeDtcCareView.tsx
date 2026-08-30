import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult, DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcCareViewProps = {
  assessment: DoeDtcAssessmentResult | null;
  symptoms: DoeDtcSymptomRow[];
  valid: boolean;
};

function formatSymptomDate(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function DoeDtcCareView({ assessment, symptoms, valid }: DoeDtcCareViewProps) {
  if (!valid) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_CARE.invalidTokenTitle}</strong>
        <p>{DOEDTC_CARE.invalidTokenBody}</p>
      </div>
    );
  }

  return (
    <div className="doedtc-care-grid">
      {assessment ? (
        <section className="doedtc-care-main">
          <div className="doedtc-card">
            <p className="doedtc-eyebrow">{DOEDTC_CARE.presentingLabel}</p>
            <p className="doedtc-body">{assessment.presentingSymptoms}</p>
            <p className="doedtc-body doedtc-body--spaced">{assessment.summary}</p>
          </div>

          <div className="doedtc-section">
            <h2 className="doedtc-section-title">{DOEDTC_CARE.findingsLabel}</h2>
            {assessment.findings.map((finding) => (
              <article className="doedtc-finding" key={`${finding.name}-${finding.why}`}>
                <h3>
                  {finding.name}
                  <span className="doedtc-finding-likelihood">({finding.likelihood})</span>
                </h3>
                <p className="doedtc-muted">{finding.why}</p>
                {finding.evidence.length > 0 ? (
                  <ul>
                    {finding.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          {assessment.cantMiss.length > 0 ? (
            <div className="doedtc-card doedtc-card--spaced">
              <p className="doedtc-eyebrow">{DOEDTC_CARE.cantMissLabel}</p>
              <ul className="doedtc-list">
                {assessment.cantMiss.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="doedtc-card doedtc-card--spaced">
            <p className="doedtc-eyebrow">{DOEDTC_CARE.urgencyLabel}</p>
            <p className="doedtc-body">{assessment.urgency}</p>
          </div>

          <p className="doedtc-disclaimer">{assessment.disclaimer || DOEDTC_CARE.disclaimer}</p>
        </section>
      ) : (
        <div className="doedtc-card">
          <strong>{DOEDTC_CARE.noAssessmentTitle}</strong>
          <p>{DOEDTC_CARE.noAssessmentBody}</p>
        </div>
      )}

    </div>
  );
}
