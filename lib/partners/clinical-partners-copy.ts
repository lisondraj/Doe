import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  ABOUT_TOP_BANNER_LINK_LABEL,
  ABOUT_TOP_BANNER_MESSAGE,
} from "@/lib/about/about-contact";
import { PARTNERS_PATH } from "@/lib/site-domains";

export const CLINICAL_PARTNERS_PAGE_TITLE = "Clinical Partners Program";

export const CLINICAL_PARTNERS_PAGE_SUBTITLE = "Health Trainees, Early-Career";

export const CLINICAL_PARTNERS_FOUNDERS_MEMO_LINK_LABEL = "Read the Founder's Memo";

export const CLINICAL_PARTNERS_REQUIRED_NOTE = "All fields marked with * are required.";

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH_BEFORE =
  "Today, we are excited to open applications for Doe's ";

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH_GOLD = "Clinical Partners Program";

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH_AFTER =
  " for current professional school students in any health program who will be entering practice within the next five years.";

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH = `${CLINICAL_PARTNERS_OPENING_PARAGRAPH_BEFORE}${CLINICAL_PARTNERS_OPENING_PARAGRAPH_GOLD}${CLINICAL_PARTNERS_OPENING_PARAGRAPH_AFTER}`;

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH_BENEFITS =
  "Partners get early access to intelligent tools for their education, clinical training, and practice — and lock in founding partner discounts on future Doe intelligence plans.";

export const CLINICAL_PARTNERS_OPENING_PARAGRAPH_LAUNCH =
  "We'll be sharing more about our venture's vision and plans as we approach launch in fall 2026.";

export const CLINICAL_PARTNERS_FOUNDERS_HEADING = "About the Founders";

export const CLINICAL_PARTNERS_OPENING_DESCRIPTION = `${CLINICAL_PARTNERS_OPENING_PARAGRAPH} ${CLINICAL_PARTNERS_OPENING_PARAGRAPH_BENEFITS} ${CLINICAL_PARTNERS_OPENING_PARAGRAPH_LAUNCH}`;

export const CLINICAL_PARTNERS_SUBMIT_LABEL = "Submit";

export const CLINICAL_PARTNERS_SUBMIT_INCOMPLETE_MESSAGE =
  "Please complete all required fields before submitting.";

export const CLINICAL_PARTNERS_SUBMIT_SUCCESS_MESSAGE =
  "Submitted. Thank you for your interest in the Clinical Partners Program! We will be in touch with you shortly.";

export const CLINICAL_PARTNERS_SUBMIT_ERROR_MESSAGE =
  "Could not submit your application. Please try again.";

export const CLINICAL_PARTNERS_FIELD_FULL_NAME = "What is your full name?";

export const CLINICAL_PARTNERS_FIELD_EMAIL = "What is your email?";

export const CLINICAL_PARTNERS_FIELD_COUNTRY = "Which country do you currently reside in?";

export const CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE =
  "What state or province do you currently live in?";

export const CLINICAL_PARTNERS_FIELD_STATE_OR_PROVINCE_HINT =
  "If you're comfortable, please include the city.";

export const CLINICAL_PARTNERS_FIELD_INSTITUTION = "What institution are you currently enrolled at?";

export const CLINICAL_PARTNERS_FIELD_TRAINING_STAGE =
  "What stage of training are you currently in?";

export const CLINICAL_PARTNERS_FIELD_TRAINING_STAGE_OTHER = "Please specify";

export const CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY = "What current year of study are you in?";

export const CLINICAL_PARTNERS_FIELD_YEAR_OF_STUDY_OTHER = "Please specify your year of study";

export const CLINICAL_PARTNERS_FIELD_PRACTICE_TIMELINE =
  "When do you expect to enter clinical practice?";

export const CLINICAL_PARTNERS_HEALTH_PROGRAMS_HEADING =
  "Which health professional program are you currently enrolled in?";

export const CLINICAL_PARTNERS_HEALTH_PROGRAM_OTHER_PLACEHOLDER = "Please specify your program";

export const CLINICAL_PARTNERS_SELECT_ALL_HINT = "Select all that apply.";

export const CLINICAL_PARTNERS_INTERESTS_HEADING = "Select all that apply to you.";

export const CLINICAL_PARTNERS_FIELD_LINKEDIN = "What is your LinkedIn profile?";

export const CLINICAL_PARTNERS_LINKEDIN_PLACEHOLDER = "linkedin.com/in/username or full URL";

export const CLINICAL_PARTNERS_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO,
} as const;

export const CLINICAL_PARTNERS_PATH = PARTNERS_PATH;

export { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO };
