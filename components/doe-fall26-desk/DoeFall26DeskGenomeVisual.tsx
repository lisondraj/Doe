import { dmSans, inter } from "@/lib/home/fonts";

/** Blueprint strip — compose, live agents, and the next version. */
export function DoeFall26DeskGenomeVisual() {
  return (
    <div className={`fall26-genome-visual ${inter.className}`} aria-hidden>
      <div className="fall26-genome-visual__panel">
        <span className="fall26-genome-visual__kicker">Compose</span>
        <div className="fall26-genome-visual__graph">
          <svg className="fall26-genome-visual__wires" viewBox="0 0 200 88" preserveAspectRatio="none">
            <path d="M36 44 H88 M88 44 V22 M88 44 V66 M88 22 H140 M88 66 H140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="fall26-genome-visual__node fall26-genome-visual__node--a" />
          <span className="fall26-genome-visual__node fall26-genome-visual__node--b" />
          <span className="fall26-genome-visual__node fall26-genome-visual__node--c" />
        </div>
        <span className={`fall26-genome-visual__meta ${dmSans.className}`}>Clinic workflows</span>
      </div>

      <div className="fall26-genome-visual__arrow" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="fall26-genome-visual__panel fall26-genome-visual__panel--live">
        <span className="fall26-genome-visual__kicker">Live</span>
        <div className="fall26-genome-visual__agents">
          <span className="fall26-genome-visual__agent">
            <i className="fall26-genome-visual__pulse" />
            Front Desk
          </span>
          <span className="fall26-genome-visual__agent">Prior Auth</span>
          <span className="fall26-genome-visual__agent">Referral</span>
        </div>
        <span className={`fall26-genome-visual__meta ${dmSans.className}`}>On your Genome</span>
      </div>

      <div className="fall26-genome-visual__arrow" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="fall26-genome-visual__panel fall26-genome-visual__panel--train">
        <span className="fall26-genome-visual__kicker">Next</span>
        <div className={`fall26-genome-visual__versions ${dmSans.className}`}>
          <span>v1.0</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="fall26-genome-visual__version-next">v1.1</span>
        </div>
        <span className="fall26-genome-visual__train">1,284 tasks · Sunday close</span>
      </div>
    </div>
  );
}
