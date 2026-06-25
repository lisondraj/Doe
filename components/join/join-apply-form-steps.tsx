"use client";

import {
  JoinCountrySlider,
  JoinEducationSlider,
  JoinFormBorderedField,
  JoinFormBorderedLinkedInField,
  JoinFormBorderedResumeField,
  JoinFormBorderedStep,
} from "@/components/join/JoinFormControls";
import { JOIN_APPLY_AREAS, type JoinApplyArea, type JoinApplyFormState } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter } from "@/lib/home/fonts";

function toggleArea(areas: JoinApplyArea[], area: JoinApplyArea): JoinApplyArea[] {
  return areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area];
}

type RenderJoinApplyStepOptions = {
  step: number;
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  variant: "mobile" | "desktop";
  interactive: boolean;
  onOpenResumePicker?: () => void;
  resumeUploadError?: string | null;
  markStepTouched?: (step: number) => void;
  onEnter?: () => void;
  enterDisabled?: boolean;
  enterLabel?: string;
};

export function renderJoinApplyStep({
  step,
  data,
  patch,
  variant,
  interactive,
  onOpenResumePicker,
  resumeUploadError,
  markStepTouched,
  onEnter,
}: RenderJoinApplyStepOptions) {
  const readOnly = !interactive;
  const areaLabelSize =
    variant === "mobile"
      ? "px-5 py-[1.65rem] text-[1.375rem] iphone-page:px-5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]"
      : "px-4 py-3.5 text-[1.0625rem]";

  switch (step) {
    case 0:
      return (
        <JoinFormBorderedField
          variant={variant}
          value={data.name}
          onChange={(name) => patch({ name })}
          placeholder="Your name"
          autoComplete="name"
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      );
    case 1:
      return (
        <JoinFormBorderedField
          variant={variant}
          type="email"
          value={data.email}
          onChange={(email) => patch({ email })}
          placeholder="you@email.com"
          autoComplete="email"
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      );
    case 2:
      return (
        <JoinFormBorderedStep variant={variant}>
          <JoinCountrySlider
            variant={variant}
            value={data.country}
            onChange={(country) => patch({ country })}
            prompt="Where are you based?"
            disabled={readOnly}
            hidePrompt
          />
        </JoinFormBorderedStep>
      );
    case 3:
      return (
        <JoinFormBorderedStep variant={variant}>
          <JoinEducationSlider
            variant={variant}
            value={data.education}
            onChange={(education) => patch({ education })}
            prompt="What's your education level?"
            disabled={readOnly}
            hidePrompt
          />
        </JoinFormBorderedStep>
      );
    case 4:
      return (
        <JoinFormBorderedField
          variant={variant}
          value={data.schoolName}
          onChange={(schoolName) => patch({ schoolName })}
          placeholder="School name"
          autoComplete="organization"
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      );
    case 5:
      return (
        <JoinFormBorderedStep variant={variant}>
          <div className={`grid grid-cols-2 ${variant === "mobile" ? "gap-3 iphone-page:gap-3.5" : "gap-2.5"}`}>
            {JOIN_APPLY_AREAS.map((area) => {
              const active = data.areas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  data-join-apply-interactive
                  aria-pressed={active}
                  disabled={readOnly}
                  tabIndex={interactive ? 0 : -1}
                  onClick={() => patch({ areas: toggleArea(data.areas, area) })}
                  className={`rounded-xl text-center font-medium leading-snug tracking-[-0.01em] transition-colors ${areaLabelSize} ${inter.className}`}
                  style={
                    active
                      ? {
                          backgroundColor: JOIN_FORM_BEIGE.meter,
                          color: JOIN_FORM_BEIGE.page,
                        }
                      : {
                          backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                          color: "rgba(30, 52, 58, 0.58)",
                        }
                  }
                >
                  {area}
                </button>
              );
            })}
          </div>
        </JoinFormBorderedStep>
      );
    case 6:
      return (
        <JoinFormBorderedResumeField
          variant={variant}
          resumeFileName={data.resumeFileName}
          resumeFileType={data.resumeFileType}
          onOpenPicker={() => onOpenResumePicker?.()}
          uploadError={resumeUploadError}
          readOnly={readOnly}
          interactive={interactive}
        />
      );
    case 7:
      return (
        <JoinFormBorderedLinkedInField
          variant={variant}
          value={data.linkedinUsername}
          onChange={(linkedinUsername) => patch({ linkedinUsername: linkedinUsername.replace(/\s/g, "") })}
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      );
    case 8:
      return (
        <JoinFormBorderedField
          variant={variant}
          value={data.programOfStudy}
          onChange={(programOfStudy) => patch({ programOfStudy })}
          placeholder="Program of study"
          autoComplete="organization-title"
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      );
    default:
      return null;
  }
}
