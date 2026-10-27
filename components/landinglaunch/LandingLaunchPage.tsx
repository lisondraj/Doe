"use client";

import Link from "next/link";
import { type FormEvent, useRef } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2Hero } from "@/components/doehealth-desk2/DoeHealthDesk2Hero";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { inter, lora, p22Mackinac } from "@/lib/home/fonts";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import {
  LANDINGLAUNCH_DEK,
  LANDINGLAUNCH_EMAIL_LABEL,
  LANDINGLAUNCH_HEADLINE,
} from "@/lib/landinglaunch/landinglaunch-copy";

import "@/lib/doehealthdesk2/doehealthdesk2.css";
import "@/lib/landinglaunch/landinglaunch.css";

/**
 * /landinglaunch, served at doe.care `/`: the /earlypreview hero's brown ground and salmon dot wave, "We're preparing
 * for launch!", an email box to keep up to date, and the footer at the bottom.
 */
export function LandingLaunchPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  const rootRef = useRef<HTMLDivElement>(null);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  useDoePhoneStableViewport(variant === "phone");
  useDoeHealthDesk2PhoneScreenHeight(variant === "phone");
  useDoeHealthDesk2FitTitles(rootRef);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No list to post to yet: the address opens as a note to James, so nobody's email is dropped on the floor.
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    const subject = encodeURIComponent("Keep me up to date on Doe's launch");
    const body = encodeURIComponent(`Please keep me up to date on Doe's launch: ${email}`);
    window.location.href = `${ABOUT_CONTACT_MAILTO}?subject=${subject}&body=${body}`;
  }

  return (
    <div
      ref={rootRef}
      className={`doehealth-desk2-page earlypreview-page landinglaunch-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {/* Only the mark and the mail icon, on desktop and iPhone: no nav bar. */}
      <header className={`landinglaunch-bar ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <Link href="/" className={`landinglaunch-bar__mark ${lora.className}`}>
          Doe
        </Link>
        <a className="landinglaunch-bar__mail" href={ABOUT_CONTACT_MAILTO} aria-label="Email James">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </header>
      <main className="doehealth-desk2-main landinglaunch-main" aria-label="Launch">
        <div className="landinglaunch-stage doehealth-desk2-nav-wash-surface">
          <DoeHealthDesk2Hero
            centered
            headline={LANDINGLAUNCH_HEADLINE}
            dek={LANDINGLAUNCH_DEK}
            className="doehealth-desk2-nav-wash-surface"
          />
          {/* The hero's dot wave, along the bottom of the screen. */}
          <div className="earlypreview-hero-wave" aria-hidden>
            <div className="earlypreview-hero-wave__fade">
              <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={0.42} amp={60} fade={0.5} />
            </div>
          </div>
          <div className="landinglaunch-form">
            <form className={`doehealth-desk2-hero__secure ${inter.className}`} onSubmit={onSubmit}>
              <label className="doehealth-desk2-hero__email">
                <span className="doehealth-desk2-hero__sr">Your email</span>
                <input type="email" name="email" placeholder="Your email" autoComplete="email" required />
                <button type="submit" aria-label={LANDINGLAUNCH_EMAIL_LABEL}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </label>
            </form>
          </div>
        </div>
        <DoeHealthDesk2Footer />
      </main>
    </div>
  );
}
