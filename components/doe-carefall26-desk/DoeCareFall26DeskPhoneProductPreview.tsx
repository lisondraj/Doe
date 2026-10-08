"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { DoeCareFall26DeskAppointmentPaperScreen } from "@/components/doe-carefall26-desk/DoeCareFall26DeskAppointmentPaperScreen";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

/** iPhone silhouette containing Paper "03 Appointment" — phone landing product only. */
export function DoeCareFall26DeskPhoneProductPreview() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const sync = () => {
      const { width } = screen.getBoundingClientRect();
      if (width <= 0) return;
      setScale(width / DESIGN_WIDTH);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="carefall26-phone-product" aria-hidden>
      <div className="carefall26-phone-product__device">
        <span className="carefall26-phone-product__btn carefall26-phone-product__btn--silent" />
        <span className="carefall26-phone-product__btn carefall26-phone-product__btn--vol-up" />
        <span className="carefall26-phone-product__btn carefall26-phone-product__btn--vol-down" />
        <span className="carefall26-phone-product__btn carefall26-phone-product__btn--power" />
        <div className="carefall26-phone-product__bezel">
          <div className="carefall26-phone-product__screen" ref={screenRef}>
            <div
              className="carefall26-phone-product__scale"
              style={{
                width: DESIGN_WIDTH,
                height: DESIGN_HEIGHT,
                transform: `scale(${scale})`,
              }}
            >
              <div
                className={`carefall26-appointment-paper-root ${inter.className} ${dmSans.className} ${dmSans.variable} ${p22Mackinac.className} ${p22Mackinac.variable}`}
                style={{
                  ["--font-sans" as string]: inter.style.fontFamily,
                  ["--font-display" as string]: p22Mackinac.style.fontFamily,
                  ["--font-title" as string]: dmSans.style.fontFamily,
                }}
              >
                <DoeCareFall26DeskAppointmentPaperScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
