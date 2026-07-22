export type Product2IntegrationFilter = "all" | "saved" | "used-before";

export type Product2Integration = {
  id: string;
  name: string;
  category: string;
  saved: boolean;
  usedBefore: boolean;
};

export const PRODUCT2_INTEGRATIONS: readonly Product2Integration[] = [
  { id: "epic", name: "Epic", category: "EHR", saved: true, usedBefore: true },
  { id: "cerner", name: "Cerner", category: "EHR", saved: false, usedBefore: true },
  { id: "athena", name: "Athena", category: "EHR", saved: true, usedBefore: false },
  { id: "accuro", name: "Accuro", category: "EHR", saved: false, usedBefore: false },
  { id: "slack", name: "Slack", category: "Messaging", saved: true, usedBefore: true },
  { id: "teams", name: "Teams", category: "Messaging", saved: false, usedBefore: true },
  { id: "zoom", name: "Zoom", category: "Telehealth", saved: true, usedBefore: true },
  { id: "outlook", name: "Outlook", category: "Email", saved: false, usedBefore: true },
  { id: "fhir", name: "FHIR", category: "Interop", saved: true, usedBefore: false },
  { id: "redox", name: "Redox", category: "Interop", saved: false, usedBefore: false },
  { id: "surescripts", name: "Surescripts", category: "Pharmacy", saved: true, usedBefore: true },
  { id: "stripe", name: "Stripe", category: "Billing", saved: false, usedBefore: false },
  { id: "availity", name: "Availity", category: "Billing", saved: true, usedBefore: true },
  { id: "abridge", name: "Abridge", category: "Ambient", saved: true, usedBefore: false },
  { id: "dax", name: "DAX Copilot", category: "Ambient", saved: false, usedBefore: true },
  { id: "nuance", name: "Nuance", category: "Ambient", saved: false, usedBefore: false },
] as const;

export const PRODUCT2_INTEGRATION_FILTERS: readonly {
  id: Product2IntegrationFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "used-before", label: "Used Before" },
] as const;

export function filterProduct2Integrations(
  integrations: readonly Product2Integration[],
  filter: Product2IntegrationFilter,
  query: string,
): Product2Integration[] {
  const normalizedQuery = query.trim().toLowerCase();

  return integrations.filter((integration) => {
    if (filter === "saved" && !integration.saved) return false;
    if (filter === "used-before" && !integration.usedBefore) return false;

    if (!normalizedQuery) return true;

    return (
      integration.name.toLowerCase().includes(normalizedQuery) ||
      integration.category.toLowerCase().includes(normalizedQuery)
    );
  });
}
