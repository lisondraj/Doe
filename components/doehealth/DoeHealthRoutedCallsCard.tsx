import {
  DoeHealthRoutedCallsShaderPanel,
  type DoeHealthRoutedCallsShaderPreset,
} from "@/components/doehealth/DoeHealthRoutedCallsShaderPanel";
import "@/lib/doehealth/doehealth-initiatives.css";

/** /doehealth — routed calls shader shell on the brown band. */
export function DoeHealthRoutedCallsCard({
  className = "",
  bleedRight = false,
  shaderPreset,
}: {
  className?: string;
  bleedRight?: boolean;
  shaderPreset?: DoeHealthRoutedCallsShaderPreset;
}) {
  return (
    <div
      className={`doehealth-routed-calls${bleedRight ? " doehealth-routed-calls--bleed-right" : ""}${className ? ` ${className}` : ""}`}
    >
      <div
        className={`doehealth-routed-calls__shader-card${bleedRight ? " doehealth-routed-calls__shader-card--bleed-right" : ""}`}
      >
        <DoeHealthRoutedCallsShaderPanel bleedRight={bleedRight} shaderPreset={shaderPreset} />
      </div>
    </div>
  );
}
