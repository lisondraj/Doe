"use client";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  CAREERS_APPLY_EMAIL,
  CAREERS_ROLE_GROUPS,
  CAREERS_TEAM_SECTIONS,
  type CareersRole,
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

function applyHref(role: CareersRole) {
  return `mailto:${CAREERS_APPLY_EMAIL}?subject=${encodeURIComponent(role.title)}`;
}

function RoleRow({ role }: { role: CareersRole }) {
  return (
    <li>
      <a href={applyHref(role)} className="doehealth-careers__role">
        <span className={`doehealth-careers__role-title ${p22Mackinac.className}`}>{role.title}</span>
        <span className="doehealth-careers__role-meta">
          <span>{role.location}</span>
          <span aria-hidden>·</span>
          <span>{role.type}</span>
        </span>
        <svg className="doehealth-careers__role-arrow" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </li>
  );
}

/** /careers — the team, a few sections on how it works, and the open roles. Not linked from the nav or footer. */
export function DoeHealthCareersPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page doehealth-careers-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="Careers">
        <section className={`doehealth-careers ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <header className="doehealth-careers__head">
            <h1 className={`doehealth-careers__title ${p22Mackinac.className}`}>Careers</h1>
          </header>

          <DoeHealthBlogPlaceholder tone="sand" className="doehealth-careers__hero" pattern />

          <div className="doehealth-careers__sections">
            {CAREERS_TEAM_SECTIONS.map((section, index) => (
              <article
                key={section.title}
                className={`doehealth-careers__section${index % 2 === 1 ? " doehealth-careers__section--flip" : ""}`}
              >
                <div className="doehealth-careers__section-copy">
                  <h2 className={`doehealth-careers__section-title ${p22Mackinac.className}`}>{section.title}</h2>
                  <p className="doehealth-careers__section-body">{section.body}</p>
                </div>
                <DoeHealthBlogPlaceholder
                  tone={section.tone}
                  className="doehealth-careers__section-art"
                  pattern
                  wave={section.wave}
                />
              </article>
            ))}
          </div>

          <div className="doehealth-careers__roles" id="roles">
            <h2 className={`doehealth-careers__roles-title ${p22Mackinac.className}`}>Open roles</h2>
            {CAREERS_ROLE_GROUPS.map((group) => (
              <div key={group.team} className="doehealth-careers__group">
                <h3 className="doehealth-careers__group-title">{group.team}</h3>
                <ul className="doehealth-careers__list">
                  {group.roles.map((role) => (
                    <RoleRow key={role.title} role={role} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
