/** Strip voice-specific wording from /premed preview copy. */
export function sanitizePremedCopy(text: string): string {
  return text
    .replace(/\bVoice agents\b/g, "Intelligent agents")
    .replace(/\bvoice agents\b/g, "intelligent agents")
    .replace(/\bvoice-led\b/g, "workflow-led")
    .replace(/\bvoice interactions\b/g, "agent interactions")
    .replace(/\bVoice that goes beyond the front desk\./g, "Clinical signals that go beyond the front desk.");
}
