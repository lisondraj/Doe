"use client";

import { type FormEvent, useRef, useState } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2Hero } from "@/components/doehealth-desk2/DoeHealthDesk2Hero";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import {
  LANDINGLAUNCH_DEK,
  LANDINGLAUNCH_EMAIL_LABEL,
  LANDINGLAUNCH_ERROR,
  LANDINGLAUNCH_HEADLINE,
  LANDINGLAUNCH_THANKS,
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

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/launch-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setErrorMessage(response.status === 400 && result?.error ? result.error : LANDINGLAUNCH_ERROR);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMessage(LANDINGLAUNCH_ERROR);
      setStatus("error");
    }
  }

  return (
    <div
      ref={rootRef}
      className={`doehealth-desk2-page earlypreview-page landinglaunch-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {/* The same nav as /earlypreview: the mark and its CTA, with the mail icon in the iPhone menu. */}
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref="/" centerLinks={false} primaryCta={EARLYPREVIEW_NAV_CTA} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref="/" primaryCta={EARLYPREVIEW_NAV_CTA} menuMailTo="james@doe.care" />
      )}
      <DoeHealthDesk2NavWash />
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
            {status === "done" ? (
              <div className={`landinglaunch-thanks ${inter.className}`} role="status" aria-live="polite">
                <p className="landinglaunch-thanks__title">{LANDINGLAUNCH_THANKS.title}</p>
                <p className="landinglaunch-thanks__body">{LANDINGLAUNCH_THANKS.body}</p>
              </div>
            ) : (
              <form className={`doehealth-desk2-invite__form ${inter.className}`} onSubmit={onSubmit}>
                <label>
                  <span className="doehealth-desk2-hero__sr">Your email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    autoComplete="email"
                    required
                    disabled={status === "sending"}
                  />
                  <button type="submit" aria-label={LANDINGLAUNCH_EMAIL_LABEL} disabled={status === "sending"}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </label>
                {status === "error" ? (
                  <p className="landinglaunch-error" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
        {/* The salmon "Teach personal agents about your clinic." panel above the footer, as on /earlypreview, no email box. */}
        <div className="earlypreview-invite-band">
          <DoeHealthDesk2InviteSection showForm={false} />
        </div>
        <DoeHealthDesk2Footer />
      </main>
    </div>
  );
}
