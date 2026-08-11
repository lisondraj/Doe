import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  ABOUT_TOP_BANNER_LINK_LABEL,
  ABOUT_TOP_BANNER_MESSAGE,
} from "@/lib/about/about-contact";
import { JOIN_PATH } from "@/lib/site-domains";

export const CAMPUS_AMBASSADOR_PAGE_TITLE = "Campus Ambassador Program";

export const CAMPUS_AMBASSADOR_REQUIRED_NOTE = "All fields marked with * are required.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH =
  "Today we are excited to open applications for Doe's campus ambassador program for all pre-health students in the United States and Canada who are interested in exploring the intersections of healthcare, AI, and entrepreneurship. This is an opportunity to join a high-velocity startup, connect within your community, and learn more about innovations in AI and clinical practice.";

export const CAMPUS_AMBASSADOR_SUBMIT_LABEL = "Submit application";

export const CAMPUS_AMBASSADOR_FORM_HEADLINE = "Apply to represent Doe on your campus";

export const CAMPUS_AMBASSADOR_FIELD_FULL_NAME = "What is your full name?";

export const CAMPUS_AMBASSADOR_FIELD_EMAIL = "What is your email?";

export const CAMPUS_AMBASSADOR_FIELD_COUNTRY = "Which country do you currently reside in?";

export const CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE =
  "What state or province do you currently live in?";

export const CAMPUS_AMBASSADOR_FIELD_STATE_OR_PROVINCE_HINT =
  "If you're comfortable, please include the city.";

export const CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL =
  "Are you currently in high school, college, or university?";

export const CAMPUS_AMBASSADOR_FIELD_SCHOOL_LEVEL_OTHER = "Please specify";

export const CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY = "What current year of study are you in?";

export const CAMPUS_AMBASSADOR_FIELD_YEAR_OF_STUDY_OTHER = "Please specify your year of study";

export const CAMPUS_AMBASSADOR_FIELD_OF_STUDY = "What is your field of study?";

export const CAMPUS_AMBASSADOR_HEALTH_PROGRAMS_HEADING =
  "Which of the following professional schools are you applying to?";

export const CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OTHER_PLACEHOLDER = "Please specify your program";

export const CAMPUS_AMBASSADOR_SELECT_ALL_HINT = "Select all that apply.";

export const CAMPUS_AMBASSADOR_STATEMENTS_HEADING = "Select all the fields that apply to you.";

export const CAMPUS_AMBASSADOR_FIELD_LINKEDIN = "What is your LinkedIn profile?";

export const CAMPUS_AMBASSADOR_LINKEDIN_PLACEHOLDER = "linkedin.com/in/username or full URL";

export const CAMPUS_AMBASSADOR_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO,
} as const;

export const CAMPUS_AMBASSADOR_PATH = JOIN_PATH;

export { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO };
