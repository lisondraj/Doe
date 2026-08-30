import type { DoeDtcFamilyRelationship } from "@/lib/doedtc/doedtc-types";

const FAMILY_RELATIONSHIPS = new Set<DoeDtcFamilyRelationship>([
  "grandmother",
  "grandfather",
  "mother",
  "father",
  "child",
  "sibling",
  "partner",
  "other",
]);

const RELATIONSHIP_ALIASES: Record<string, DoeDtcFamilyRelationship> = {
  son: "child",
  sons: "child",
  daughter: "child",
  daughters: "child",
  kid: "child",
  kids: "child",
  child: "child",
  children: "child",
  wife: "partner",
  husband: "partner",
  spouse: "partner",
  grandma: "grandmother",
  grandpa: "grandfather",
  mom: "mother",
  dad: "father",
  brother: "sibling",
  sister: "sibling",
};

export function normalizeDoeDtcFamilyRelationship(
  input: string,
): DoeDtcFamilyRelationship | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  if (RELATIONSHIP_ALIASES[trimmed]) return RELATIONSHIP_ALIASES[trimmed];
  if (FAMILY_RELATIONSHIPS.has(trimmed as DoeDtcFamilyRelationship)) {
    return trimmed as DoeDtcFamilyRelationship;
  }
  return null;
}

export function isDoeDtcFamilyRelationship(value: string): value is DoeDtcFamilyRelationship {
  return FAMILY_RELATIONSHIPS.has(value as DoeDtcFamilyRelationship);
}

export function resolveDoeDtcFamilyMemberName(params: {
  fullName: string;
  relationship: DoeDtcFamilyRelationship;
}): string {
  const trimmed = params.fullName.trim();
  if (trimmed) return trimmed;
  if (params.relationship === "child") return "Child";
  return "";
}
