import { HeroShaderCssFallback } from "@/components/proto/HeroShaderCssFallback";
import { LinkedIn2ModelDropdown } from "@/components/linkedin/LinkedIn2ModelDropdown";
import { LinkedIn2SandboxPill } from "@/components/linkedin/LinkedIn2SandboxPill";
import {
  LINKEDIN2_SANDBOX_PILLS_LEFT,
  LINKEDIN2_SANDBOX_PILLS_RIGHT,
} from "@/lib/linkedin/linkedin2-copy";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";

const LINKEDIN2_CARD_SHADER_COLORS = ["#e8c08e", "#a87654", "#d4a574"] as const;
const LINKEDIN2_CARD_SHADER_BACK = "#2a1f14";

/** Central gradient card with two-column sandbox pill grid and open model picker. */
export function LinkedIn2SandboxCard() {
  return (
    <div className={`linkedin2-scene__card ${PROTO_FONT_CLASS}`} aria-hidden>
      <HeroShaderCssFallback
        colors={LINKEDIN2_CARD_SHADER_COLORS}
        colorBack={LINKEDIN2_CARD_SHADER_BACK}
        variant="sandbox-build"
        className="linkedin2-scene__card-shader"
      />

      <div className="linkedin2-scene__pill-grid">
        <div className="linkedin2-scene__pill-col">
          {LINKEDIN2_SANDBOX_PILLS_LEFT.map((label) => (
            <LinkedIn2SandboxPill key={label} label={label} />
          ))}
        </div>

        <div className="linkedin2-scene__pill-col">
          {LINKEDIN2_SANDBOX_PILLS_RIGHT.map((label) => (
            <LinkedIn2SandboxPill key={label} label={label} />
          ))}
          <LinkedIn2ModelDropdown />
        </div>
      </div>
    </div>
  );
}
