import Link from "next/link";
import type { ReactNode } from "react";

import {
  type CareersRole,
  careersEquityLabel,
  careersLocation,
  careersRolePath,
  careersType,
} from "@/lib/doehealth/doehealth-careers";
import { p22Mackinac } from "@/lib/home/fonts";
import { jobsPayLabel, jobsRolePath } from "@/lib/jobs/jobs-copy";

/** A dot and the item after it wrap together, so a line never ends on a dot. */
export function CareersMetaItem({ children }: { children: ReactNode }) {
  return (
    <span className="doehealth-careers__meta-item">
      <span className="doehealth-careers__dot" aria-hidden>
        •
      </span>
      {children}
    </span>
  );
}

/** One open role: title, location, pay. The whole row links to the role's page. On /jobs (`jobs`) pay is "$$$ + Equity". */
export function CareersRoleRow({ role, jobs = false }: { role: CareersRole; jobs?: boolean }) {
  const equity = careersEquityLabel(role);
  return (
    <li>
      <Link href={jobs ? jobsRolePath(role) : careersRolePath(role)} className="doehealth-careers__role">
        <span className="doehealth-careers__role-copy">
          <span className={`doehealth-careers__role-title ${p22Mackinac.className}`}>{role.title}</span>
          <span className="doehealth-careers__role-meta">
            <span>{careersLocation(role)}</span>
            <CareersMetaItem>{careersType(role)}</CareersMetaItem>
          </span>
          <span className="doehealth-careers__role-pay">
            {jobs ? (
              <span>{jobsPayLabel(role)}</span>
            ) : (
              <>
                {role.pay ? <span>{role.pay}</span> : null}
                {equity ? <CareersMetaItem>{equity}</CareersMetaItem> : null}
              </>
            )}
          </span>
        </span>
        <svg className="doehealth-careers__role-arrow" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </li>
  );
}
