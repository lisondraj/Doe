"use client";

import { useState } from "react";

import { CareersFilterDropdown, type CareersDropdownSection } from "@/components/doehealth-careers/CareersFilterDropdown";
import { CareersRoleRow } from "@/components/doehealth-careers/CareersRoleRow";
import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  CAREERS_APPLY_EMAIL,
  CAREERS_LOCATIONS,
  CAREERS_ROLES,
  CAREERS_TEAM_SECTIONS,
  CAREERS_TEAMS,
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

const ALL = "all";

const TEAM_SECTIONS: readonly CareersDropdownSection[] = [
  {
    options: [{ value: ALL, label: "All Teams" }, ...CAREERS_TEAMS.map((name) => ({ value: name, label: name }))],
  },
];

const LOCATION_SECTIONS: readonly CareersDropdownSection[] = [
  { options: [{ value: ALL, label: "All Locations" }] },
  {
    heading: "Remote",
    options: CAREERS_LOCATIONS.map((name) => ({ value: name, label: name })),
  },
];

function OpenRoles() {
  const [team, setTeam] = useState<string>(ALL);
  const [location, setLocation] = useState<string>(ALL);
  const roles = CAREERS_ROLES.filter(
    (role) => (team === ALL || role.team === team) && (location === ALL || role.location === location),
  );
  const groups = CAREERS_TEAMS.map((name) => ({ name, roles: roles.filter((role) => role.team === name) })).filter(
    (group) => group.roles.length > 0,
  );

  return (
    <div className="doehealth-careers__roles" id="roles">
      <h2 className={`doehealth-careers__roles-title ${p22Mackinac.className}`}>Open Roles</h2>

      <div className="doehealth-careers__bar">
        <div className="doehealth-careers__filter">
          <CareersFilterDropdown label="Team" value={team} sections={TEAM_SECTIONS} onChange={setTeam} />
        </div>
        <div className="doehealth-careers__filter">
          <CareersFilterDropdown label="Location" value={location} sections={LOCATION_SECTIONS} onChange={setLocation} />
        </div>
        <span className="doehealth-careers__count">
          {roles.length} {roles.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.name} className="doehealth-careers__group">
            <h3 className="doehealth-careers__group-title">{group.name}</h3>
            <ul className="doehealth-careers__list">
              {group.roles.map((role) => (
                <CareersRoleRow key={role.slug} role={role} />
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="doehealth-careers__empty">
          Nothing open here yet. Write to{" "}
          <a href={`mailto:${CAREERS_APPLY_EMAIL}`}>{CAREERS_APPLY_EMAIL}</a> and tell us what you would build.
        </p>
      )}
    </div>
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

          <DoeHealthBlogPlaceholder tone="clay" className="doehealth-careers__hero" pattern />

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

          <OpenRoles />
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
