"use client";

import Link from "next/link";
import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { CareersMetaItem, CareersRoleRow } from "@/components/doehealth-careers/CareersRoleRow";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  CAREERS_ABOUT_DOE,
  CAREERS_APPLY_EMAIL,
  CAREERS_BENEFIT_GROUPS,
  CAREERS_BENEFITS_CLAIM,
  CAREERS_BENEFITS_NAME,
  CAREERS_PATH,
  type CareersRole,
  type CareersStudentTerm,
  careersLocation,
  careersOtherRoles,
  careersType,
} from "@/lib/doehealth/doehealth-careers";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_READING_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora, p22Mackinac } from "@/lib/home/fonts";
import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { JOBS_ANY_ROLE, JOBS_COPY, JOBS_FORM_ID, JOBS_PATH, JOBS_PAY_NOTE, jobsPayLabel, jobsRolePath } from "@/lib/jobs/jobs-copy";
import { JobsApplicationForm } from "@/components/jobs/JobsApplicationForm";

const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";
const APPLY_ID = "apply";

function careersApplyHref(role: CareersRole) {
  const subject = `Application: ${role.title}`;
  const student = role.student
    ? ["School and program:", `Work term I'll be on in ${role.student.season} (e.g. 3rd co-op):`, ""]
    : [];
  const body = [
    `Role: ${role.title} (${careersLocation(role)})`,
    "",
    ...student,
    "Hi, I'd like to apply. A little about me, and what I would build at Doe:",
    "",
    "(Attach your resume before you send.)",
  ].join("\n");
  return `mailto:${CAREERS_APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function RoleSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="doehealth-role__section">
      <h2 className={`doehealth-role__section-title ${p22Mackinac.className}`}>{title}</h2>
      {children}
    </section>
  );
}

function RoleList({ items }: { items: readonly string[] }) {
  return (
    <ul className="doehealth-role__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** A student role's hero: the gold dot-wave, in place of the empty cream box. */
const STUDENT_HERO_COLORS = { bg: "#FCE8C8", dot: "#EBC285" };

/** Pay by work term: one step per band, each a little taller than the last, with the hourly rate in Lora. */
function TermLadder({ term }: { term: CareersStudentTerm }) {
  return (
    <RoleSection title="Pay by Work Term">
      <ol className="doehealth-role__ladder">
        {term.bands.map((band, index) => (
          <li
            key={band.level}
            className="doehealth-role__ladder-step"
            style={{ "--doehealth-role-step": index } as CSSProperties}
          >
            <span className="doehealth-role__ladder-level">{band.level}</span>
            <span className="doehealth-role__ladder-terms">{band.terms}</span>
            <span className={`doehealth-role__ladder-rate ${lora.className}`}>{band.rate}</span>
          </li>
        ))}
      </ol>
      <p className="doehealth-role__ladder-note">{term.bandsNote}</p>
    </RoleSection>
  );
}

const BENEFITS_WAVE = { top: 0.72, amp: 46, phase: 2.0, scale: 1.1, slant: 0.2 };
/** Doe One's band: the lighter gold from the /news boxes, so it matches the blog. */
const BENEFITS_COLORS = { bg: "#FBF0D9", dot: "#E0AB62" };

/**
 * Doe One: a bright gold band with the name in Lora and the claim, then the package as four category cards, two across.
 * Each card writes its benefits out as rows, with the figure in Lora at the end.
 */
function Benefits() {
  return (
    <section className="doehealth-role__section doehealth-role__benefits" aria-labelledby="doehealth-role-benefits-title">
      <div className="doehealth-role__benefits-hero">
        <DoeHealthBlogPlaceholder
          tone="gold"
          colors={BENEFITS_COLORS}
          wave={BENEFITS_WAVE}
          className="doehealth-role__benefits-art"
          pattern
        />
        <div className="doehealth-role__benefits-hero-copy">
          <p className={`doehealth-role__benefits-name ${lora.className}`}>{CAREERS_BENEFITS_NAME}</p>
          <h2 id="doehealth-role-benefits-title" className={`doehealth-role__benefits-claim ${p22Mackinac.className}`}>
            {CAREERS_BENEFITS_CLAIM}
          </h2>
        </div>
      </div>
      <div className="doehealth-role__benefits-groups">
        {CAREERS_BENEFIT_GROUPS.map((group) => (
          <div key={group.title} className="doehealth-role__benefits-group">
            <h3 className={`doehealth-role__benefits-group-title ${p22Mackinac.className}`}>{group.title}</h3>
            <ul className="doehealth-role__benefits-list">
              {group.items.map((benefit) => (
                <li key={benefit.name} className="doehealth-role__benefit">
                  <span className="doehealth-role__benefit-name">{benefit.name}</span>
                  <span className={`doehealth-role__benefit-figure ${lora.className}`}>{benefit.figure}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The panel at the foot of the article: a hiring list, not the application. Work email only — no extra copy.
 */
function HiringList() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email) return;
    const subject = "Hiring list";
    const body = `Work email: ${email}\n\nI'd like updates on future roles at Doe.`;
    window.location.href = `mailto:${CAREERS_APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id={APPLY_ID} className="doehealth-role__invite" aria-labelledby="doehealth-role-invite-title">
      <h2 id="doehealth-role-invite-title" className={`doehealth-role__invite-title ${p22Mackinac.className}`}>
        <span>Not ready to apply?</span>
        <span>Subscribe to our future hiring emailing list for job updates &amp; opportunities.</span>
      </h2>
      <form className="doehealth-role__invite-form" onSubmit={onSubmit}>
        <label className="doehealth-role__invite-email">
          <span className="sr-only">Work email</span>
          <input type="email" name="email" placeholder="Work email" autoComplete="email" required />
          <button type="submit" aria-label="Subscribe">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </label>
      </form>
    </section>
  );
}

/** Splits a title into two lines at the word break closest to the middle, so every title sets on exactly two lines. */
function splitTitleTwoLines(title: string): [string, string] {
  const words = title.split(" ");
  if (words.length < 2) return [title, ""];
  let split = 1;
  let smallestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const gap = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (gap < smallestGap) {
      smallestGap = gap;
      split = i;
    }
  }
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

/**
 * After the hero "Start Your Application" scrolls past, a left-aligned box sits under the nav with the same facts and
 * a way back to apply. It hides again when the invite at the foot of the article comes into view.
 */
function RoleDock({
  role,
  visible,
  jobs,
}: {
  role: CareersRole;
  visible: boolean;
  jobs: boolean;
}) {
  const [titleFirst, titleSecond] = splitTitleTwoLines(role.title);
  const innerRef = useRef<HTMLDivElement>(null);

  // The row's real height feeds the page clearance, so the sticky card and jump targets clear the bar as it opens.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return undefined;
    const root = document.documentElement;
    const sync = () => root.style.setProperty("--doehealth-role-dock-h", `${inner.getBoundingClientRect().height}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(inner);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--doehealth-role-dock-h");
    };
  }, []);

  return (
    <div className={`doehealth-role__dock${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div ref={innerRef} className="doehealth-role__dock-inner">
        <div className={`doehealth-role__dock-box ${DOEPHONE_READING_PAGE_INSET_X}`}>
          <div className="doehealth-role__dock-copy">
            <Link href={`${jobs ? JOBS_PATH : CAREERS_PATH}#roles`} className="doehealth-role__back doehealth-role__dock-back">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {jobs ? JOBS_COPY.backLabel : "All Open Roles"}
            </Link>
            <p className={`doehealth-role__dock-title ${p22Mackinac.className}`}>
              <span>{titleFirst}</span>
              <span>{titleSecond}</span>
            </p>
            <p className="doehealth-role__dock-meta">
              <span>{careersLocation(role)}</span>
              <CareersMetaItem>{careersType(role)}</CareersMetaItem>
              {jobs ? (
                <CareersMetaItem>{jobsPayLabel(role)}</CareersMetaItem>
              ) : role.pay ? (
                <CareersMetaItem>{role.pay}</CareersMetaItem>
              ) : null}
            </p>
          </div>
          <a href={jobs ? `#${JOBS_FORM_ID}` : careersApplyHref(role)} className="doehealth-role__dock-link">
            Start Your Application
            <svg viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * /careers/[slug]: one open role, its details, and the application.
 *
 * `jobs` is /jobs/[slug], the same role as an indication of interest: the /earlypreview nav, no pay figures ("$$$ +
 * Equity", discussed at interview), and "Start Your Application" at the foot in place of the hiring list.
 */
export function DoeHealthCareersRolePage({
  role,
  initialVariant,
  jobs = false,
}: {
  role: CareersRole;
  initialVariant: DoeHealthDesk2Variant;
  jobs?: boolean;
}) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  const others = careersOtherRoles(role);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const cta = ctaRef.current;
    const invite = inviteRef.current;
    if (!cta || !invite) return;

    let pastCta = false;
    let inviteInView = false;
    const sync = () => setDocked(pastCta && !inviteInView);

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        pastCta = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sync();
      },
      { threshold: 0 },
    );
    const inviteObserver = new IntersectionObserver(
      ([entry]) => {
        inviteInView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );
    ctaObserver.observe(cta);
    inviteObserver.observe(invite);
    return () => {
      ctaObserver.disconnect();
      inviteObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page doehealth-careers-page doehealth-role-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          belowBar={<RoleDock role={role} visible={docked} jobs={jobs} />}
          {...(jobs ? { logoLink: false, centerLinks: false, primaryCta: EARLYPREVIEW_NAV_CTA } : {})}
        />
      ) : (
        <DoeHealthDesk2PhoneNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          belowBar={<RoleDock role={role} visible={docked} jobs={jobs} />}
          {...(jobs ? { logoLink: false, primaryCta: EARLYPREVIEW_NAV_CTA, menuMailTo: ABOUT_CONTACT_EMAIL } : {})}
        />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label={role.title}>
        <article className={`doehealth-role ${DOEPHONE_READING_PAGE_INSET_X}`}>
          <header className="doehealth-role__head">
            <Link href={`${jobs ? JOBS_PATH : CAREERS_PATH}#roles`} className="doehealth-role__back">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {jobs ? JOBS_COPY.backLabel : "All Open Roles"}
            </Link>
            <p className="doehealth-role__team">{role.team}</p>
            <h1 className={`doehealth-role__title ${p22Mackinac.className}`}>{role.title}</h1>
            <p className="doehealth-role__meta">
              <span>{careersLocation(role)}</span>
              <CareersMetaItem>{careersType(role)}</CareersMetaItem>
              {jobs ? (
                <CareersMetaItem>{jobsPayLabel(role)}</CareersMetaItem>
              ) : role.pay ? (
                <CareersMetaItem>{role.pay}</CareersMetaItem>
              ) : null}
            </p>
            {jobs ? <p className="jobs-role-note">{JOBS_COPY.roleNote}</p> : null}
            <a ref={ctaRef} href={jobs ? `#${JOBS_FORM_ID}` : careersApplyHref(role)} className="doehealth-role__cta">
              Start Your Application
            </a>
          </header>

          <p className="sr-only">{role.summary}</p>
          {role.student ? (
            <DoeHealthBlogPlaceholder
              tone="gold"
              colors={STUDENT_HERO_COLORS}
              wave={role.wave}
              className="doehealth-role__hero"
              pattern
            />
          ) : (
            <DoeHealthBlogPlaceholder tone="cream" wave={role.wave} className="doehealth-role__hero" pattern />
          )}

          <div className="doehealth-role__layout">
            <aside className="doehealth-role__glance" aria-label="At a Glance">
              <h2 className={`doehealth-role__glance-title ${p22Mackinac.className}`}>At a Glance</h2>
              <dl className="doehealth-role__facts">
                <div>
                  <dt>Team</dt>
                  <dd>{role.team}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{careersLocation(role)}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{careersType(role)}</dd>
                </div>
                {role.student ? (
                  <>
                    <div>
                      <dt>Term</dt>
                      <dd>{role.student.season}</dd>
                    </div>
                    <div>
                      <dt>Dates</dt>
                      <dd>{role.student.dates}</dd>
                    </div>
                  </>
                ) : null}
                {jobs ? (
                  <div>
                    <dt>Pay</dt>
                    <dd>
                      {jobsPayLabel(role)} ({JOBS_PAY_NOTE.toLowerCase()})
                    </dd>
                  </div>
                ) : null}
                {!jobs && role.pay ? (
                  <div>
                    <dt>Pay</dt>
                    <dd>{role.pay}</dd>
                  </div>
                ) : null}
                {!jobs && role.equity ? (
                  <div>
                    <dt>Equity</dt>
                    <dd>{role.equity}</dd>
                  </div>
                ) : null}
              </dl>
              <a href={jobs ? `#${JOBS_FORM_ID}` : careersApplyHref(role)} className="doehealth-role__cta doehealth-role__cta--block">
                Start Your Application
              </a>
              <p className="doehealth-role__glance-note">
                Questions? <a href={`mailto:${CAREERS_APPLY_EMAIL}`}>{CAREERS_APPLY_EMAIL}</a>
              </p>
            </aside>

            <div className="doehealth-role__body">
              <RoleSection title="About Doe">
                {CAREERS_ABOUT_DOE.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </RoleSection>
              <RoleSection title="The Role">
                {role.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </RoleSection>
              {role.student && !jobs ? <TermLadder term={role.student} /> : null}
              <RoleSection title="What You'll Do">
                <RoleList items={role.responsibilities} />
              </RoleSection>
              <RoleSection title="What You'll Bring">
                <RoleList items={role.qualifications} />
              </RoleSection>
              <RoleSection title="Nice to Have">
                <RoleList items={role.bonus} />
              </RoleSection>
              {role.student ? null : <Benefits />}
            </div>
          </div>

          {others.length > 0 ? (
            <section className="doehealth-role__more" aria-labelledby="doehealth-role-more-title">
              <h2 id="doehealth-role-more-title" className={`doehealth-role__more-title ${p22Mackinac.className}`}>
                {jobs ? JOBS_COPY.moreTitle : "More Open Roles"}
              </h2>
              <ul className="doehealth-careers__list">
                {others.map((other) => (
                  <CareersRoleRow key={other.slug} role={other} jobs={jobs} />
                ))}
              </ul>
              <Link href={`${jobs ? JOBS_PATH : CAREERS_PATH}#roles`} className="doehealth-role__more-link">
                {jobs ? JOBS_COPY.moreLink : "See All Open Roles"}
              </Link>
            </section>
          ) : null}

          <div ref={inviteRef}>
            {jobs ? (
              <JobsApplicationForm
                roleSlug={role.slug === "expression-of-interest" ? JOBS_ANY_ROLE.slug : role.slug}
                sourcePath={jobsRolePath(role)}
              />
            ) : (
              <HiringList />
            )}
          </div>
        </article>

        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} markLink={!jobs} />
      </main>
    </div>
  );
}
