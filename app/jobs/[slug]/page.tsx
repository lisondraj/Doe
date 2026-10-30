import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoeHealthCareersRolePage } from "@/components/doehealth-careers/DoeHealthCareersRolePage";
import { careersLocation, careersRole, careersType } from "@/lib/doehealth/doehealth-careers";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";
import { jobsRole } from "@/lib/jobs/jobs-roles";

export const dynamic = "force-dynamic";

type RouteProps = { params: { slug: string } };

export function generateMetadata({ params }: RouteProps): Metadata {
  const found = careersRole(params.slug);
  if (!found) return {};
  const role = jobsRole(found);
  return {
    title: `Doe | ${role.title}`,
    description: `${role.summary} ${careersLocation(role)}, ${careersType(role).toLowerCase()}.`,
    robots: { index: false, follow: false },
  };
}

/** /jobs/[slug]: one role as an indication of interest, with the application at the foot. */
export default function JobsRoleRoute({ params }: RouteProps) {
  const role = careersRole(params.slug);
  if (!role) notFound();
  return <DoeHealthCareersRolePage role={jobsRole(role)} initialVariant={doehealthDesk2InitialVariant()} jobs />;
}
