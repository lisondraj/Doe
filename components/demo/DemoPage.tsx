"use client";

import { useState } from "react";

import { DemoClinicLanding } from "@/components/demo/DemoClinicLanding";
import { DemoFrame } from "@/components/demo/DemoFrame";
import { type DemoConsent, DemoGate } from "@/components/demo/DemoGate";

/** /demo: the consent screen an agent meets first, then the clinic's page once it proceeds. */
export function DemoPage() {
  const [consent, setConsent] = useState<DemoConsent | null>(null);
  if (consent) return <DemoClinicLanding consent={consent} />;
  return (
    <DemoFrame>
      <DemoGate onProceed={setConsent} />
    </DemoFrame>
  );
}
