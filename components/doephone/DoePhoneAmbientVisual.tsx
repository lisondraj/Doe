"use client";

import { DoePhoneHomeRecallQueueVisual } from "@/components/doephone/DoePhoneHomeRecallQueueVisual";

/** Recall queue — Ambient carousel slide (feature shader card). */
export function DoePhoneAmbientVisual({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  return <DoePhoneHomeRecallQueueVisual layout={layout} />;
}
