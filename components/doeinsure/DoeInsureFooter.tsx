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

        <nav className="doeinsure-footer__nav" aria-label="Footer">
          <span className="doeinsure-footer__label">Product</span>
          {DOEINSURE_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="/">Doe</a>
        </nav>

        <div className="doeinsure-footer__cta">
          <span className="doeinsure-footer__label">Get coverage</span>
          <a className="doeinsure-footer__quote" href="#request">
            {DOEINSURE_NAV.cta}
          </a>
          <a className="doeinsure-footer__mail" href={`mailto:${DOEINSURE_FOOTER.email}`}>
            {DOEINSURE_FOOTER.email}
          </a>
        </div>
      </div>

      <div className="doeinsure-footer__bar">
        <div className="doeinsure-wrap doeinsure-footer__legal">
          <p>{DOEINSURE_FOOTER.legal}</p>
          <p>{DOEINSURE_FOOTER.wordmark}</p>
        </div>
      </div>
    </footer>
  );
}
