import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  ABOUT_TOP_BANNER_LINK_LABEL,
  ABOUT_TOP_BANNER_MESSAGE,
} from "@/lib/about/about-contact";
import { PREMED_PATH } from "@/lib/site-domains";

export const PREMED_PAGE_TITLE = "The Broader Doe Vision";

export const PREMED_PATH_CANONICAL = PREMED_PATH;

export const PREMED_LEARN_MORE_MODAL_TITLE = "Learn more about Doe";

export const PREMED_LEARN_MORE_MODAL_BODY =
  "We'd love to tell you more about Doe's vision for healthcare intelligence.";

export const PREMED_LEARN_MORE_MODAL_EMAIL_LABEL = "Email James";

export const PREMED_LEARN_MORE_MODAL_DISMISS_LABEL = "Close";

export const PREMED_CAMPUS_AMBASSADOR_HEADLINE = "Register for our Campus Ambassador Program";

export const PREMED_CAMPUS_AMBASSADOR_DESCRIPTION =
  "Represent Doe on your campus and connect pre-health students to our vision for healthcare intelligence.";

export const PREMED_CAMPUS_AMBASSADOR_CTA_LABEL = "Apply now";

export const PREMED_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO,
} as const;

export type PremedFounderBio = {
  name: string;
  linkedinUrl: string;
  bio: string;
};

export const PREMED_FOUNDERS: readonly PremedFounderBio[] = [
  {
    name: "James Lisondra",
    linkedinUrl: "https://www.linkedin.com/in/jameslisondra",
    bio: "is CEO. A medical student at the University of Ottawa soon building Doe full-time, he brings clinical training and healthcare experience to product direction, partnerships, and go-to-market.",
  },
  {
    name: "Matthew Lisondra",
    linkedinUrl: "https://www.linkedin.com/in/mattlisondra",
    bio: "is CTO. A doctoral candidate at the University of Toronto soon building Doe full-time, with backgrounds in physics, robotics, AI, and computer science, he leads Doe's intelligence engineering.",
  },
] as const;

export const PREMED_JAMES_LISONDRA_BIO = `${PREMED_FOUNDERS[0].name} ${PREMED_FOUNDERS[0].bio}`;

export const PREMED_MATTHEW_LISONDRA_BIO = `${PREMED_FOUNDERS[1].name} ${PREMED_FOUNDERS[1].bio}`;

export { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO };
