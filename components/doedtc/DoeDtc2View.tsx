"use client";

import { useEffect, useState } from "react";

import { DoeDtc2FeatureCarousel } from "@/components/doedtc/DoeDtc2FeatureCarousel";
import { DoeDtc2GlassNav } from "@/components/doedtc/DoeDtc2GlassNav";
import { DoeDtc2HowSection, DoeDtc2MosaicSection } from "@/components/doedtc/DoeDtc2LowerSections";
import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { larkenLight } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc2-page.css";

function revealClass(segment: "title" | "line2" | "form", revealed: boolean) {
  return [
    "doedtc2-reveal",
    `doedtc2-reveal--${segment}`,
    revealed ? "doedtc2-reveal--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function DoeDtc2LandingCopy() {
  const [revealed, setRevealed] = useState(false);

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
            <span className="doedtc2-hero-title__line">Your 24/7</span>
          </span>
        </span>
        <span className="doedtc2-reveal-hover">
          <span className={revealClass("line2", revealed)}>
            <span className="doedtc2-hero-title__line">Health Assistant.</span>
          </span>
        </span>
      </h1>
      <div className="doedtc2-reveal-hover doedtc2-landing__form doedtc-profile-layout">
        <div className={revealClass("form", revealed)}>
          <DoeDtcLandingForm hideLabel />
        </div>
      </div>
    </div>
  );
}

export function DoeDtc2View() {
  return (
    <DoeDtcPageShell doedtc2>
      <DoeDtc2GlassNav />
      <div className="doedtc2-scroll">
        <div className="doedtc2-build">
          <div className="doedtc2-blue-sticky" aria-hidden>
            <div className="doedtc2-blue-panel" />
          </div>
          <section className="doedtc2-landing" aria-label="Get started">
            <DoeDtc2LandingCopy />
          </section>
          <DoeDtc2FeatureCarousel />
          <DoeDtc2HowSection />
          <DoeDtc2MosaicSection />
        </div>
      </div>
    </DoeDtcPageShell>
  );
}
