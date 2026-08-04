import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const PULSE_AMBIENT_FEATURE_CARDS = [
  {
    id: "pulse-ambient-passive-capture",
    shaderVariant: v5,
    subheading: "Documentation starts passively during calls and visits.",
    description:
      "Doctors stay present with patients while Ambient listens in the background. No dictation buttons, no post-visit typing marathons. The conversation itself becomes the source of truth.",
  },
  {
    id: "pulse-ambient-transcription",
    shaderVariant: v6,
    subheading: "Real-time transcription tuned for clinical vocabulary.",
    description:
      "Medication names, diagnoses, and specialty terms are recognized accurately in the moment. Transcripts stay attached to the encounter so nothing gets lost between rooms.",
  },
  {
    id: "pulse-ambient-note-drafts",
    shaderVariant: v7,
    subheading: "Conversations become structured chart-ready note drafts.",
    description:
      "Ambient maps what was said into your note sections, history, assessment, and plan, using templates your practice already trusts. Drafts arrive formatted, not as a wall of raw text.",
  },
  {
    id: "pulse-ambient-clinician-review",
    shaderVariant: v8,
    subheading: "Nothing enters the chart until a clinician approves it.",
    description:
      "Review, edit, or discard any section before sign-off. Ambient accelerates documentation; physicians keep final say over what lands in the record.",
  },
  {
    id: "pulse-ambient-emr-writeback",
    shaderVariant: v9,
    subheading: "Approved notes write back directly to the patient's EMR.",
    description:
      "Signed documentation flows into the chart under the same access controls your staff use today. No shadow databases, no copy-paste between systems.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
