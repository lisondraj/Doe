import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult } from "@/lib/doedtc/doedtc-types";

type DoeDtcCareViewProps = {
  assessment: DoeDtcAssessmentResult | null;
  valid: boolean;
};

export function DoeDtcCareView({ assessment, valid }: DoeDtcCareViewProps) {
  if (!valid) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_CARE.invalidTokenTitle}</strong>
        <p>{DOEDTC_CARE.invalidTokenBody}</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_CARE.noAssessmentTitle}</strong>
        <p>{DOEDTC_CARE.noAssessmentBody}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="doedtc-card">
        <p className="doedtc-eyebrow">{DOEDTC_CARE.presentingLabel}</p>
        <p>{assessment.presentingSymptoms}</p>
        <p style={{ marginTop: "0.75rem" }}>{assessment.summary}</p>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h2 className="doedtc-label">{DOEDTC_CARE.findingsLabel}</h2>
        {assessment.findings.map((finding) => (
          <article className="doedtc-finding" key={`${finding.name}-${finding.why}`}>
            <h3>
              {finding.name}
              <span style={{ marginLeft: "0.5rem", color: "#8a7868", fontWeight: 500 }}>
                ({finding.likelihood})
              </span>
            </h3>
            <p style={{ marginTop: "0.35rem", color: "#8a7868" }}>{finding.why}</p>
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
        <div className="doedtc-card" style={{ marginTop: "1.5rem" }}>
          <p className="doedtc-eyebrow">{DOEDTC_CARE.cantMissLabel}</p>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.1rem" }}>
            {assessment.cantMiss.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="doedtc-card" style={{ marginTop: "1.5rem" }}>
        <p className="doedtc-eyebrow">{DOEDTC_CARE.urgencyLabel}</p>
        <p style={{ marginTop: "0.5rem" }}>{assessment.urgency}</p>
      </div>

      <p className="doedtc-disclaimer">{assessment.disclaimer || DOEDTC_CARE.disclaimer}</p>
    </div>
  );
}
