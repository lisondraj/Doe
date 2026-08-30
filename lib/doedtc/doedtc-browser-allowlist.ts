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

const SITE_ALIASES: Record<string, string> = {
  mayo: "mayoclinic.org",
  "mayo clinic": "mayoclinic.org",
  mayoclinic: "mayoclinic.org",
  cdc: "cdc.gov",
  nih: "nih.gov",
  who: "who.int",
  wikipedia: "wikipedia.org",
  wiki: "wikipedia.org",
  google: "google.com",
  medlineplus: "medlineplus.gov",
  medline: "medlineplus.gov",
  healthline: "healthline.com",
  webmd: "webmd.com",
};

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

export function resolveSiteAlias(input: string): string | null {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return null;
  return SITE_ALIASES[normalized] ?? null;
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

export function normalizeBrowserUrl(input: string): { host: string; targetUrl: string } {
  const raw = input.trim();
  if (!raw) {
    throw new Error("A URL is required.");
  }

  if (raw.includes("://")) {
    return { host: normalizeBrowserHost(raw), targetUrl: raw };
  }

  const alias = resolveSiteAlias(raw);
  if (alias && !raw.includes("/") && !raw.includes("?")) {
    return { host: alias, targetUrl: browserUrlForHost(alias) };
  }

  if (raw.includes("/") || raw.includes("?")) {
    const url = new URL(`https://${raw}`);
    return {
      host: url.hostname.toLowerCase().replace(/^www\./, ""),
      targetUrl: url.href,
    };
  }

  const host = alias ?? normalizeBrowserHost(raw);
  return { host, targetUrl: browserUrlForHost(host) };
}

/** Build a Google search URL. */
export function researchSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return browserUrlForHost("google.com");
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

export function extractSearchQuery(text: string): string {
  return text.trim().replace(/^search\s+/i, "").trim();
}

export function siteSearchUrl(host: string, query: string): string {
  const normalizedHost = normalizeBrowserHost(host);
  const q = encodeURIComponent(query.trim());

  switch (normalizedHost) {
    case "mayoclinic.org":
      return `https://www.mayoclinic.org/search/search-results?q=${q}`;
    case "cdc.gov":
      return `https://www.cdc.gov/search/?query=${q}`;
    case "nih.gov":
      return `https://search.nih.gov/search?query=${q}`;
    case "wikipedia.org":
      return `https://en.wikipedia.org/w/index.php?search=${q}`;
    case "medlineplus.gov":
      return `https://medlineplus.gov/search/?query=${q}`;
    case "google.com":
      return researchSearchUrl(query);
    default:
      return researchSearchUrl(`site:${normalizedHost} ${query}`);
  }
}

export function resolveResearchBrowseTarget(params: {
  url: string;
  intent: string;
}): { host: string; targetUrl: string } | { ok: false; error: string } {
  const raw = params.url.trim();
  const intent = params.intent.trim();

  let host: string;
  let targetUrl: string;

  const alias = resolveSiteAlias(raw);
  const searchQuery = intent ? extractSearchQuery(intent) || intent : "";

  if (alias && searchQuery) {
    host = alias;
    targetUrl = siteSearchUrl(host, searchQuery);
  } else if (raw.includes("://") || raw.includes(".") || raw.includes("/") || raw.includes("?")) {
    try {
      const normalized = normalizeBrowserUrl(raw);
      host = normalized.host;
      targetUrl = normalized.targetUrl;
    } catch {
      return { ok: false, error: "Could not parse that URL." };
    }
  } else if (alias) {
    host = alias;
    targetUrl = browserUrlForHost(host);
  } else if (raw && searchQuery) {
    host = normalizeBrowserHost(raw);
    if (host.includes(".")) {
      targetUrl = siteSearchUrl(host, searchQuery);
    } else {
      host = "google.com";
      targetUrl = researchSearchUrl(`${raw} ${searchQuery}`);
    }
  } else if (searchQuery) {
    host = "google.com";
    targetUrl = researchSearchUrl(searchQuery);
  } else if (raw) {
    const aliasOnly = resolveSiteAlias(raw);
    if (aliasOnly) {
      host = aliasOnly;
      targetUrl = browserUrlForHost(host);
    } else if (raw.includes(".")) {
      host = normalizeBrowserHost(raw);
      targetUrl = browserUrlForHost(host);
    } else {
      host = "google.com";
      targetUrl = researchSearchUrl(raw);
    }
  } else {
    return { ok: false, error: "A URL or search topic is required." };
  }

  if (isDeniedBrowserHost(host)) {
    return { ok: false, error: "That site is not allowed." };
  }

  return { host, targetUrl };
}
