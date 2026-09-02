"use client";

import { DoeDtc2FeatureCarousel } from "@/components/doedtc/DoeDtc2FeatureCarousel";
import { DoeDtc2GlassNav } from "@/components/doedtc/DoeDtc2GlassNav";
import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { useDoeDtcPhonePageChrome } from "@/lib/doedtc/use-doedtc-phone-page-chrome";
import { larkenLight } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc2-page.css";

export function DoeDtc2View() {
  useDoeDtcPhonePageChrome();

  return (
    <DoeDtcPageShell doedtc2>
      <DoeDtc2GlassNav />
      <div className="doedtc2-scroll">
        <div className="doedtc2-build">
          <div className="doedtc2-blue-sticky" aria-hidden>
            <div className="doedtc2-blue-panel" />
          </div>
          <section className="doedtc2-landing" aria-label="Get started">
            <div className="doedtc2-landing__inner">
              <h1 className={`doedtc2-hero-title ${larkenLight.className}`}>
                <span className="doedtc2-hero-title__line">Your 24/7</span>
                <span className="doedtc2-hero-title__line">Health Assistant.</span>
              </h1>
              <div className="doedtc2-landing__form doedtc-profile-layout">
                <DoeDtcLandingForm hideLabel />
              </div>
            </div>
          </section>
          <DoeDtc2FeatureCarousel />
          <section className="doedtc2-section doedtc2-section--over-blue" aria-label="Section 2" />
        </div>
        <section className="doedtc2-section doedtc2-section--white" aria-label="Section 3" />
      </div>
    </DoeDtcPageShell>
  );
}
