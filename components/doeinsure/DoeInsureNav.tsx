"use client";

import { DOEINSURE_NAV_LINKS } from "@/lib/doeinsure/doeinsure-copy";

export function DoeInsureNav({ compact = false }: { compact?: boolean }) {
  return (
    <header className="doeinsure-nav">
      <a className="doeinsure-nav__mark" href="#top">
        Doe <span>Insure</span>
      </a>
      {compact ? null : (
        <nav className="doeinsure-nav__links" aria-label="Doe Insure">
          {DOEINSURE_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
      <a className="doeinsure-btn" href="#request">
        Request coverage
      </a>
    </header>
  );
}
