"use client";

import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

// Card height +1/3 vs prior (30rem → 40rem, 34rem → ~45.33rem)
export const JOIN_APPLY_CARD_HEIGHT = "h-[40rem] iphone-page:h-[45.33rem]";

const LORA_SIZE =
  "text-[clamp(2rem,6.5vw,3rem)] iphone-page:text-[clamp(2.25rem,1.8rem+2.8vmin,3.5rem)]";

const LORA_SIZE_MEDIUM =
  "text-[clamp(1.65rem,5vw,2.35rem)] iphone-page:text-[clamp(1.85rem,1.5rem+2vmin,2.75rem)]";

const LORA_SIZE_SMALL =
  "text-[clamp(1.35rem,4vw,1.95rem)] iphone-page:text-[clamp(1.5rem,1.2rem+1.5vmin,2.25rem)]";

const CARD_FIELD_TEXT =
  "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]";

function PencilIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden className="iphone-page:h-[18px] iphone-page:w-[18px]">
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

// Steps on the card top-right (0 = name bottom-left; 8 = notes excluded)
const CARD_FIELD_STEPS = [1, 2, 3, 4, 5, 6, 7] as const;

/** Stationery overlay — left margin rule + soft horizontal guides. */
function CardLineOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 3.5rem,
            rgba(30, 52, 58, 0.045) 3.5rem,
            rgba(30, 52, 58, 0.045) calc(3.5rem + 0.5px)
          )`,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[clamp(2.75rem,2.2rem+2.5vmin,3.5rem)] top-0 w-px iphone-page:left-[clamp(3rem,2.35rem+2.8vmin,3.75rem)]"
        aria-hidden
        style={{ backgroundColor: "rgba(154, 143, 130, 0.22)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 52, 58, 0.055) 0.75px, transparent 0)`,
          backgroundSize: "1.75rem 1.75rem",
        }}
      />
    </>
  );
}

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
      <CardLineOverlay />

      {/* Top-right: answered fields */}
      {answeredFields.length > 0 ? (
        <div className="absolute right-0 top-0 max-w-[68%] p-6 iphone-page:p-7">
          <div className="flex flex-col items-end gap-3 iphone-page:gap-3.5">
            {answeredFields.map(({ step, value }) => (
              <div
                key={step}
                className={`flex items-start gap-2 [animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both] ${inter.className}`}
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
                  className="mt-0.5 shrink-0 text-[#1E343A]/32 transition-opacity hover:text-[#1E343A]/60 active:scale-90 iphone-page:mt-1"
                >
                  <PencilIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom-left: fixed two-line slot — tagline ↔ name crossfade in place */}
      <div className={`absolute bottom-0 left-0 w-[min(100%,19em)] ${BLOG_LANDING_HERO_CORNER_PAD}`}>
        <div className="relative min-h-[6.25rem] iphone-page:min-h-[7.3rem]">
          <p
            className={`font-normal leading-[1.04] tracking-[-0.035em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${LORA_SIZE} ${lora.className} ${
              hasName ? "pointer-events-none opacity-0 [filter:blur(7px)]" : "opacity-100 [filter:blur(0)]"
            }`}
            aria-hidden={hasName}
          >
            <span className="block">Redefine care</span>
            <span className="block">with us.</span>
          </p>
          <p
            className={`absolute inset-0 font-normal leading-[1.04] tracking-[-0.03em] text-[#1E343A] transition-[opacity,filter] duration-500 ease-in-out ${nameSizeClass(data.name)} ${lora.className} line-clamp-2 ${
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
