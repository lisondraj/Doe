import { DOEINSURE_FOOTER, DOEINSURE_NAV, DOEINSURE_NAV_LINKS } from "@/lib/doeinsure/doeinsure-copy";

export function DoeInsureFooter() {
  return (
    <footer className="doeinsure-footer">
      <div className="doeinsure-wrap doeinsure-footer__inner">
        <div className="doeinsure-footer__brand">
          <a className="doeinsure-footer__mark" href="#top">
            <span className="doeinsure-footer__mark-line">{DOEINSURE_NAV.mark}</span>
            <span className="doeinsure-footer__mark-line">{DOEINSURE_NAV.markAccent}</span>
          </a>
          <p className="doeinsure-footer__blurb">{DOEINSURE_FOOTER.blurb}</p>
        </div>

        <div className="doeinsure-footer__columns">
          <nav className="doeinsure-footer__nav" aria-label={DOEINSURE_FOOTER.productLabel}>
            <span className="doeinsure-footer__label">{DOEINSURE_FOOTER.productLabel}</span>
            {DOEINSURE_NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="/">Doe</a>
          </nav>

          {DOEINSURE_FOOTER.columns.map((column) => (
            <nav key={column.title} className="doeinsure-footer__nav" aria-label={column.title}>
              <span className="doeinsure-footer__label">{column.title}</span>
              {column.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="doeinsure-footer__cta">
          <a className="doeinsure-footer__quote" href="#request">
            {DOEINSURE_NAV.cta}
          </a>
          <a className="doeinsure-footer__coverage" href="#request">
            {DOEINSURE_FOOTER.coverageCta}
          </a>
          <a className="doeinsure-footer__mail" href={`mailto:${DOEINSURE_FOOTER.email}`}>
            {DOEINSURE_FOOTER.email}
          </a>
        </div>
      </div>

      <div className="doeinsure-footer__bar">
        <div className="doeinsure-wrap doeinsure-footer__legal">
          <p>{DOEINSURE_FOOTER.legal}</p>
        </div>
      </div>
    </footer>
  );
}
