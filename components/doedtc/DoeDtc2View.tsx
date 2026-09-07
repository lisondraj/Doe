"use client";

import { useEffect, useState } from "react";

import { LandingEmrGlassNav } from "@/components/doedtc/LandingEmrGlassNav";
import { DoeDtc2FeatureCarousel } from "@/components/doedtc/DoeDtc2FeatureCarousel";
import { DoeDtc2GlassNav } from "@/components/doedtc/DoeDtc2GlassNav";
import { LandingEmrScrollScene } from "@/components/doedtc/LandingEmrScrollScene";
import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { larkenLight } from "@/lib/home/fonts";
import { DOEDTC2_PATH } from "@/lib/site-domains";
import "@/lib/doedtc/doedtc2-page.css";

type DoeDtc2ViewProps = {
  landingEmr?: boolean;
};

function revealClass(segment: "title" | "line2" | "form", revealed: boolean) {
  return [
    "doedtc2-reveal",
    `doedtc2-reveal--${segment}`,
    revealed ? "doedtc2-reveal--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function DoeDtc2LandingCopy({ landingEmr = false }: { landingEmr?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const line1 = landingEmr ? "We've redesigned" : "Your 24/7";

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="doedtc2-landing__inner">
      <h1 className={`doedtc2-hero-title ${larkenLight.className}`}>
        <span className="doedtc2-reveal-hover">
          <span className={revealClass("title", revealed)}>
            <span className="doedtc2-hero-title__line">{line1}</span>
          </span>
        </span>
        <span className="doedtc2-reveal-hover">
          <span className={revealClass("line2", revealed)}>
            {landingEmr ? (
              <span className="doedtc2-hero-title__line doedtc2-hero-title__line--emr-lockup">
                the medical record.
              </span>
            ) : (
              <span className="doedtc2-hero-title__line">Health Assistant.</span>
            )}
          </span>
        </span>
      </h1>
      {landingEmr ? <LandingEmrScrollScene /> : null}
      {!landingEmr ? (
        <div className="doedtc2-reveal-hover doedtc2-landing__form doedtc-profile-layout">
          <div className={revealClass("form", revealed)}>
            <DoeDtcLandingForm hideLabel />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DoeDtc2View({ landingEmr = false }: DoeDtc2ViewProps) {
  return (
    <DoeDtcPageShell doedtc2 landingEmr={landingEmr}>
      {!landingEmr ? (
        <DoeDtc2GlassNav wordmarkHref={DOEDTC2_PATH} />
      ) : null}
      <div className="doedtc2-scroll">
        <div className="doedtc2-build">
          <div className="doedtc2-blue-sticky" aria-hidden>
            <div className="doedtc2-blue-panel" />
          </div>
          {landingEmr ? <LandingEmrGlassNav /> : null}
          <section className="doedtc2-landing" aria-label="Get started">
            <DoeDtc2LandingCopy landingEmr={landingEmr} />
          </section>
          {!landingEmr ? (
            <>
              <DoeDtc2FeatureCarousel />
              <section className="doedtc2-section doedtc2-section--over-blue" aria-label="Section 2" />
            </>
          ) : null}
        </div>
        {!landingEmr ? (
          <section className="doedtc2-section doedtc2-section--white" aria-label="Section 3" />
        ) : null}
      </div>
    </DoeDtcPageShell>
  );
}
