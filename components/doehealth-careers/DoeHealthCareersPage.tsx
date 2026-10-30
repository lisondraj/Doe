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
  CAREERS_COUNTRIES,
  CAREERS_ROLES,
  CAREERS_TEAM_SECTIONS,
  CAREERS_TEAMS,
  type CareersRole,
} from "@/lib/doehealth/doehealth-careers";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_READING_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { JOBS_CONTACT_EMAIL, JOBS_COPY } from "@/lib/jobs/jobs-copy";
import { JobsConfidential } from "@/components/jobs/JobsConfidential";

const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";

const ALL = "all";

/** The /jobs box under the intro: the role pages' cream, with a wave of its own. */
const JOBS_HERO_WAVE = { top: 0.44, amp: 70, phase: 2.8, scale: 1.05, slant: 0.3 };

const TEAM_SECTIONS: readonly CareersDropdownSection[] = [
  {
    options: [{ value: ALL, label: "All Teams" }, ...CAREERS_TEAMS.map((name) => ({ value: name, label: name }))],
  },
];

const LOCATION_SECTIONS: readonly CareersDropdownSection[] = [
  { options: [{ value: ALL, label: "All Locations" }] },
  {
    heading: "Remote",
    options: CAREERS_COUNTRIES.map((country) => ({ value: country, label: `Remote (${country})` })),
  },
];

/** The teams that have roles in this list, in team order, each with its roles. */
function teamGroups(roles: readonly CareersRole[]) {
  return CAREERS_TEAMS.map((name) => ({ name, roles: roles.filter((role) => role.team === name) })).filter(
    (group) => group.roles.length > 0,
  );
}

/** One team's heading and its rows. */
function RoleGroup({ name, roles, jobs }: { name: string; roles: readonly CareersRole[]; jobs: boolean }) {
  return (
    <div className="doehealth-careers__group">
      <h3 className="doehealth-careers__group-title">{name}</h3>
      <ul className="doehealth-careers__list">
        {roles.map((role) => (
          <CareersRoleRow key={role.slug} role={role} jobs={jobs} />
        ))}
      </ul>
    </div>
  );
}

function OpenRoles({ jobs }: { jobs: boolean }) {
  const [team, setTeam] = useState<string>(ALL);
  const [location, setLocation] = useState<string>(ALL);
  const roles = CAREERS_ROLES.filter(
    (role) =>
      (team === ALL || role.team === team) &&
      (location === ALL || role.countries.some((country) => country === location)),
  );
  const founding = teamGroups(roles.filter((role) => role.section === "founding"));
  const additional = teamGroups(roles.filter((role) => role.section === "additional"));

  return (
    <div className="doehealth-careers__roles" id="roles">
      <h2 className={`doehealth-careers__roles-title ${p22Mackinac.className}`}>{jobs ? JOBS_COPY.rolesTitle : "Open Roles"}</h2>
      {jobs ? <JobsConfidential /> : null}
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

      {founding.length + additional.length > 0 ? (
        <>
          {founding.map((group) => (
            <RoleGroup key={group.name} name={group.name} roles={group.roles} jobs={jobs} />
          ))}
          {additional.length > 0 ? (
            <div className="doehealth-careers__additional">
              {additional.map((group) => (
                <RoleGroup key={group.name} name={group.name} roles={group.roles} jobs={jobs} />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <p className="doehealth-careers__empty">
          Nothing open here yet. Write to{" "}
          <a href={`mailto:${jobs ? JOBS_CONTACT_EMAIL : CAREERS_APPLY_EMAIL}`}>{jobs ? JOBS_CONTACT_EMAIL : CAREERS_APPLY_EMAIL}</a> and
          tell us what you would build.
        </p>
      )}
    </div>
  );
}

/**
 * /careers — the team, a few sections on how it works, and the open roles. Not linked from the nav or footer.
 *
 * `jobs` is /jobs, the same page as an indication of interest: the /earlypreview nav (no page links, "Contact James"),
 * the founding-team intro and one light box under it, no pay figures, and no form (each role page has it).
 */
export function DoeHealthCareersPage({ initialVariant, jobs = false }: { initialVariant: DoeHealthDesk2Variant; jobs?: boolean }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page${jobs ? " doehealth-blog-page--preview" : ""} doehealth-careers-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        jobs ? (
          <DoeHealthDesk2DesktopNavBar logoLink={false} logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} centerLinks={false} primaryCta={EARLYPREVIEW_NAV_CTA} />
        ) : (
          <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
        )
      ) : jobs ? (
        <DoeHealthDesk2PhoneNavBar logoLink={false} logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} primaryCta={EARLYPREVIEW_NAV_CTA} menuMailTo={ABOUT_CONTACT_EMAIL} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label={jobs ? JOBS_COPY.title : "Careers"}>
        <section className={`doehealth-careers ${DOEPHONE_READING_PAGE_INSET_X}`}>
          <header className="doehealth-careers__head">
            <h1 className={`doehealth-careers__title ${p22Mackinac.className}`}>{jobs ? JOBS_COPY.title : "Careers"}</h1>
            {jobs ? (
              <div className="jobs-intro">
                {JOBS_COPY.intro.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ) : null}
          </header>

          {/* /jobs: one light box under the intro, the role pages' cream dot-wave, then the roles. */}
          {jobs ? <DoeHealthBlogPlaceholder tone="cream" wave={JOBS_HERO_WAVE} className="doehealth-careers__hero" pattern /> : null}
          {jobs ? null : (
            <>
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
            </>
          )}

          <OpenRoles jobs={jobs} />
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} markLink={!jobs} />
      </main>
    </div>
  );
}
