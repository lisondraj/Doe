"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { DoeHealthPhoneReveal } from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { ProductMobileView } from "@/components/product/ProductMobileView";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";
import "@/lib/product/product-mobile.css";

const PRODUCT_PHONE_DESIGN_WIDTH = 390;
const PRODUCT_PHONE_DESIGN_HEIGHT = 844;

/** Right-bleed — iPhone silhouette with /product Today tab + Access your / agents anywhere. */
export function DoeHealthAgentsAnywhereBleedUi() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.agentsAnywhereSectionTitle;

  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const sync = () => {
      const { width } = screen.getBoundingClientRect();
      if (width <= 0) return;
      // Fill screen width so Today chrome is edge-aligned in the silhouette;
      // height may clip slightly after Dynamic Island clearance.
      setScale(width / PRODUCT_PHONE_DESIGN_WIDTH);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="doehealth-agents-anywhere-bleed" aria-hidden>
      <DoeHealthPhoneReveal segment="title" className="doehealth-agents-anywhere-bleed__reveal-ui">
        <div className="doehealth-agents-anywhere-bleed__stage">
          <div className="doehealth-agents-anywhere-phone" aria-hidden>
            <span className="doehealth-agents-anywhere-phone__btn doehealth-agents-anywhere-phone__btn--silent" />
            <span className="doehealth-agents-anywhere-phone__btn doehealth-agents-anywhere-phone__btn--vol-up" />
            <span className="doehealth-agents-anywhere-phone__btn doehealth-agents-anywhere-phone__btn--vol-down" />
            <span className="doehealth-agents-anywhere-phone__btn doehealth-agents-anywhere-phone__btn--power" />
            <div className="doehealth-agents-anywhere-phone__bezel">
              <span className="doehealth-agents-anywhere-phone__island" />
              <div className="doehealth-agents-anywhere-phone__screen" ref={screenRef}>
                <div
                  className="doehealth-agents-anywhere-phone__scale"
                  style={{
                    width: PRODUCT_PHONE_DESIGN_WIDTH,
                    height: PRODUCT_PHONE_DESIGN_HEIGHT,
                    transform: `scale(${scale})`,
                  }}
                >
                  <ProductMobileView embed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoeHealthPhoneReveal>

      <DoeHealthPhoneReveal segment="carousel" className="doehealth-agents-anywhere-bleed__title">
        <h2 className={`doehealth-agents-anywhere-bleed__title-text ${suisseIntl.className}`}>
          <span className="doehealth-agents-anywhere-bleed__title-line">{line1}</span>
          <span className="doehealth-agents-anywhere-bleed__title-line">{line2}</span>
        </h2>
      </DoeHealthPhoneReveal>
    </div>
  );
}
