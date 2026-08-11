import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  ABOUT_TOP_BANNER_LINK_LABEL,
  ABOUT_TOP_BANNER_MESSAGE,
} from "@/lib/about/about-contact";
import { JOIN_PATH } from "@/lib/site-domains";

export const CAMPUS_AMBASSADOR_PAGE_TITLE = "Campus Ambassador Program";

export const CAMPUS_AMBASSADOR_SUBHEADING =
  "Open to all pre-health students who want to represent Doe on campus and connect peers with clinical intelligence.";

export const CAMPUS_AMBASSADOR_REQUIRED_NOTE = "All fields marked with * are required.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH =
  "Campus ambassadors help pre-med and pre-health communities discover how Doe supports clinical learning, documentation, and the path toward intelligent care. Tell us a bit about yourself below—we review every submission.";

export const CAMPUS_AMBASSADOR_FIELD_PROMPT = "What is your name?";

export const CAMPUS_AMBASSADOR_FIELD_COUNT = 10;

export const CAMPUS_AMBASSADOR_SUBMIT_LABEL = "Submit application";

export const CAMPUS_AMBASSADOR_FORM_HEADLINE = "Apply to represent Doe on your campus";

export const CAMPUS_AMBASSADOR_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO,
} as const;

export const CAMPUS_AMBASSADOR_PATH = JOIN_PATH;

export { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO };
