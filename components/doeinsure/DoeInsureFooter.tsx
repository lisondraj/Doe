import { DOEINSURE_FOOTER, DOEINSURE_NAV_LINKS } from "@/lib/doeinsure/doeinsure-copy";

export function DoeInsureFooter() {
  return (
    <footer className="doeinsure-footer">
      <div className="doeinsure-footer__inner">
        <div className="doeinsure-footer__brand">
          <a className="doeinsure-footer__mark" href="#top">
            {DOEINSURE_FOOTER.mark} <span>{DOEINSURE_FOOTER.markAccent}</span>
          </a>
          <p>{DOEINSURE_FOOTER.blurb}</p>
        </div>

        <nav className="doeinsure-footer__col" aria-label={DOEINSURE_FOOTER.productLabel}>
          <span>{DOEINSURE_FOOTER.productLabel}</span>
          {DOEINSURE_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <nav className="doeinsure-footer__col" aria-label={DOEINSURE_FOOTER.companyLabel}>
          <span>{DOEINSURE_FOOTER.companyLabel}</span>
          <a href={DOEINSURE_FOOTER.homeHref}>{DOEINSURE_FOOTER.home}</a>
          <a href="#request">{DOEINSURE_FOOTER.request}</a>
          <a href={`mailto:${DOEINSURE_FOOTER.email}`}>{DOEINSURE_FOOTER.email}</a>
        </nav>
      </div>

      <div className="doeinsure-footer__base">
        <p>
          {DOEINSURE_FOOTER.legal}
          <i aria-hidden="true" />
          {DOEINSURE_FOOTER.place}
        </p>
        <a href={`mailto:${DOEINSURE_FOOTER.email}`}>{DOEINSURE_FOOTER.email}</a>
      </div>
    </footer>
  );
}
