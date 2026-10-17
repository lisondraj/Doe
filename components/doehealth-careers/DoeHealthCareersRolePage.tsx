"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { CareersMetaItem, CareersRoleRow } from "@/components/doehealth-careers/CareersRoleRow";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  CAREERS_ABOUT_DOE,
  CAREERS_APPLY_EMAIL,
  CAREERS_OFFER,
  CAREERS_PATH,
  type CareersRole,
  careersOtherRoles,
} from "@/lib/doehealth/doehealth-careers";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";
const APPLY_ID = "apply";

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

/**
 * The application: name, email, a link, and a note. Sending opens the applicant's email app with everything written
 * out and addressed to the founders, so they can attach a resume before it goes.
 */
function ApplyForm({ role }: { role: CareersRole }) {
  const [opened, setOpened] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const body = [
      `Role: ${role.title} (${role.location})`,
      `Name: ${field("name")}`,
      `Email: ${field("email")}`,
      field("link") ? `Link: ${field("link")}` : null,
      "",
      field("note"),
      "",
      "(Resume attached)",
    ]
      .filter((line) => line !== null)
      .join("\n");
    const subject = `Application: ${role.title}`;
    window.location.href = `mailto:${CAREERS_APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form className="doehealth-role__form" onSubmit={submit}>
      <div className="doehealth-role__form-row">
        <label className="doehealth-role__field">
          <span>Full name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="doehealth-role__field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="doehealth-role__field">
        <span>LinkedIn, GitHub, or portfolio</span>
        <input name="link" type="text" inputMode="url" placeholder="Optional" />
      </label>
      <label className="doehealth-role__field">
        <span>What would you build at Doe?</span>
        <textarea name="note" rows={5} placeholder="A few lines is plenty." />
      </label>
      <div className="doehealth-role__form-foot">
        <button type="submit" className="doehealth-role__cta">
          Send application
        </button>
        <p className="doehealth-role__form-note" aria-live="polite">
          {opened ? (
            <>
              Your email app should now be open with your application. If it isn&apos;t, write to{" "}
              <a href={`mailto:${CAREERS_APPLY_EMAIL}`}>{CAREERS_APPLY_EMAIL}</a>.
            </>
          ) : (
            <>This opens your email app with your application written out. Attach your resume, then send.</>
          )}
        </p>
      </div>
    </form>
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

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page doehealth-careers-page doehealth-role-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label={role.title}>
        <article className={`doehealth-role ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <header className="doehealth-role__head">
            <Link href={`${CAREERS_PATH}#roles`} className="doehealth-role__back">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All open roles
            </Link>
            <p className="doehealth-role__team">{role.team}</p>
            <h1 className={`doehealth-role__title ${p22Mackinac.className}`}>{role.title}</h1>
            <p className="doehealth-role__meta">
              <span>{role.location}</span>
              <CareersMetaItem>Full time</CareersMetaItem>
              <CareersMetaItem>{role.pay}</CareersMetaItem>
            </p>
            <a href={`#${APPLY_ID}`} className="doehealth-role__cta">
              Start your application
            </a>
          </header>

          <p className="sr-only">{role.summary}</p>
          <DoeHealthBlogPlaceholder tone={role.tone} wave={role.wave} className="doehealth-role__hero" pattern>
            <p className={`doehealth-role__summary ${p22Mackinac.className}`}>{role.summary}</p>
          </DoeHealthBlogPlaceholder>

          <div className="doehealth-role__layout">
            <aside className="doehealth-role__glance" aria-label="At a glance">
              <h2 className={`doehealth-role__glance-title ${p22Mackinac.className}`}>At a glance</h2>
              <dl className="doehealth-role__facts">
                <div>
                  <dt>Team</dt>
                  <dd>{role.team}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{role.location}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>Full time</dd>
                </div>
                <div>
                  <dt>Pay</dt>
                  <dd>{role.pay}</dd>
                </div>
                {role.equity ? (
                  <div>
                    <dt>Equity</dt>
                    <dd>Offered</dd>
                  </div>
                ) : null}
              </dl>
              <a href={`#${APPLY_ID}`} className="doehealth-role__cta doehealth-role__cta--block">
                Start your application
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
              <RoleSection title="The role">
                {role.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </RoleSection>
              <RoleSection title="What you'll do">
                <RoleList items={role.responsibilities} />
              </RoleSection>
              <RoleSection title="What you'll bring">
                <RoleList items={role.qualifications} />
              </RoleSection>
              <RoleSection title="Nice to have">
                <RoleList items={role.bonus} />
              </RoleSection>
              <RoleSection title="What we offer">
                <ul className="doehealth-role__offer">
                  {CAREERS_OFFER.map((item) => (
                    <li key={item.lead}>
                      <strong>{item.lead}</strong>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </RoleSection>
            </div>
          </div>

          <section id={APPLY_ID} className="doehealth-role__apply" aria-labelledby="doehealth-role-apply-title">
            <div className="doehealth-role__apply-head">
              <p className="doehealth-role__team">{role.title}</p>
              <h2 id="doehealth-role-apply-title" className={`doehealth-role__apply-title ${p22Mackinac.className}`}>
                Start your application
              </h2>
              <p className="doehealth-role__apply-lede">
                Tell us who you are and what you would build. Your application goes straight to the founders.
              </p>
            </div>
            <ApplyForm role={role} />
          </section>

          {others.length > 0 ? (
            <section className="doehealth-role__more" aria-labelledby="doehealth-role-more-title">
              <h2 id="doehealth-role-more-title" className={`doehealth-role__more-title ${p22Mackinac.className}`}>
                More open roles
              </h2>
              <ul className="doehealth-careers__list">
                {others.map((other) => (
                  <CareersRoleRow key={other.slug} role={other} />
                ))}
              </ul>
              <Link href={`${CAREERS_PATH}#roles`} className="doehealth-role__more-link">
                See all open roles
              </Link>
            </section>
          ) : null}
        </article>

        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
