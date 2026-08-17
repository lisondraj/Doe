import { DOEINSURE_FOOTER, DOEINSURE_NAV_LINKS } from "@/lib/doeinsure/doeinsure-copy";

export function DoeInsureFooter() {
  return (
    <footer className="doeinsure-footer">
      <div>
        <strong>
          Doe <span>Insure</span>
        </strong>
        <p>{DOEINSURE_FOOTER.blurb}</p>
        <p>{DOEINSURE_FOOTER.legal}</p>
        <a href={`mailto:${DOEINSURE_FOOTER.email}`}>{DOEINSURE_FOOTER.email}</a>
      </div>
      <nav className="doeinsure-footer__links" aria-label="Footer">
        {DOEINSURE_NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <a href="/">Doe</a>
      </nav>
    </footer>
  );
}
