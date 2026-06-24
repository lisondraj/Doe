"use client";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

// Card height +1/6 vs prior (40rem → ~46.67rem, 45.33rem → ~52.89rem)
export const JOIN_APPLY_CARD_HEIGHT = "h-[46.67rem] iphone-page:h-[52.89rem]";

const LORA_SIZE =
  "text-[clamp(2rem,6.5vw,3rem)] iphone-page:text-[clamp(2.25rem,1.8rem+2.8vmin,3.5rem)]";

const LORA_SIZE_MEDIUM =
  "text-[clamp(1.65rem,5vw,2.35rem)] iphone-page:text-[clamp(1.85rem,1.5rem+2vmin,2.75rem)]";

const LORA_SIZE_SMALL =
  "text-[clamp(1.35rem,4vw,1.95rem)] iphone-page:text-[clamp(1.5rem,1.2rem+1.5vmin,2.25rem)]";

const CARD_FIELD_TEXT =
  "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]";

/** Fixed two-line block — tagline and name share the same slot. */
const BOTTOM_LEFT_TWO_LINE =
  "line-clamp-2 max-h-[calc(2*1.04em)] overflow-hidden leading-[1.04]";

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden className="iphone-page:h-[22px] iphone-page:w-[22px]">
      <path
        d="M11.5 2.5l2 2M2 14l.75-3.25L11.5 2.5l2 2L4.25 13.25 2 14z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCardValue(_step: number, raw: string): string {
  return capitalizeFirst(raw);
}

function getFieldValue(step: number, data: JoinApplyFormState): string | null {
  switch (step) {
    case 1:
      return data.email || null;
    case 2:
      return data.country || null;
    case 3:
      return data.education || null;
    case 4:
      return data.schoolName || null;
    case 5:
      return data.areas.length > 0 ? data.areas.join(", ") : null;
    case 6:
      return data.resume?.name ?? null;
    case 7:
      return data.linkedinUsername || null;
    default:
      return null;
  }
}

function nameSizeClass(name: string): string {
  const len = name.trim().length;
  if (len <= 18) return LORA_SIZE;
  if (len <= 32) return LORA_SIZE_MEDIUM;
  return LORA_SIZE_SMALL;
}

const CARD_FIELD_STEPS = [1, 2, 3, 4, 5, 6, 7] as const;

export function JoinApplyCard({
  data,
  onEdit,
}: {
  data: JoinApplyFormState;
  onEdit: (step: number) => void;
}) {
  const hasName = !!data.name.trim();

  const answeredFields = CARD_FIELD_STEPS.map((step) => ({
    step: step as number,
    value: getFieldValue(step, data),
  })).filter((f): f is { step: number; value: string } => f.value !== null);

  return (
    <div
      className={`relative w-full overflow-hidden border ${JOIN_APPLY_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      {/* Research track converging lines — centered */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-square h-[58%] w-[88%] max-h-[26rem] max-w-full">
          <JoinInternLineGraphic variant={2} />
        </div>
      </div>

      {/* Top-right: answered fields */}
      {answeredFields.length > 0 ? (
        <div className="absolute right-0 top-0 z-[2] max-w-[68%] p-6 iphone-page:p-7">
          <div className="flex flex-col items-end gap-3 iphone-page:gap-3.5">
            {answeredFields.map(({ step, value }) => (
              <div
                key={step}
                className={`flex items-center gap-2.5 [animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both] ${inter.className}`}
              >
                <span
                  className={`max-w-[13rem] text-right text-[#1E343A]/72 iphone-page:max-w-[15rem] ${CARD_FIELD_TEXT}`}
                >
                  {formatCardValue(step, value)}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit(step)}
                  aria-label={`Edit answer for field ${step}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 iphone-page:h-11 iphone-page:w-11 iphone-page:rounded-[0.85rem]"
                  style={{
                    backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                    color: JOIN_FORM_BEIGE.meter,
                  }}
                >
                  <PencilIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom-left: two-line slot — tagline ↔ name */}
      <div className={`absolute bottom-0 left-0 z-[2] w-[min(100%,19em)] ${BLOG_LANDING_HERO_CORNER_PAD}`}>
        <div className="relative min-h-[6.25rem] iphone-page:min-h-[7.3rem]">
          <p
            className={`font-normal tracking-[-0.035em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${LORA_SIZE} ${lora.className} ${BOTTOM_LEFT_TWO_LINE} ${
              hasName ? "pointer-events-none opacity-0 [filter:blur(7px)]" : "opacity-100 [filter:blur(0)]"
            }`}
            aria-hidden={hasName}
          >
            <span className="block">Redefine care</span>
            <span className="block">with us.</span>
          </p>
          <p
            className={`absolute inset-0 font-normal tracking-[-0.03em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${nameSizeClass(data.name)} ${lora.className} ${BOTTOM_LEFT_TWO_LINE} ${
              hasName ? "opacity-100 [filter:blur(0)]" : "pointer-events-none opacity-0 [filter:blur(7px)]"
            }`}
          >
            {data.name.trim()}
          </p>
        </div>
      </div>
    </div>
  );
}
