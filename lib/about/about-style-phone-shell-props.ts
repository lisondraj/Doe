import { ABOUT_CONTACT_EMAIL, ABOUT_TOP_BANNER_LINK_LABEL, ABOUT_TOP_BANNER_MESSAGE } from "@/lib/about/about-contact";

/** Shared BlogMobileShell props for iPhone /about-style pages. */
export const ABOUT_STYLE_PHONE_SHELL_PROPS = {
  showJoinCta: false,
  ctaLayout: "main-home" as const,
  logoLink: true,
  showMenu: false,
  footerLinksDisabled: true,
  shellMinHeightClass: "min-h-[var(--doe-section-band-vh,var(--app-vh,100lvh))]",
  frostedScrollNav: true,
  frostedNavAlwaysPunched: true,
  footerShaderTheme: "dusk" as const,
  rootClassName: "doephone-mobile-root--doehealth",
  navShowMailIcon: true,
  navShowInvestorsCta: false,
};

export const ABOUT_STYLE_TOP_BANNER = {
  message: ABOUT_TOP_BANNER_MESSAGE,
  linkLabel: ABOUT_TOP_BANNER_LINK_LABEL,
  linkHref: ABOUT_CONTACT_MAILTO_SUBJECT,
};
