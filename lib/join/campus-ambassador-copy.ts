import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  ABOUT_TOP_BANNER_LINK_LABEL,
  ABOUT_TOP_BANNER_MESSAGE,
} from "@/lib/about/about-contact";
import { JOIN_PATH } from "@/lib/site-domains";

export const CAMPUS_AMBASSADOR_PAGE_TITLE = "Clinical Partners Program";

export const CAMPUS_AMBASSADOR_PAGE_SUBTITLE = "Eligible: Pre-Health Students in US and Canada";

export const CAMPUS_AMBASSADOR_FOUNDERS_MEMO_LINK_LABEL = "Read the Founder's Memo";

export const CAMPUS_AMBASSADOR_REQUIRED_NOTE = "All fields marked with * are required.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_BEFORE = "Today, we are excited to launch our ";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_GOLD = "Clinical Partners Program";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_AFTER =
  ". This will allow us to connect current and future providers with intelligent tools to streamline their education and practices. The program first opens to pre-health students in the United States and Canada who are interested in exploring the intersections of healthcare, AI, and entrepreneurship.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH = `${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_BEFORE}${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_GOLD}${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_AFTER}`;

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_EXPANSION =
  "We will be slowly expanding the program to professional student schools, then to providers as we near the launch of Doe's intelligent tools this Fall.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY =
  "This is an opportunity to join a high-velocity startup, connect within your community, and learn more about innovations in AI and clinical practice.";

export const CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH =
  "We'll be sharing more about our venture's vision and plans as we approach launch in fall 2026.";

export const CAMPUS_AMBASSADOR_BENEFITS_HEADING = "Benefits";

export const CAMPUS_AMBASSADOR_BENEFITS_ITEMS = [
  "Grow your network with future colleagues across medicine, pharmacy, dentistry, nursing, and allied health while you prepare for professional school.",
  "Build connections with physicians, pharmacists, dentists, and other clinicians who are shaping how care is delivered.",
  "Be first considered when we open funded internship opportunities at Doe.",
] as const;

export const CAMPUS_AMBASSADOR_EDUCATION_HEADING = "Doe Education";

export const CAMPUS_AMBASSADOR_EDUCATION_DESCRIPTION =
  "Lock in reduced pricing on pre-health tools designed to support your applications, interviews, and transition into professional school.";

export const CAMPUS_AMBASSADOR_FOUNDERS_HEADING = "About the Founders";

export const CAMPUS_AMBASSADOR_OPENING_DESCRIPTION = `${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH} ${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_EXPANSION} ${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY} ${CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH}`;

export const CAMPUS_AMBASSADOR_SUBMIT_LABEL = "Submit";

export const CAMPUS_AMBASSADOR_SUBMIT_INCOMPLETE_MESSAGE =
  "Please complete all required fields before submitting.";

export const CAMPUS_AMBASSADOR_SUBMIT_SUCCESS_MESSAGE =
  "Submitted. Thank you for your interest in joining our venture! We will be in touch with you shortly.";

export const CAMPUS_AMBASSADOR_SUBMIT_ERROR_MESSAGE =
  "Could not submit your application. Please try again.";

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
