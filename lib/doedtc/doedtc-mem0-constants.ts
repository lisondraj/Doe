/** Mem0 agent namespace — keeps Doe patient memories separate from other agents. */
export const DOE_MEM0_AGENT_ID = "doe-dtc";

export const DOE_MEM0_METADATA = { source: "doedtc" } as const;

export const DOE_MEM0_PLAYBOOK_METADATA = { source: "doedtc-playbook" } as const;

export function doeDtcMem0SearchFilters(userId: string): Record<string, unknown> {
  return {
    AND: [{ user_id: userId }, { metadata: { source: DOE_MEM0_METADATA.source } }],
  };
}

export function doeDtcMem0PlaybookFilters(userId: string): Record<string, unknown> {
  return {
    AND: [{ user_id: userId }, { metadata: { source: DOE_MEM0_PLAYBOOK_METADATA.source } }],
  };
}
