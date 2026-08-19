"use client";

import { DoeHomeShaderImage } from "@/components/doehome/DoeHomeShaderImage";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import styles from "./ClinicSpecialtyWorkflowsArticle.module.css";

type Workflow = {
  specialty: string;
  function: string;
  caption: string;
  details: readonly string[];
  shader: keyof typeof DOEHOME_SHADERS;
};

const WORKFLOWS: readonly Workflow[] = [
  {
    specialty: "Diagnostic imaging",
    function: "Order-to-result coordination",
    caption: "UI for imaging order intake, authorization status, and result follow-up.",
    details: ["MRI knee · authorization due", "Prior study found", "Result review queued"],
    shader: "chart",
  },
  {
    specialty: "Endocrine & weight management",
    function: "Longitudinal care plans",
    caption: "UI for medication follow-up, lab reminders, and care-plan check-ins.",
    details: ["A1c due in 14 days", "GLP-1 refill review", "Nutrition check-in sent"],
    shader: "genome",
  },
  {
    specialty: "Plastic surgery & aesthetics",
    function: "Consult-to-procedure flow",
    caption: "UI for consultation intake, photo consent, and post-procedure messaging.",
    details: ["Consultation packet complete", "Photo consent received", "Day-3 recovery check"],
    shader: "pulse",
  },
  {
    specialty: "Home care & concierge medicine",
    function: "Field care coordination",
    caption: "UI for visit routing, clinician handoffs, and patient follow-up.",
    details: ["Home visit routed", "NP handoff prepared", "Follow-up call scheduled"],
    shader: "handoff",
  },
];

function WorkflowFigure({ workflow, index }: { workflow: Workflow; index: number }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.shader}>
        <DoeHomeShaderImage src={DOEHOME_SHADERS[workflow.shader]} priority={index < 2} />
        <div className={styles.glass} aria-hidden="true">
          <div className={styles.ui}>
            <div className={styles.uiHeader}>
              <span>{workflow.specialty}</span>
              <b>Doe</b>
            </div>
            <strong>{workflow.function}</strong>
            <ul>
              {workflow.details.map((detail, detailIndex) => (
                <li key={detail}>
                  <i className={detailIndex === 0 ? styles.active : undefined} />
                  {detail}
                </li>
              ))}
            </ul>
            <div className={styles.uiFooter}>
              <span>Ready for review</span>
              <em>Open</em>
            </div>
          </div>
        </div>
      </div>
      <figcaption>{workflow.caption}</figcaption>
    </figure>
  );
}

export function ClinicSpecialtyWorkflowsArticle() {
  return (
    <main className={styles.article}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Doe / Clinical operations</p>
        <h1>Built for the way each clinic practices.</h1>
        <p className={styles.dek}>
          Doe is a clinical operations system that adapts to specialty workflow—not a generic assistant
          placed on top of the same old queue.
        </p>
        <p className={styles.byline}>By Doe · August 19, 2026</p>
      </header>

      <section className={styles.intro}>
        <p>
          A diagnostic imaging center, an endocrine practice, and a concierge clinician all need the
          same fundamental things: reliable patient context, clear ownership, and a record of what
          happened next. But their work does not look the same. Doe is being built so that every
          specialty can run its own operating model on a shared, accountable foundation.
        </p>
        <p>
          The core stays consistent: a unified patient thread, workflow-aware agents, role-based
          routing, and reviewable actions. The surface changes to match the clinic—its care journey,
          terminology, staff roles, follow-up cadence, and the systems it already uses.
        </p>
      </section>

      <section className={styles.grid} aria-label="Specialty workflow examples">
        {WORKFLOWS.map((workflow, index) => (
          <WorkflowFigure key={workflow.specialty} workflow={workflow} index={index} />
        ))}
      </section>

      <section className={styles.copy}>
        <h2>One foundation. Configured for the specialty.</h2>
        <p>
          For diagnostic imaging, Doe can coordinate intake, prior authorization, preparation
          instructions, result routing, and the next recommended action. For endocrine and weight
          management practices, it can keep medication, labs, coaching, and recurring clinical
          review connected across months of care.
        </p>
        <p>
          Plastic surgery, dermatology, and aesthetic clinics need a different rhythm: consultation
          preparation, informed consent, photography workflows, procedure readiness, and highly
          responsive post-procedure communication. Home-care teams, nurse practitioners, physician
          assistants, and concierge clinicians need a mobile-first operating layer that follows care
          across homes, hospitals, and the clinic—not one that assumes every decision happens at a
          front desk.
        </p>
      </section>

      <aside className={styles.callout}>
        <span>Designed for more than one clinic model</span>
        <p>
          Doe is being shaped for specialty practices, independent clinicians, multi-site groups,
          and teams building new care models. The point is not to force them into a generic workflow.
          It is to make their existing expertise easier to operate, inspect, and improve.
        </p>
      </aside>

      <section className={styles.copy}>
        <h2>Purpose-built, without a separate system for every team.</h2>
        <p>
          Specialty configuration should not create a new silo. A referral, a result, a clinician
          decision, and a patient message all remain part of the same thread. Doe can route work by
          license and responsibility, preserve the evidence behind a recommendation, and keep teams
          in control of the actions that affect care.
        </p>
        <p>
          We are starting with the operational moments that create the most friction: intake,
          scheduling, authorizations, documentation, results, follow-up, and handoffs. Then we adapt
          the UI and automation around the real work of the clinic.
        </p>
      </section>
    </main>
  );
}
