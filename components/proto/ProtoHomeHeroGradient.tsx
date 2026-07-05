"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { protoHomeHeroGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

/** /proto home hero — animated wave shader, no grain overlay or line grid. */
export function ProtoHomeHeroGradient() {
  const surface = protoHomeHeroGrainGradientSurface();
  return (
    <ProtoGrainGradient
      variant={surface.variant}
      colors={surface.colors}
      colorBack={surface.colorBack}
    />
  );
}
