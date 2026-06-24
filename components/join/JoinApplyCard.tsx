"use client";

import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

// Card is roughly 2/3 of a track section height
export const JOIN_APPLY_CARD_HEIGHT = "h-[30rem] iphone-page:h-[34rem]";

const LORA_SIZE =
  "text-[clamp(2rem,6.5vw,3rem)] iphone-page:text-[clamp(2.25rem,1.8rem+2.8vmin,3.5rem)]";

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.5 2.5l2 2M2 14l.75-3.25L11.5 2.5l2 2L4.25 13.25 2 14z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getFieldValue(step: number, data: JoinApplyFormState): string | null {
  switch (step) {
    case 1: return data.email || null;
    case 2: return data.country || null;
    case 3: return data.education || null;
    case 4: return data.schoolName || null;
    case 5: return data.areas.length > 0 ? data.areas.join(", ") : null;
    case 6: return data.resume?.name ?? null;
    case 7: return data.linkedinUsername || null;
    case 8: return data.notes || null;
    default: return null;
  }
}

// Steps shown in the top-right column (step 0 = name goes bottom-left instead)
const CARD_FIELD_STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function JoinApplyCard({
  data,
  onEdit,
}: {
  data: JoinApplyFormState;
  /** Called with the step index when user taps an edit icon on the card. */
  onEdit: (step: number) => void;
}) {
  const hasName = !!data.name;

  const answeredFields = CARD_FIELD_STEPS
    .map((step) => ({ step: step as number, value: getFieldValue(step, data) }))
    .filter((f): f is { step: number; value: string } => f.value !== null);

  return (
    <div
      className={`relative w-full overflow-hidden ${JOIN_APPLY_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      {/* Horizontal ruled-line overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 2.75rem,
            rgba(30,52,58,0.06) 2.75rem,
            rgba(30,52,58,0.06) calc(2.75rem + 1px)
          )`,
        }}
      />

      {/* Top-right: answered fields, one per line */}
      {answeredFields.length > 0 ? (
        <div className="absolute right-0 top-0 max-w-[62%] p-5 iphone-page:p-6">
          <div className="flex flex-col items-end gap-[0.6rem] iphone-page:gap-[0.75rem]">
            {answeredFields.map(({ step, value }) => (
              <div
                key={step}
                className={`flex items-center gap-1.5 [animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both] ${inter.className}`}
              >
                <span className="max-w-[11rem] truncate text-right text-[0.8rem] leading-tight text-[#1E343A]/65 iphone-page:max-w-[13rem] iphone-page:text-[0.875rem]">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit(step)}
                  aria-label={`Edit answer for field ${step}`}
                  className="shrink-0 text-[#1E343A]/30 transition-opacity hover:text-[#1E343A]/60 active:scale-90"
                >
                  <PencilIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom-left: name crossfade over the "Redefine care / with us." tagline */}
      <div className={`absolute bottom-0 left-0 ${BLOG_LANDING_HERO_CORNER_PAD}`}>
        {/* Tagline — fades + blurs out once the name is entered */}
        <p
          className={`font-normal leading-[1.04] tracking-[-0.035em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${LORA_SIZE} ${lora.className} ${
            hasName ? "pointer-events-none opacity-0 [filter:blur(7px)]" : "opacity-100 [filter:blur(0)]"
          }`}
          aria-hidden={hasName}
        >
          <span className="block">Redefine care</span>
          <span className="block">with us.</span>
        </p>
        {/* Name — fades + unblurs in over the tagline */}
        <p
          className={`absolute bottom-0 left-0 font-normal leading-[1.04] tracking-[-0.03em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${LORA_SIZE} ${lora.className} ${
            hasName ? "opacity-100 [filter:blur(0)]" : "pointer-events-none opacity-0 [filter:blur(7px)]"
          }`}
        >
          {data.name}
        </p>
      </div>
    </div>
  );
}
