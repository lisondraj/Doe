import { DoeHealthBlankBrownBand } from "@/components/doehealth/DoeHealthBlankBrownBand";
import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Intro + blank band — one continuous brown gradient across both viewport-height sections. */
export function DoeHealthBrownBandStack() {
  return (
    <div className="doehealth-brown-band-stack">
      <DoeHealthBlankViewportBand />
      <DoeHealthBlankBrownBand />
    </div>
  );
}
