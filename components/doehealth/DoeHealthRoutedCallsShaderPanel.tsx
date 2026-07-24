"use client";

import { useLayoutEffect, useState } from "react";

import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { DOEHEALTH_ROUTED_CALLS_SHADER } from "@/lib/doehealth/doehealth-routed-calls-shader";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

/** /doehealth — standalone shader + call history UI (not wired through main-page carousel card). */
export function DoeHealthRoutedCallsShaderPanel() {
  const [layout, setLayout] = useState<"phone" | "desktop">(() =>
    readBootstrappedDoePhoneVariant() === "desktop" ? "desktop" : "phone",
  );

  useLayoutEffect(() => {
    const sync = () => setLayout(resolveDoePhoneVariant() === "desktop" ? "desktop" : "phone");
    sync();
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { variant, colors, colorBack } = DOEHEALTH_ROUTED_CALLS_SHADER;

  return (
    <div className="doehealth-routed-calls-shader-panel">
      <ProtoGrainGradient
        variant={variant}
        colors={colors}
        colorBack={colorBack}
        static={layout === "desktop"}
        className="doehealth-routed-calls-shader-panel__gradient"
      />
      <div className="doehealth-routed-calls-shader-panel__ui" aria-hidden>
        <DoePhoneCallHistoryVisual layout={layout} />
      </div>
    </div>
  );
}
