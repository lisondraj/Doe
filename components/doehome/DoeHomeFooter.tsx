import { DOEHOME_FOOTER, DOEHOME_NAV, DOEHOME_NAV_LINKS } from "@/lib/doehome/doehome-copy";

export function DoeHomeFooter() {
  return (
    <footer className="doeinsure-footer">
      <div className="doeinsure-wrap doeinsure-footer__inner">
        <div className="doeinsure-footer__brand">
          <a className="doeinsure-footer__mark" href="#top">
            <span className="doeinsure-footer__mark-line">{DOEHOME_NAV.mark}</span>
          </a>
          <p className="doeinsure-footer__blurb">{DOEHOME_FOOTER.blurb}</p>
        </div>

        <div className="doeinsure-footer__columns">
          <nav className="doeinsure-footer__nav" aria-label={DOEHOME_FOOTER.productLabel}>
            <span className="doeinsure-footer__label">{DOEHOME_FOOTER.productLabel}</span>
            {DOEHOME_NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          {DOEHOME_FOOTER.columns.map((column) => (
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
            {DOEHOME_NAV.cta}
          </a>
          <a className="doeinsure-footer__coverage" href="#request">
            {DOEHOME_FOOTER.coverageCta}
          </a>
          <a className="doeinsure-footer__mail" href={`mailto:${DOEHOME_FOOTER.email}`}>
            {DOEHOME_FOOTER.email}
          </a>
        </div>
      </div>

      <div className="doeinsure-footer__bar">
        <div className="doeinsure-wrap doeinsure-footer__legal">
          <p>{DOEHOME_FOOTER.legal}</p>
        </div>
      </div>
    </footer>
  );
}
