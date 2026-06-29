import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";

export const dynamic = "force-dynamic";

export default function DesignersPage() {
  return (
    <DesignersPhoneCanvas>
      <DoePhoneRouter />
    </DesignersPhoneCanvas>
  );
}
