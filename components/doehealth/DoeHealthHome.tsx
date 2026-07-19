import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";

/**
 * doehealth.care landing — fork of the primary home.
 * Edit this file (and app/doehealth/*) without changing doe.care/.
 */
export function DoeHealthHome() {
  return (
    <DesignersPhoneCanvas>
      <DoePhoneRouter />
    </DesignersPhoneCanvas>
  );
}
