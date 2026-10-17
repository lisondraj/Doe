"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";

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
  careersLocation,
  careersOtherRoles,
} from "@/lib/doehealth/doehealth-careers";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora, p22Mackinac } from "@/lib/home/fonts";

const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";
const APPLY_ID = "apply";

function careersApplyHref(role: CareersRole) {
  const subject = `Application: ${role.title}`;
  const body = [
    `Role: ${role.title} (${careersLocation(role)})`,
    "",
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

const BENEFITS_WAVE = { top: 0.72, amp: 46, phase: 2.0, scale: 1.1, slant: 0.2 };

/**
 * Doe One: a gold band with the name first, then the claim. The package sits in two paired columns so the category
 * rows line up; figures sit in a right column, statuses stay quiet.
 */
function Benefits() {
  const rows = [
    CAREERS_BENEFIT_GROUPS.slice(0, 2),
    CAREERS_BENEFIT_GROUPS.slice(2),
  ];

  return (
    <section className="doehealth-role__section doehealth-role__benefits" aria-labelledby="doehealth-role-benefits-title">
      <div className="doehealth-role__benefits-hero">
        <DoeHealthBlogPlaceholder tone="gold" wave={BENEFITS_WAVE} className="doehealth-role__benefits-art" pattern />
        <div className="doehealth-role__benefits-hero-copy">
          <h2 id="doehealth-role-benefits-title" className={`doehealth-role__benefits-name ${lora.className}`}>
            {CAREERS_BENEFITS_NAME}
          </h2>
          <p className={`doehealth-role__benefits-claim ${p22Mackinac.className}`}>{CAREERS_BENEFITS_CLAIM}</p>
        </div>
      </div>
      <div className="doehealth-role__benefits-groups">
        {rows.map((pair) => (
          <div key={pair.map((group) => group.title).join("-")} className="doehealth-role__benefits-row">
            {pair.map((group) => (
              <div key={group.title} className="doehealth-role__benefits-group">
                <h3 className="doehealth-role__benefits-group-title">{group.title}</h3>
                <ul className="doehealth-role__benefits-list">
                  {group.items.map((item) => (
                    <li key={item.name} className="doehealth-role__benefit">
                      <span className="doehealth-role__benefit-name">{item.name}</span>
                      {item.figure ? (
                        <span className="doehealth-role__benefit-figure">
                          <strong>{item.figure}</strong>
                          {item.unit ? <span>{item.unit}</span> : null}
                        </span>
                      ) : (
                        <span className="doehealth-role__benefit-status">{item.status}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The invite at the foot of the article: one panel and one way in. The button opens the applicant's email app with the
 * role written out and addressed to the founders, so they can attach a resume before it goes.
 */
function ApplyInvite({ role }: { role: CareersRole }) {
  const href = careersApplyHref(role);

  return (
    <section id={APPLY_ID} className="doehealth-role__invite" aria-labelledby="doehealth-role-invite-title">
      <h2 id="doehealth-role-invite-title" className={`doehealth-role__invite-title ${p22Mackinac.className}`}>
        <span>Start your</span>
        <span>application.</span>
      </h2>
      <p className="doehealth-role__invite-lede">
        Tell us who you are and what you would build. Your application goes straight to the founders.
      </p>
      <a href={href} className="doehealth-role__invite-button">
        Email Your Application
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <p className="doehealth-role__invite-note">Opens your email app, addressed to the founders.</p>
    </section>
  );
}

/**
 * After the hero "Start Your Application" scrolls past, a left-aligned box sits under the nav with the same facts and
 * a way back to apply. It hides again when the invite at the foot of the article comes into view.
 */
function RoleDock({
  role,
  visible,
}: {
  role: CareersRole;
  visible: boolean;
}) {
  return (
    <div className={`doehealth-role__dock${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div className={`doehealth-role__dock-box ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <div className="doehealth-role__dock-copy">
          <p className="doehealth-role__dock-team">{role.team}</p>
          <p className={`doehealth-role__dock-title ${p22Mackinac.className}`}>{role.title}</p>
          <p className="doehealth-role__dock-meta">
            <span>{careersLocation(role)}</span>
            <CareersMetaItem>Full Time</CareersMetaItem>
            {role.pay ? <CareersMetaItem>{role.pay}</CareersMetaItem> : null}
          </p>
        </div>
        <a href={`#${APPLY_ID}`} className="doehealth-role__dock-cta">
          Start Your Application
        </a>
      </div>
    </div>
  );
}

/** /careers/[slug]: one open role, its details, and the application. */
export function DoeHealthCareersRolePage({
  role,
  initialVariant,
}: {
  role: CareersRole;
  initialVariant: DoeHealthDesk2Variant;
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
      data-role-dock={docked ? "on" : "off"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <RoleDock role={role} visible={docked} />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label={role.title}>
        <article className={`doehealth-role ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <header className="doehealth-role__head">
            <Link href={`${CAREERS_PATH}#roles`} className="doehealth-role__back">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Open Roles
            </Link>
            <p className="doehealth-role__team">{role.team}</p>
            <h1 className={`doehealth-role__title ${p22Mackinac.className}`}>{role.title}</h1>
            <p className="doehealth-role__meta">
              <span>{careersLocation(role)}</span>
              <CareersMetaItem>Full Time</CareersMetaItem>
              {role.pay ? <CareersMetaItem>{role.pay}</CareersMetaItem> : null}
            </p>
            <a ref={ctaRef} href={`#${APPLY_ID}`} className="doehealth-role__cta">
              Start Your Application
            </a>
          </header>

          <p className="sr-only">{role.summary}</p>
          <DoeHealthBlogPlaceholder tone="cream" wave={role.wave} className="doehealth-role__hero" pattern />

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
                  <dd>Full Time</dd>
                </div>
                {role.pay ? (
                  <div>
                    <dt>Pay</dt>
                    <dd>{role.pay}</dd>
                  </div>
                ) : null}
                {role.equity ? (
                  <div>
                    <dt>Equity</dt>
                    <dd>{role.equity}</dd>
                  </div>
                ) : null}
              </dl>
              <a href={`#${APPLY_ID}`} className="doehealth-role__cta doehealth-role__cta--block">
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
              <RoleSection title="What You'll Do">
                <RoleList items={role.responsibilities} />
              </RoleSection>
              <RoleSection title="What You'll Bring">
                <RoleList items={role.qualifications} />
              </RoleSection>
              <RoleSection title="Nice to Have">
                <RoleList items={role.bonus} />
              </RoleSection>
              <Benefits />
            </div>
          </div>

          {others.length > 0 ? (
            <section className="doehealth-role__more" aria-labelledby="doehealth-role-more-title">
              <h2 id="doehealth-role-more-title" className={`doehealth-role__more-title ${p22Mackinac.className}`}>
                More Open Roles
              </h2>
              <ul className="doehealth-careers__list">
                {others.map((other) => (
                  <CareersRoleRow key={other.slug} role={other} />
                ))}
              </ul>
              <Link href={`${CAREERS_PATH}#roles`} className="doehealth-role__more-link">
                See All Open Roles
              </Link>
            </section>
          ) : null}

          <div ref={inviteRef}>
            <ApplyInvite role={role} />
          </div>
        </article>

        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
