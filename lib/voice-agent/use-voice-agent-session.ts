"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  connectVoiceAgentRealtimeSession,
  sendRealtimeEvent,
  type VoiceAgentRealtimeSession,
} from "@/lib/voice-agent/voice-agent-realtime-client";
import type {
  VoiceAgentFeedback,
  VoiceAgentSetup,
  VoiceAgentStationType,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";

export type VoiceAgentScreen = "start" | "connecting" | "session" | "feedback" | "error";

interface RealtimeFunctionCallItem {
  type: "function_call";
  name: string;
  call_id: string;
  arguments: string;
}

interface RealtimeResponseDoneEvent {
  type: "response.done";
  response?: { output?: unknown[] };
}

function isFunctionCallItem(item: unknown): item is RealtimeFunctionCallItem {
  return (
    typeof item === "object" &&
    item !== null &&
    (item as { type?: unknown }).type === "function_call"
  );
}

function clampDuration(minutes: unknown): number {
  const value = typeof minutes === "number" && Number.isFinite(minutes) ? minutes : 8;
  return Math.min(20, Math.max(3, Math.round(value)));
}

function toStationType(value: unknown): VoiceAgentStationType {
  if (value === "physical_exam" || value === "management_counseling" || value === "history") {
    return value;
  }
  return "history";
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

let uid = 0;
function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

export function useVoiceAgentSession() {
  const [screen, setScreen] = useState<VoiceAgentScreen>("start");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setup, setSetup] = useState<VoiceAgentSetup | null>(null);
  const [transcript, setTranscript] = useState<VoiceAgentTranscriptEntry[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<VoiceAgentFeedback | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);

  const sessionRef = useRef<VoiceAgentRealtimeSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const assistantBufferRef = useRef<Map<string, string>>(new Map());
  const endRequestedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const teardown = useCallback(() => {
    stopTimer();
    sessionRef.current?.close();
    sessionRef.current = null;
    endRequestedRef.current = false;
  }, [stopTimer]);

  useEffect(() => teardown, [teardown]);

  const requestStationEnd = useCallback(() => {
    const session = sessionRef.current;
    if (!session || endRequestedRef.current) return;
    endRequestedRef.current = true;
    stopTimer();
    sendRealtimeEvent(session.dataChannel, {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text:
              "[SYSTEM] The station time has ended. Drop character, call end_session with your feedback, then speak a brief spoken summary.",
          },
        ],
      },
    });
    sendRealtimeEvent(session.dataChannel, { type: "response.create" });
  }, [stopTimer]);

  const startTimer = useCallback(
    (durationMinutes: number) => {
      stopTimer();
      const totalSeconds = durationMinutes * 60;
      setRemainingSeconds(totalSeconds);
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        setRemainingSeconds(remaining);
        if (remaining <= 0) {
          requestStationEnd();
        }
      }, 250);
    },
    [requestStationEnd, stopTimer],
  );

  const handleFunctionCall = useCallback(
    (item: RealtimeFunctionCallItem) => {
      const session = sessionRef.current;
      if (!session) return;

      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(item.arguments || "{}");
      } catch {
        args = {};
      }

      sendRealtimeEvent(session.dataChannel, {
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: item.call_id,
          output: JSON.stringify({ ok: true }),
        },
      });
      sendRealtimeEvent(session.dataChannel, { type: "response.create" });

      if (item.name === "configure_session") {
        const durationMinutes = clampDuration(args.duration_minutes);
        const nextSetup: VoiceAgentSetup = {
          durationMinutes,
          topic: typeof args.topic === "string" && args.topic ? args.topic : "General station",
          stationType: toStationType(args.station_type),
          checklist: toStringArray(args.checklist),
        };
        setSetup(nextSetup);
        setCheckedItems(new Set());
        startTimer(durationMinutes);
        return;
      }

      if (item.name === "end_session") {
        stopTimer();
        setFeedback({
          strengths: toStringArray(args.strengths),
          improvements: toStringArray(args.improvements),
          overallImpression:
            typeof args.overall_impression === "string" ? args.overall_impression : "",
        });
        setScreen("feedback");
      }
    },
    [startTimer, stopTimer],
  );

  const handleServerEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type;

      if (type === "input_audio_buffer.speech_started") {
        setUserSpeaking(true);
        return;
      }
      if (type === "input_audio_buffer.speech_stopped") {
        setUserSpeaking(false);
        return;
      }
      if (type === "output_audio_buffer.started") {
        setAssistantSpeaking(true);
        return;
      }
      if (type === "output_audio_buffer.stopped" || type === "output_audio_buffer.cleared") {
        setAssistantSpeaking(false);
        return;
      }

      if (type === "response.output_audio_transcript.delta") {
        const itemId = typeof event.item_id === "string" ? event.item_id : "current";
        const delta = typeof event.delta === "string" ? event.delta : "";
        const prior = assistantBufferRef.current.get(itemId) ?? "";
        const merged = prior + delta;
        assistantBufferRef.current.set(itemId, merged);
        setAssistantSpeaking(true);
        setTranscript((entries) => {
          const idx = entries.findIndex((entry) => entry.id === itemId);
          if (idx === -1) {
            return [...entries, { id: itemId, role: "assistant", text: merged, final: false }];
          }
          const next = [...entries];
          next[idx] = { ...next[idx], text: merged };
          return next;
        });
        return;
      }

      if (type === "response.output_audio_transcript.done") {
        const itemId = typeof event.item_id === "string" ? event.item_id : "current";
        const finalText =
          typeof event.transcript === "string"
            ? event.transcript
            : assistantBufferRef.current.get(itemId) ?? "";
        assistantBufferRef.current.delete(itemId);
        setTranscript((entries) => {
          const idx = entries.findIndex((entry) => entry.id === itemId);
          if (idx === -1) {
            return [...entries, { id: itemId, role: "assistant", text: finalText, final: true }];
          }
          const next = [...entries];
          next[idx] = { ...next[idx], text: finalText, final: true };
          return next;
        });
        return;
      }

      if (type === "conversation.item.input_audio_transcription.completed") {
        const text = typeof event.transcript === "string" ? event.transcript.trim() : "";
        if (!text) return;
        setTranscript((entries) => [
          ...entries,
          { id: nextId("user"), role: "user", text, final: true },
        ]);
        return;
      }

      if (type === "response.done") {
        const response = (event as unknown as RealtimeResponseDoneEvent).response;
        const output = Array.isArray(response?.output) ? response!.output! : [];
        output.filter(isFunctionCallItem).forEach(handleFunctionCall);
        setAssistantSpeaking(false);
        return;
      }

      if (type === "error") {
        console.error("voice-agent realtime error", event);
      }
    },
    [handleFunctionCall],
  );

  const start = useCallback(async () => {
    setErrorMessage(null);
    setScreen("connecting");
    setSetup(null);
    setTranscript([]);
    setCheckedItems(new Set());
    setFeedback(null);
    assistantBufferRef.current.clear();
    endRequestedRef.current = false;

    try {
      const session = await connectVoiceAgentRealtimeSession();
      sessionRef.current = session;

      session.dataChannel.addEventListener("open", () => {
        setScreen("session");
      });

      session.dataChannel.addEventListener("message", (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          handleServerEvent(parsed);
        } catch {
          /** ignore malformed events */
        }
      });

      session.peerConnection.addEventListener("connectionstatechange", () => {
        const state = session.peerConnection.connectionState;
        if (state === "failed" || state === "disconnected" || state === "closed") {
          setUserSpeaking(false);
          setAssistantSpeaking(false);
        }
      });
    } catch (error) {
      teardown();
      setErrorMessage(error instanceof Error ? error.message : "Could not start the voice agent.");
      setScreen("error");
    }
  }, [handleServerEvent, teardown]);

  const endStationEarly = useCallback(() => {
    requestStationEnd();
  }, [requestStationEnd]);

  const toggleChecklistItem = useCallback((item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    teardown();
    setScreen("start");
    setErrorMessage(null);
    setSetup(null);
    setTranscript([]);
    setCheckedItems(new Set());
    setFeedback(null);
    setRemainingSeconds(0);
    setUserSpeaking(false);
    setAssistantSpeaking(false);
  }, [teardown]);

  return {
    screen,
    errorMessage,
    setup,
    transcript,
    checkedItems,
    feedback,
    remainingSeconds,
    userSpeaking,
    assistantSpeaking,
    start,
    endStationEarly,
    toggleChecklistItem,
    reset,
  };
}
