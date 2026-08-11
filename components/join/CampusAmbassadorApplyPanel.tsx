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
  CAMPUS_AMBASSADOR_FIELD_COUNTRY,
  CAMPUS_AMBASSADOR_FIELD_EMAIL,
  CAMPUS_AMBASSADOR_FIELD_FULL_NAME,
  CAMPUS_AMBASSADOR_FIELD_LINKEDIN,
  CAMPUS_AMBASSADOR_FIELD_OF_STUDY,
  CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL,
  CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL_OTHER,
  CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE,
  CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE_HINT,
  CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY,
  CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY_OTHER,
  CAMPUS_AMBASSADOR_HEALTH_PROGRAMS_HEADING,
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OTHER_PLACEHOLDER,
  CAMPUS_AMBASSADOR_REQUIRED_NOTE,
  CAMPUS_AMBASSADOR_SELECT_ALL_HINT,
  CAMPUS_AMBASSADOR_STATEMENTS_HEADING,
  CAMPUS_AMBASSADOR_SUBMIT_LABEL,
} from "@/lib/join/campus-ambassador-copy";
import {
  CAMPUS_AMBASSADOR_COUNTRY_OPTIONS,
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS,
  CAMPUS_AMBASSADOR_INITIAL_FORM_STATE,
  CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS,
  CAMPUS_AMBASSADOR_STATEMENT_OPTIONS,
  CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS,
  isCampusAmbassadorFormValid,
  toggleCampusAmbassadorSelection,
  type CampusAmbassadorFormState,
  type CampusAmbassadorHealthProgramId,
  type CampusAmbassadorStatementId,
} from "@/lib/join/campus-ambassador-form";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans, inter } from "@/lib/home/fonts";

type CampusAmbassadorApplyPanelProps = {
  id?: string;
};

/** Campus ambassador application — full survey with custom Doe-styled controls. */
export function CampusAmbassadorApplyPanel({ id }: CampusAmbassadorApplyPanelProps) {
  const [form, setForm] = useState<CampusAmbassadorFormState>(CAMPUS_AMBASSADOR_INITIAL_FORM_STATE);
  const [submitted, setSubmitted] = useState(false);

  const patchForm = (patch: Partial<CampusAmbassadorFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCampusAmbassadorFormValid(form)) return;
    setSubmitted(true);
  };

  return (
    <aside
      id={id}
      className={`campus-ambassador-apply relative flex w-full items-stretch overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[#271F17] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Campus ambassador application"
    >
      <form
        className="relative z-10 flex w-full flex-col gap-6 px-6 py-8 iphone-page:gap-7 iphone-page:px-8 iphone-page:py-10"
        onSubmit={onSubmit}
        noValidate
      >
        <p className={`campus-ambassador-required-note text-center ${inter.className}`}>
          {CAMPUS_AMBASSADOR_REQUIRED_NOTE}
        </p>

        <CampusAmbassadorFormSection>
          <CampusAmbassadorTextField
            label={CAMPUS_AMBASSADOR_FIELD_FULL_NAME}
            name="campus-ambassador-full-name"
            value={form.fullName}
            onChange={(fullName) => patchForm({ fullName })}
            autoComplete="name"
          />

          <CampusAmbassadorTextField
            label={CAMPUS_AMBASSADOR_FIELD_EMAIL}
            name="campus-ambassador-email"
            type="email"
            value={form.email}
            onChange={(email) => patchForm({ email })}
            autoComplete="email"
          />

          <CampusAmbassadorSelectField
            label={CAMPUS_AMBASSADOR_FIELD_COUNTRY}
            name="campus-ambassador-country"
            value={form.country}
            onChange={(country) =>
              patchForm({ country: country as CampusAmbassadorFormState["country"] })
            }
            options={CAMPUS_AMBASSADOR_COUNTRY_OPTIONS}
            placeholder="Select a country"
          />

          <CampusAmbassadorTextField
            label={CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE}
            description={CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE_HINT}
            name="campus-ambassador-state-or-province"
            value={form.stateOrProvince}
            onChange={(stateOrProvince) => patchForm({ stateOrProvince })}
            autoComplete="address-level1"
            placeholder="State or province"
          />

          <CampusAmbassadorSelectField
            label={CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL}
            name="campus-ambassador-school-level"
            value={form.schoolLevel}
            onChange={(schoolLevel) =>
              patchForm({
                schoolLevel: schoolLevel as CampusAmbassadorFormState["schoolLevel"],
                schoolLevelOther: schoolLevel === "other" ? form.schoolLevelOther : "",
                yearOfStudy: schoolLevel === "graduated" ? "" : form.yearOfStudy,
                yearOfStudyOther: schoolLevel === "graduated" ? "" : form.yearOfStudyOther,
              })
            }
            options={CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS}
            placeholder="Select your current level"
          />

          {form.schoolLevel === "other" ? (
            <CampusAmbassadorTextField
              label={CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL_OTHER}
              name="campus-ambassador-school-level-other"
              value={form.schoolLevelOther}
              onChange={(schoolLevelOther) => patchForm({ schoolLevelOther })}
            />
          ) : null}

          {form.schoolLevel !== "graduated" ? (
            <>
              <CampusAmbassadorSelectField
                label={CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY}
                name="campus-ambassador-year-of-study"
                value={form.yearOfStudy}
                onChange={(yearOfStudy) =>
                  patchForm({
                    yearOfStudy: yearOfStudy as CampusAmbassadorFormState["yearOfStudy"],
                    yearOfStudyOther: yearOfStudy === "other" ? form.yearOfStudyOther : "",
                  })
                }
                options={CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS}
                placeholder="Select your year"
              />

              {form.yearOfStudy === "other" ? (
                <CampusAmbassadorTextField
                  label={CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY_OTHER}
                  name="campus-ambassador-year-of-study-other"
                  value={form.yearOfStudyOther}
                  onChange={(yearOfStudyOther) => patchForm({ yearOfStudyOther })}
                />
              ) : null}
            </>
          ) : null}

          <CampusAmbassadorTextField
            label={CAMPUS_AMBASSADOR_FIELD_OF_STUDY}
            name="campus-ambassador-field-of-study"
            value={form.fieldOfStudy}
            onChange={(fieldOfStudy) => patchForm({ fieldOfStudy })}
          />

          <CampusAmbassadorCheckboxGroup
            legend={CAMPUS_AMBASSADOR_HEALTH_PROGRAMS_HEADING}
            hint={CAMPUS_AMBASSADOR_SELECT_ALL_HINT}
            name="campus-ambassador-health-programs"
            options={CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS}
            values={form.healthPrograms}
            onToggle={(id: CampusAmbassadorHealthProgramId) =>
              patchForm({
                healthPrograms: toggleCampusAmbassadorSelection(form.healthPrograms, id),
                healthProgramOther:
                  id === "other" && form.healthPrograms.includes("other")
                    ? ""
                    : form.healthProgramOther,
              })
            }
            otherOptionId="other"
            otherValue={form.healthProgramOther}
            onOtherChange={(healthProgramOther) => patchForm({ healthProgramOther })}
            otherPlaceholder={CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OTHER_PLACEHOLDER}
            required
          />

          <CampusAmbassadorCheckboxGroup
            legend={CAMPUS_AMBASSADOR_STATEMENTS_HEADING}
            hint={CAMPUS_AMBASSADOR_SELECT_ALL_HINT}
            name="campus-ambassador-statements"
            options={CAMPUS_AMBASSADOR_STATEMENT_OPTIONS}
            values={form.statements}
            onToggle={(id: CampusAmbassadorStatementId) =>
              patchForm({
                statements: toggleCampusAmbassadorSelection(form.statements, id),
              })
            }
          />

          <CampusAmbassadorLinkedInField
            label={CAMPUS_AMBASSADOR_FIELD_LINKEDIN}
            name="campus-ambassador-linkedin"
            value={form.linkedin}
            onChange={(linkedin) => patchForm({ linkedin })}
          />
        </CampusAmbassadorFormSection>

        <button
          type="submit"
          disabled={submitted}
          className={`campus-ambassador-submit mx-auto inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-semibold leading-tight tracking-[-0.01em] disabled:opacity-60 text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] iphone-page:px-7 iphone-page:py-4 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`}
        >
          {submitted ? "Application received" : CAMPUS_AMBASSADOR_SUBMIT_LABEL}
        </button>
      </form>
    </aside>
  );
}
