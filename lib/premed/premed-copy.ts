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

export const PREMED_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO,
} as const;

export { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO };
