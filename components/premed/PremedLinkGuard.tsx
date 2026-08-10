"use client";

import { useEffect, type ReactNode } from "react";

import { usePremedLearnMoreModal } from "@/components/premed/PremedLearnMoreProvider";

function isPremedModalLink(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("[data-premed-modal]"));
}

function findInterceptedAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (isPremedModalLink(anchor)) return null;
  if (anchor.hasAttribute("data-premed-allow-link")) return null;
  return anchor;
}

function findInterceptedWaitlistButton(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof Element)) return null;
  const button = target.closest(
    ".doehealth-nav-waitlist-shell button, .doehealth-nav-waitlist-label, button[class*='waitlist']",
  );
  if (!(button instanceof HTMLButtonElement)) return null;
  if (isPremedModalLink(button)) return null;
  return button;
}

/** Keeps link styling site-wide on /premed while routing clicks to the learn-more modal. */
export function PremedLinkGuard({ children }: { children: ReactNode }) {
  const { openLearnMoreModal } = usePremedLearnMoreModal();

  useEffect(() => {
    const intercept = (event: Event) => {
      const anchor = findInterceptedAnchor(event.target);
      const waitlistButton = anchor ? null : findInterceptedWaitlistButton(event.target);
      if (!anchor && !waitlistButton) return;
      event.preventDefault();
      event.stopPropagation();
      openLearnMoreModal();
    };

    const onDocumentClick = (event: MouseEvent) => {
      intercept(event);
    };

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      intercept(event);
    };

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onDocumentKeyDown, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      document.removeEventListener("keydown", onDocumentKeyDown, true);
    };
  }, [openLearnMoreModal]);

  return <>{children}</>;
}
