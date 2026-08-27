/** Maps the /voice-agent username login onto the Supabase email identity. */

export const VOICE_AGENT_USERNAME = "james";
export const VOICE_AGENT_EMAIL = "james@doe.care";

export function resolveVoiceAgentEmail(identifier: string): string | null {
  const value = identifier.trim().toLowerCase();
  if (value === VOICE_AGENT_USERNAME || value === VOICE_AGENT_EMAIL) {
    return VOICE_AGENT_EMAIL;
  }
  return null;
}
