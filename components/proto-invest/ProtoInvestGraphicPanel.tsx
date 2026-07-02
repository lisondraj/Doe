"use client";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { PROTO_INVEST_GRAPHIC_PANEL_TW } from "@/lib/proto-invest/proto-invest-layout-styles";

/** Dark proto panel with orange line graphic (replaces beige /about bands). */
export function ProtoInvestGraphicPanel({ graphic }: { graphic: 0 | 1 | 2 | 3 }) {
  return (
    <div className={PROTO_INVEST_GRAPHIC_PANEL_TW} aria-hidden>
      <JoinInternLineGraphic variant={graphic} onOrange />
    </div>
  );
}
