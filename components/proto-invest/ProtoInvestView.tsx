"use client";

import { ProtoRouteShell } from "@/components/proto/ProtoRouteShell";
import { ProtoFooter } from "@/components/proto/ProtoFooter";
import { ProtoInvestMobileContent } from "@/components/proto-invest/ProtoInvestMobileContent";

/** /proto-invest — investor mission page in proto dark chrome. */
export function ProtoInvestView() {
  return (
    <ProtoRouteShell>
      <ProtoInvestMobileContent />
      <ProtoFooter />
    </ProtoRouteShell>
  );
}
