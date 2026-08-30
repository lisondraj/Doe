const RESEARCH_HOST_SUFFIXES = [
  "cdc.gov",
  "nih.gov",
  "who.int",
  "mayoclinic.org",
  "healthline.com",
  "webmd.com",
  "medlineplus.gov",
  "nhs.uk",
  "google.com",
  "maps.google.com",
  "wikipedia.org",
  "onkernel.com",
];

const DENY_HOST_SUFFIXES = [
  "chase.com",
  "bankofamerica.com",
  "wellsfargo.com",
  "coinbase.com",
  "binance.com",
  "okta.com",
  "login.microsoftonline.com",
  "accounts.google.com",
];

export function normalizeBrowserHost(input: string): string {
  try {
    const url = input.includes("://") ? new URL(input) : new URL(`https://${input}`);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return input.trim().toLowerCase().replace(/^www\./, "");
  }
}

export function hostMatchesSuffix(host: string, suffix: string): boolean {
  return host === suffix || host.endsWith(`.${suffix}`);
}

export function isDeniedBrowserHost(host: string): boolean {
  const normalized = normalizeBrowserHost(host);
  return DENY_HOST_SUFFIXES.some((suffix) => hostMatchesSuffix(normalized, suffix));
}

export function isResearchBrowserHost(host: string): boolean {
  const normalized = normalizeBrowserHost(host);
  if (isDeniedBrowserHost(normalized)) return false;
  return RESEARCH_HOST_SUFFIXES.some((suffix) => hostMatchesSuffix(normalized, suffix));
}

export function assertBrowserHostAllowed(params: {
  host: string;
  mode: "research" | "login" | "write";
  declaredHost?: string | null;
}): void {
  const host = normalizeBrowserHost(params.host);
  if (isDeniedBrowserHost(host)) {
    throw new Error("That site is not allowed.");
  }

  if (params.mode === "research") {
    if (!isResearchBrowserHost(host)) {
      throw new Error("Research browsing is limited to approved health and reference sites.");
    }
    return;
  }

  const declared = params.declaredHost ? normalizeBrowserHost(params.declaredHost) : null;
  if (!declared || declared !== host) {
    throw new Error("Login and write actions require a patient-declared site.");
  }
}

export function browserUrlForHost(host: string): string {
  const normalized = normalizeBrowserHost(host);
  return `https://${normalized}`;
}
