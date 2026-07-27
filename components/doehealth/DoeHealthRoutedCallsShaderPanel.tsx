"use client";

import { useLayoutEffect, useState } from "react";

import { DoeHealthAgentsAnywhereBleedUi } from "@/components/doehealth/DoeHealthAgentsAnywhereBleedUi";
import { DoeHealthPriorAuthBleedUi } from "@/components/doehealth/DoeHealthPriorAuthBleedUi";
import { DoeHealthRoutedCallsBleedRightScene } from "@/components/doehealth/DoeHealthRoutedCallsBleedRightScene";
import { DoeHealthRoutedCallsSarahUi } from "@/components/doehealth/DoeHealthRoutedCallsSarahUi";
import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import {
  DOEHEALTH_ROUTED_CALLS_LEFT_2_SHADER,
  DOEHEALTH_ROUTED_CALLS_LEFT_SHADER,
  DOEHEALTH_ROUTED_CALLS_RIGHT_2_SHADER,
  DOEHEALTH_ROUTED_CALLS_RIGHT_SHADER,
} from "@/lib/doehealth/doehealth-routed-calls-shader";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

export type DoeHealthRoutedCallsShaderPreset = "left" | "left-2" | "right" | "right-2";

const DOEHEALTH_ROUTED_CALLS_SHADERS: Record<
  DoeHealthRoutedCallsShaderPreset,
  ProtoGrainGradientSurface
> = {
  left: DOEHEALTH_ROUTED_CALLS_LEFT_SHADER,
  "left-2": DOEHEALTH_ROUTED_CALLS_LEFT_2_SHADER,
  right: DOEHEALTH_ROUTED_CALLS_RIGHT_SHADER,
  "right-2": DOEHEALTH_ROUTED_CALLS_RIGHT_2_SHADER,
};

/** /doehealth — standalone shader + call history UI (not wired through main-page carousel card). */
export function DoeHealthRoutedCallsShaderPanel({
  bleedRight = false,
  shaderPreset,
}: {
  bleedRight?: boolean;
  shaderPreset?: DoeHealthRoutedCallsShaderPreset;
}) {
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

  const preset: DoeHealthRoutedCallsShaderPreset =
    shaderPreset ?? (bleedRight ? "right" : "left");
  const shader = DOEHEALTH_ROUTED_CALLS_SHADERS[preset];
  const { variant, colors, colorBack } = shader;
  const showSarahUi = preset === "left";
  /** Last left bleed — prior auth UI (phone + desktop), matching iPhone composition. */
  const showPriorAuthUi = preset === "left-2";
  const showAgentsAnywhereUi = preset === "right-2";
  const isRightBleed = bleedRight || preset === "right" || preset === "right-2";

  return (
    <div
      className={`doehealth-routed-calls-shader-panel${
        isRightBleed
          ? " doehealth-routed-calls-shader-panel--bleed-right"
          : " doehealth-routed-calls-shader-panel--bleed-left"
      }${showSarahUi ? " doehealth-routed-calls-shader-panel--sarah" : ""}${
        showPriorAuthUi ? " doehealth-routed-calls-shader-panel--prior-auth" : ""
      }${showAgentsAnywhereUi ? " doehealth-routed-calls-shader-panel--agents-anywhere" : ""}`}
    >
      <ProtoGrainGradient
        variant={variant}
        colors={colors}
        colorBack={colorBack}
        static={isRightBleed ? false : layout === "desktop"}
        className="doehealth-routed-calls-shader-panel__gradient"
      />
      <div
        className={`doehealth-routed-calls-shader-panel__ui${
          isRightBleed ? " doehealth-routed-calls-shader-panel__ui--bleed-right" : ""
        }${showSarahUi ? " doehealth-routed-calls-shader-panel__ui--sarah" : ""}${
          showPriorAuthUi ? " doehealth-routed-calls-shader-panel__ui--prior-auth" : ""
        }${showAgentsAnywhereUi ? " doehealth-routed-calls-shader-panel__ui--agents-anywhere" : ""}`}
        aria-hidden={showSarahUi || showPriorAuthUi || showAgentsAnywhereUi ? undefined : true}
      >
        {showSarahUi ? (
          <DoeHealthRoutedCallsSarahUi />
        ) : showPriorAuthUi ? (
          <DoeHealthPriorAuthBleedUi />
        ) : showAgentsAnywhereUi ? (
          <DoeHealthAgentsAnywhereBleedUi />
        ) : bleedRight || preset === "right" ? (
          <DoeHealthRoutedCallsBleedRightScene layout={layout} />
        ) : (
          <DoePhoneCallHistoryVisual layout={layout} />
        )}
      </div>
    </div>
  );
}
