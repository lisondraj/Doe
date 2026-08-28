import { VOICE_AGENT_DEFAULT_VOICE } from "@/lib/voice-agent/voice-agent-prompt";

export const VOICE_AGENT_VOICES = [
  { id: "marin", label: "Marin" },
  { id: "cedar", label: "Cedar" },
  { id: "sage", label: "Sage" },
  { id: "coral", label: "Coral" },
  { id: "verse", label: "Verse" },
  { id: "alloy", label: "Alloy" },
] as const;

export type VoiceAgentVoiceId = (typeof VOICE_AGENT_VOICES)[number]["id"];

export const VOICE_AGENT_SPEED_MIN = 0.75;
export const VOICE_AGENT_SPEED_MAX = 1.5;
export const VOICE_AGENT_DEFAULT_SPEED = 1;

export interface VoiceAgentVoiceSettings {
  voice: VoiceAgentVoiceId;
  speed: number;
}

export const VOICE_AGENT_DEFAULT_SETTINGS: VoiceAgentVoiceSettings = {
  voice: VOICE_AGENT_DEFAULT_VOICE as VoiceAgentVoiceId,
  speed: VOICE_AGENT_DEFAULT_SPEED,
};

const STORAGE_KEY = "doe-voice-agent-settings";

export function isVoiceAgentVoiceId(value: unknown): value is VoiceAgentVoiceId {
  return VOICE_AGENT_VOICES.some((voice) => voice.id === value);
}

export function clampVoiceAgentSpeed(value: unknown): number {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number.parseFloat(value) : Number.NaN;
  if (!Number.isFinite(parsed)) return VOICE_AGENT_DEFAULT_SPEED;
  return Math.min(VOICE_AGENT_SPEED_MAX, Math.max(VOICE_AGENT_SPEED_MIN, Math.round(parsed * 20) / 20));
}

export function loadVoiceAgentSettings(): VoiceAgentVoiceSettings {
  if (typeof window === "undefined") return VOICE_AGENT_DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return VOICE_AGENT_DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as { voice?: unknown; speed?: unknown };
    return {
      voice: isVoiceAgentVoiceId(parsed.voice) ? parsed.voice : VOICE_AGENT_DEFAULT_SETTINGS.voice,
      speed: clampVoiceAgentSpeed(parsed.speed),
    };
  } catch {
    return VOICE_AGENT_DEFAULT_SETTINGS;
  }
}

export function saveVoiceAgentSettings(settings: VoiceAgentVoiceSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      voice: isVoiceAgentVoiceId(settings.voice) ? settings.voice : VOICE_AGENT_DEFAULT_SETTINGS.voice,
      speed: clampVoiceAgentSpeed(settings.speed),
    }),
  );
}

export async function loadVoiceAgentSettingsFromAccount(): Promise<VoiceAgentVoiceSettings | null> {
  try {
    const response = await fetch("/api/voice-agent/settings", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as { settings?: unknown } | null;
    if (!response.ok || !data) return null;
    if (!data.settings || typeof data.settings !== "object") return null;
    const parsed = data.settings as { voice?: unknown; speed?: unknown };
    return {
      voice: isVoiceAgentVoiceId(parsed.voice) ? parsed.voice : VOICE_AGENT_DEFAULT_SETTINGS.voice,
      speed: clampVoiceAgentSpeed(parsed.speed),
    };
  } catch {
    return null;
  }
}

export async function saveVoiceAgentSettingsToAccount(settings: VoiceAgentVoiceSettings): Promise<void> {
  try {
    await fetch("/api/voice-agent/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voice: isVoiceAgentVoiceId(settings.voice) ? settings.voice : VOICE_AGENT_DEFAULT_SETTINGS.voice,
        speed: clampVoiceAgentSpeed(settings.speed),
      }),
      cache: "no-store",
    });
  } catch {
    /** local cache already holds the value */
  }
}

export function formatVoiceAgentSpeed(speed: number): string {
  return `${clampVoiceAgentSpeed(speed).toFixed(2).replace(/0$/, "").replace(/\.0$/, "")}×`;
}
