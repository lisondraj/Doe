"use client";

import { useState, type FormEvent } from "react";

import {
  CampusAmbassadorCheckboxGroup,
  CampusAmbassadorFormSection,
  CampusAmbassadorLinkedInField,
  CampusAmbassadorSelectField,
  CampusAmbassadorTextField,
} from "@/components/join/CampusAmbassadorFormControls";
import {
  CLINICAL_PARTNERS_FIELD_COUNTRY,
  CLINICAL_PARTNERS_FIELD_EMAIL,
  CLINICAL_PARTNERS_FIELD_FULL_NAME,
  CLINICAL_PARTNERS_FIELD_INSTITUTION,
  CLINICAL_PARTNERS_FIELD_LINKEDIN,
  CLINICAL_PARTNERS_FIELD_PRACTICE_TIMELINE,
  CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE,
  CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE_HINT,
  CLINICAL_PARTNERS_FIELD_TRAINING_STAGE,
  CLINICAL_PARTNERS_FIELD_TRAINING_STAGE_OTHER,
  CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY,
  CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY_OTHER,
  CLINICAL_PARTNERS_HEALTH_PROGRAMS_HEADING,
  CLINICAL_PARTNERS_HEALTH_PROGRAM_OTHER_PLACEHOLDER,
  CLINICAL_PARTNERS_INTERESTS_HEADING,
  CLINICAL_PARTNERS_REQUIRED_NOTE,
  CLINICAL_PARTNERS_SELECT_ALL_HINT,
  CLINICAL_PARTNERS_SUBMIT_INCOMPLETE_MESSAGE,
  CLINICAL_PARTNERS_SUBMIT_LABEL,
  CLINICAL_PARTNERS_SUBMIT_SUCCESS_MESSAGE,
} from "@/lib/partners/clinical-partners-copy";
import {
  CLINICAL_PARTNERS_COUNTRY_OPTIONS,
  CLINICAL_PARTNERS_HEALTH_PROGRAM_OPTIONS,
  CLINICAL_PARTNERS_INITIAL_FORM_STATE,
  CLINICAL_PARTNERS_INTEREST_OPTIONS,
  CLINICAL_PARTNERS_PRACTICE_TIMELINE_OPTIONS,
  CLINICAL_PARTNERS_TRAINING_STAGE_OPTIONS,
  CLINICAL_PARTNERS_YEAR_OF_STUDY_OPTIONS,
  isClinicalPartnersFormValid,
  toggleClinicalPartnersSelection,
  type ClinicalPartnersFormState,
  type ClinicalPartnersHealthProgramId,
  type ClinicalPartnersInterestId,
} from "@/lib/partners/clinical-partners-form";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans, inter } from "@/lib/home/fonts";

type ClinicalPartnersApplyPanelProps = {
  id?: string;
};

type SubmitFeedback = "incomplete" | "success" | null;

/** Clinical partners application — survey UI only (no backend persistence yet). */
export function ClinicalPartnersApplyPanel({ id }: ClinicalPartnersApplyPanelProps) {
  const [form, setForm] = useState<ClinicalPartnersFormState>(CLINICAL_PARTNERS_INITIAL_FORM_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback>(null);

  const patchForm = (patch: Partial<ClinicalPartnersFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
    if (submitFeedback === "incomplete") {
      setSubmitFeedback(null);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isClinicalPartnersFormValid(form)) {
      setSubmitFeedback("incomplete");
      return;
    }

    setSubmitted(true);
    setSubmitFeedback("success");
  };

  return (
    <aside
      id={id}
      className={`campus-ambassador-apply relative flex w-full items-stretch overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[#271F17] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Clinical partners application"
    >
      <form
        className="relative z-10 flex w-full flex-col gap-6 px-6 py-8 iphone-page:gap-7 iphone-page:px-8 iphone-page:py-10"
        onSubmit={onSubmit}
        noValidate
      >
        <p className={`campus-ambassador-required-note text-center ${inter.className}`}>
          {CLINICAL_PARTNERS_REQUIRED_NOTE}
        </p>

        <CampusAmbassadorFormSection>
          <CampusAmbassadorTextField
            label={CLINICAL_PARTNERS_FIELD_FULL_NAME}
            name="clinical-partners-full-name"
            value={form.fullName}
            onChange={(fullName) => patchForm({ fullName })}
            autoComplete="name"
          />

          <CampusAmbassadorTextField
            label={CLINICAL_PARTNERS_FIELD_EMAIL}
            name="clinical-partners-email"
            value={form.email}
            onChange={(email) => patchForm({ email })}
            autoComplete="email"
          />

          <CampusAmbassadorSelectField
            label={CLINICAL_PARTNERS_FIELD_COUNTRY}
            name="clinical-partners-country"
            value={form.country}
            onChange={(country) =>
              patchForm({ country: country as ClinicalPartnersFormState["country"] })
            }
            options={CLINICAL_PARTNERS_COUNTRY_OPTIONS}
            placeholder="Select a country"
          />

          <CampusAmbassadorTextField
            label={CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE}
            description={CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE_HINT}
            name="clinical-partners-state-or-province"
            value={form.stateOrProvince}
            onChange={(stateOrProvince) => patchForm({ stateOrProvince })}
            autoComplete="address-level1"
            placeholder="State or province"
          />

          <CampusAmbassadorTextField
            label={CLINICAL_PARTNERS_FIELD_INSTITUTION}
            name="clinical-partners-institution"
            value={form.institution}
            onChange={(institution) => patchForm({ institution })}
            placeholder="School, hospital, or program name"
          />

          <CampusAmbassadorSelectField
            label={CLINICAL_PARTNERS_FIELD_TRAINING_STAGE}
            name="clinical-partners-training-stage"
            value={form.trainingStage}
            onChange={(trainingStage) =>
              patchForm({
                trainingStage: trainingStage as ClinicalPartnersFormState["trainingStage"],
                trainingStageOther: trainingStage === "other" ? form.trainingStageOther : "",
                yearOfStudy: trainingStage === "recently-graduated" ? "" : form.yearOfStudy,
                yearOfStudyOther: trainingStage === "recently-graduated" ? "" : form.yearOfStudyOther,
              })
            }
            options={CLINICAL_PARTNERS_TRAINING_STAGE_OPTIONS}
            placeholder="Select your training stage"
          />

          {form.trainingStage === "other" ? (
            <CampusAmbassadorTextField
              label={CLINICAL_PARTNERS_FIELD_TRAINING_STAGE_OTHER}
              name="clinical-partners-training-stage-other"
              value={form.trainingStageOther}
              onChange={(trainingStageOther) => patchForm({ trainingStageOther })}
            />
          ) : null}

          {form.trainingStage !== "recently-graduated" ? (
            <>
              <CampusAmbassadorSelectField
                label={CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY}
                name="clinical-partners-year-of-study"
                value={form.yearOfStudy}
                onChange={(yearOfStudy) =>
                  patchForm({
                    yearOfStudy: yearOfStudy as ClinicalPartnersFormState["yearOfStudy"],
                    yearOfStudyOther: yearOfStudy === "other" ? form.yearOfStudyOther : "",
                  })
                }
                options={CLINICAL_PARTNERS_YEAR_OF_STUDY_OPTIONS}
                placeholder="Select your year"
              />

              {form.yearOfStudy === "other" ? (
                <CampusAmbassadorTextField
                  label={CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY_OTHER}
                  name="clinical-partners-year-of-study-other"
                  value={form.yearOfStudyOther}
                  onChange={(yearOfStudyOther) => patchForm({ yearOfStudyOther })}
                />
              ) : null}
            </>
          ) : null}

          <CampusAmbassadorSelectField
            label={CLINICAL_PARTNERS_FIELD_PRACTICE_TIMELINE}
            name="clinical-partners-practice-timeline"
            value={form.practiceTimeline}
            onChange={(practiceTimeline) =>
              patchForm({
                practiceTimeline: practiceTimeline as ClinicalPartnersFormState["practiceTimeline"],
              })
            }
            options={CLINICAL_PARTNERS_PRACTICE_TIMELINE_OPTIONS}
            placeholder="Select a timeline"
          />

          <CampusAmbassadorCheckboxGroup
            legend={CLINICAL_PARTNERS_HEALTH_PROGRAMS_HEADING}
            hint={CLINICAL_PARTNERS_SELECT_ALL_HINT}
            name="clinical-partners-health-programs"
            options={CLINICAL_PARTNERS_HEALTH_PROGRAM_OPTIONS}
            values={form.healthPrograms}
            onToggle={(id: ClinicalPartnersHealthProgramId) =>
              patchForm({
                healthPrograms: toggleClinicalPartnersSelection(form.healthPrograms, id),
                healthProgramOther:
                  id === "other" && form.healthPrograms.includes("other")
                    ? ""
                    : form.healthProgramOther,
              })
            }
            otherOptionId="other"
            otherValue={form.healthProgramOther}
            onOtherChange={(healthProgramOther) => patchForm({ healthProgramOther })}
            otherPlaceholder={CLINICAL_PARTNERS_HEALTH_PROGRAM_OTHER_PLACEHOLDER}
            required
          />

          <CampusAmbassadorCheckboxGroup
            legend={CLINICAL_PARTNERS_INTERESTS_HEADING}
            hint={CLINICAL_PARTNERS_SELECT_ALL_HINT}
            name="clinical-partners-interests"
            options={CLINICAL_PARTNERS_INTEREST_OPTIONS}
            values={form.interests}
            onToggle={(id: ClinicalPartnersInterestId) =>
              patchForm({
                interests: toggleClinicalPartnersSelection(form.interests, id),
              })
            }
          />

          <CampusAmbassadorLinkedInField
            label={CLINICAL_PARTNERS_FIELD_LINKEDIN}
            name="clinical-partners-linkedin"
            value={form.linkedin}
            onChange={(linkedin) => patchForm({ linkedin })}
          />
        </CampusAmbassadorFormSection>

        <button
          type="submit"
          disabled={submitted}
          className={`campus-ambassador-submit mx-auto inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-semibold leading-tight tracking-[-0.01em] disabled:opacity-60 text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] iphone-page:px-7 iphone-page:py-4 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`}
        >
          {CLINICAL_PARTNERS_SUBMIT_LABEL}
        </button>

        {submitFeedback ? (
          <p
            role="alert"
            aria-live="polite"
            className={`campus-ambassador-submit-feedback campus-ambassador-submit-feedback--${submitFeedback} text-center ${inter.className}`}
          >
            {submitFeedback === "success"
              ? CLINICAL_PARTNERS_SUBMIT_SUCCESS_MESSAGE
              : CLINICAL_PARTNERS_SUBMIT_INCOMPLETE_MESSAGE}
          </p>
        ) : null}
      </form>
    </aside>
  );
}
