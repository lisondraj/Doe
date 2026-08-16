import { PitchBoxCenterLines } from "@/components/pitch/PitchBoxCenterLines";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { suisseIntl } from "@/lib/home/fonts";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

export const pitchBoxTagPillClassName = `rounded-full border border-[rgba(245,230,208,0.28)] bg-[rgba(245,230,208,0.12)] px-[clamp(0.88rem,0.72rem+0.4vw,1.05rem)] py-[clamp(0.46rem,0.38rem+0.22vw,0.54rem)] text-[clamp(0.82rem,0.68rem+0.38vw,0.94rem)] leading-none tracking-[0.04em] text-[rgba(245,230,208,0.88)] ${suisseIntl.className}`;

export type PitchShaderFillBoxProps = {
  surface: ProtoGrainGradientSurface;
  label: string;
  className?: string;
  nameLines?: readonly [string, string];
  namePlacement?: "top-left" | "bottom-right";
  roleLabel?: string;
  roleLabelPlacement?: "above-name" | "below-name";
  credentials?: readonly string[];
  credentialsPlacement?: "top-left" | "bottom-right";
  tags?: readonly string[];
  tagsPlacement?: "bottom-left" | "top-right";
};

/** Shader-backed pitch card with founder metadata overlays. */
export function PitchShaderFillBox({
  surface,
  label,
  className = "",
  nameLines,
  namePlacement = "top-left",
  roleLabel,
  roleLabelPlacement = "below-name",
  credentials,
  credentialsPlacement = "bottom-right",
  tags,
  tagsPlacement = "bottom-left",
}: PitchShaderFillBoxProps) {
  const boxLabelClassName = `${suisseIntl.className} font-normal leading-[0.98] tracking-[-0.036em] text-[#FFF8F0]`;
  const nameClassName = `pointer-events-none absolute z-[2] m-0 p-[clamp(1rem,1.4vw,1.35rem)] text-[clamp(2.85rem,1.25rem+3.6vw,4.75rem)] ${boxLabelClassName}`;
  const credentialsClassName = `pointer-events-none absolute z-[2] m-0 max-w-[min(22ch,88%)] p-[clamp(1rem,1.4vw,1.35rem)] text-[clamp(1.05rem,0.62rem+1.15vw,1.85rem)] font-normal leading-[1.06] tracking-[-0.034em] text-[#FFF8F0] ${suisseIntl.className}`;
  const roleLabelClassName =
    "mt-[0.28em] block text-[clamp(0.72rem,0.56rem+0.38vw,0.92rem)] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(255,248,240,0.76)]";

  return (
    <div
      className={`relative overflow-hidden rounded-[clamp(1.1rem,1.6vw,1.85rem)] ${className}`.trim()}
      aria-label={label}
    >
      <ProtoGrainGradient
        variant={surface.variant}
        colors={surface.colors}
        colorBack={surface.colorBack}
        static
      />
      <PitchBoxCenterLines />
      {nameLines ? (
        <p
          className={`${nameClassName} ${
            namePlacement === "top-left" ? "left-0 top-0 text-left" : "bottom-0 right-0 text-right"
          }`}
        >
          {roleLabel && roleLabelPlacement === "above-name" ? (
            <span className={`${roleLabelClassName} mb-[0.28em] mt-0`}>{roleLabel}</span>
          ) : null}
          <span className="block">{nameLines[0]}</span>
          <span className="block">{nameLines[1]}</span>
          {roleLabel && roleLabelPlacement === "below-name" ? (
            <span className={roleLabelClassName}>{roleLabel}</span>
          ) : null}
        </p>
      ) : null}
      {credentials ? (
        <p
          className={`${credentialsClassName} ${
            credentialsPlacement === "top-left"
              ? "left-0 top-0 text-left"
              : "bottom-0 right-0 text-right"
          }`}
        >
          {credentials.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : null}
      {tags ? (
        <div
          className={`pointer-events-none absolute z-[2] flex flex-col gap-[0.45rem] p-[clamp(1rem,1.4vw,1.35rem)] ${
            tagsPlacement === "top-right"
              ? "right-0 top-0 items-end"
              : "bottom-0 left-0 items-start"
          }`}
        >
          {tags.map((tag) => (
            <span key={tag} className={pitchBoxTagPillClassName}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
