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
  return anchor;
}

/** Keeps link styling site-wide on /premed while routing clicks to the learn-more modal. */
export function PremedLinkGuard({ children }: { children: ReactNode }) {
  const { openLearnMoreModal } = usePremedLearnMoreModal();

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const anchor = findInterceptedAnchor(event.target);
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
      openLearnMoreModal();
    };

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      const anchor = findInterceptedAnchor(event.target);
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
      openLearnMoreModal();
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
