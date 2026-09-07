"use client";

import Link from "next/link";

import { inter, lora } from "@/lib/home/fonts";
import { JOIN_PAGE_HREF, LANDING_EMR_PATH } from "@/lib/site-domains";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/story" },
  { label: "Security", href: "/blog/federated-clinic-intelligence" },
  { label: "Genome", href: "/blog/introducing-genome" },
] as const;

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="landing-emr-top-nav__chevron">
      <path
        d="M3.25 10 8 5.25 12.75 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingEmrGlassNav() {
  return (
    <header className="landing-emr-top-nav">
      <nav className={`landing-emr-top-nav__inner ${inter.className}`} aria-label="Primary">
        <Link
          className={`landing-emr-top-nav__brand ${lora.className}`}
          href={LANDING_EMR_PATH}
        >
          Doe
        </Link>

        <div className="landing-emr-top-nav__links">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} className="landing-emr-top-nav__link" href={item.href}>
              <span>{item.label}</span>
              <ChevronUpIcon />
            </Link>
          ))}
        </div>

        <a className="landing-emr-top-nav__cta" href={JOIN_PAGE_HREF}>
          Join Waitlist
        </a>
      </nav>
    </header>
  );
}
