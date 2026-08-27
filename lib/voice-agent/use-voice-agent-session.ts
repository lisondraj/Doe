"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  loadVoiceAgentHistory,
  transcriptForHistory,
  upsertVoiceAgentHistory,
} from "@/lib/voice-agent/voice-agent-history";
import {
  attachVoiceAgentMic,
  connectVoiceAgentRealtimeSession,
  detachVoiceAgentMic,
  sendRealtimeEvent,
  setVoiceAgentMicEnabled,
  type VoiceAgentRealtimeSession,
} from "@/lib/voice-agent/voice-agent-realtime-client";
import type {
  VoiceAgentFeedback,
  VoiceAgentHistoryRecord,
  VoiceAgentMode,
  VoiceAgentSetup,
  VoiceAgentStationType,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";

export type VoiceAgentScreen =
  | "start"
  | "connecting"
  | "session"
  | "feedback"
  | "deepdive"
  | "learning"
  | "error";

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
  const parsed =
    typeof minutes === "number"
      ? minutes
      : typeof minutes === "string"
        ? Number.parseFloat(minutes)
        : Number.NaN;
  const value = Number.isFinite(parsed) ? parsed : 8;
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

function isRealtimeApiNoise(text: string): boolean {
  const normalized = text.toLowerCase();
  return (
    normalized.includes("missing required parameter") ||
    normalized.startsWith("missing required") ||
    normalized.includes("invalid_request_error") ||
    normalized.includes("unknown parameter") ||
    /session\.tools\[\d+\]/.test(normalized)
  );
}

function errorEventMessage(event: Record<string, unknown>): string {
  const nested = event.error;
  if (typeof nested === "object" && nested !== null) {
    const message = (nested as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return typeof event.message === "string" ? event.message : "";
}

function compactTranscriptForPrompt(entries: readonly VoiceAgentTranscriptEntry[]): string {
  const lines = entries
    .filter((entry) => entry.text.trim())
    .map((entry) => `${entry.role === "user" ? "Candidate" : "Dr. Osler"}: ${entry.text.trim()}`);
  let text = lines.join("\n");
  const max = 6000;
  if (text.length <= max) return text;
  text = text.slice(text.length - max);
  const firstBreak = text.indexOf("\n");
  return firstBreak > 0 ? text.slice(firstBreak + 1) : text;
}

let uid = 0;
function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return nextId("session");
}

function updateTranscriptList(
  entries: VoiceAgentTranscriptEntry[],
  itemId: string,
  text: string,
  final: boolean,
): VoiceAgentTranscriptEntry[] {
  if (isRealtimeApiNoise(text)) {
    return entries.filter((entry) => entry.id !== itemId);
  }
  const idx = entries.findIndex((entry) => entry.id === itemId);
  const nextEntry: VoiceAgentTranscriptEntry = { id: itemId, role: "assistant", text, final };
  if (idx === -1) return [...entries, nextEntry];
  const next = [...entries];
  next[idx] = { ...next[idx], ...nextEntry };
  return next;
}

export function useVoiceAgentSession() {
  const [screen, setScreen] = useState<VoiceAgentScreen>("start");
  const [mode, setMode] = useState<VoiceAgentMode>("practice");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setup, setSetup] = useState<VoiceAgentSetup | null>(null);
  const [transcript, setTranscript] = useState<VoiceAgentTranscriptEntry[]>([]);
  const [adviceTranscript, setAdviceTranscript] = useState<VoiceAgentTranscriptEntry[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<VoiceAgentFeedback | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [coachingActive, setCoachingActive] = useState(false);
  const [askMoreOpen, setAskMoreOpen] = useState(false);
  const [history, setHistory] = useState<VoiceAgentHistoryRecord[]>([]);

  const sessionRef = useRef<VoiceAgentRealtimeSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const assistantBufferRef = useRef<Map<string, string>>(new Map());
  const endRequestedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<string | null>(null);
  const adviceModeRef = useRef(false);
  const micEnabledBeforeNotesRef = useRef(true);
  const persistSnapshotRef = useRef({
    mode: "practice" as VoiceAgentMode,
    setup: null as VoiceAgentSetup | null,
    transcript: [] as VoiceAgentTranscriptEntry[],
    adviceTranscript: [] as VoiceAgentTranscriptEntry[],
    feedback: null as VoiceAgentFeedback | null,
  });

  persistSnapshotRef.current = { mode, setup, transcript, adviceTranscript, feedback };

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const persistHistory = useCallback(() => {
    const sessionId = sessionIdRef.current;
    const startedAt = startedAtRef.current;
    if (!sessionId || !startedAt) return;

    const snap = persistSnapshotRef.current;
    const cleaned = transcriptForHistory(snap.transcript);
    const cleanedAdvice = transcriptForHistory(snap.adviceTranscript);
    const topic = snap.setup?.topic?.trim() ?? "";
    if (!topic && cleaned.length === 0 && cleanedAdvice.length === 0) return;

    const records = upsertVoiceAgentHistory({
      id: sessionId,
      mode: snap.mode,
      topic: topic || (snap.mode === "learn" ? "Learning session" : "Practice session"),
      stationType: snap.setup?.stationType ?? null,
      startedAt,
      endedAt: new Date().toISOString(),
      transcript: cleaned,
      adviceTranscript: cleanedAdvice,
      feedback: snap.feedback,
    });
    void Promise.resolve(records).then(setHistory);
  }, []);

  const persistHistoryRef = useRef(persistHistory);
  persistHistoryRef.current = persistHistory;

  const teardown = useCallback(() => {
    stopTimer();
    sessionRef.current?.close();
    sessionRef.current = null;
    endRequestedRef.current = false;
  }, [stopTimer]);

  useEffect(() => {
    void loadVoiceAgentHistory().then(setHistory);
  }, []);

  useEffect(() => {
    return () => {
      persistHistoryRef.current();
      teardown();
    };
  }, [teardown]);

  useEffect(() => {
    if (screen === "start" || screen === "connecting" || screen === "error") return;
    const timer = window.setTimeout(() => persistHistoryRef.current(), 1200);
    return () => window.clearTimeout(timer);
  }, [screen, transcript, adviceTranscript, setup, feedback]);

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

      if (item.name === "configure_learning_session") {
        const nextSetup: VoiceAgentSetup = {
          durationMinutes: 0,
          topic: typeof args.topic === "string" && args.topic ? args.topic : "Clinical topic",
          stationType: "history",
          checklist: [],
        };
        setSetup(nextSetup);
        setVoiceAgentMicEnabled(session, false);
        setCoachingActive(false);
        setScreen("learning");
        return;
      }

      if (item.name === "end_session") {
        stopTimer();
        setVoiceAgentMicEnabled(session, false);
        setCoachingActive(false);
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

  const sendSystemPrompt = useCallback((text: string) => {
    const session = sessionRef.current;
    if (!session || session.dataChannel.readyState !== "open") {
      setErrorMessage("The voice session ended. Start a new session to keep talking.");
      return false;
    }
    setErrorMessage(null);
    sendRealtimeEvent(session.dataChannel, {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
    sendRealtimeEvent(session.dataChannel, { type: "response.create" });
    return true;
  }, []);

  const handleServerEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type;
      const patchList = adviceModeRef.current ? setAdviceTranscript : setTranscript;

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
        patchList((entries) => updateTranscriptList(entries, itemId, merged, false));
        return;
      }

      if (type === "response.output_audio_transcript.done") {
        const itemId = typeof event.item_id === "string" ? event.item_id : "current";
        const finalText =
          typeof event.transcript === "string"
            ? event.transcript
            : assistantBufferRef.current.get(itemId) ?? "";
        assistantBufferRef.current.delete(itemId);
        patchList((entries) => updateTranscriptList(entries, itemId, finalText, true));
        return;
      }

      if (type === "conversation.item.input_audio_transcription.completed") {
        const text = typeof event.transcript === "string" ? event.transcript.trim() : "";
        if (!text) return;
        patchList((entries) => [...entries, { id: nextId("user"), role: "user", text, final: true }]);
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
        const message = errorEventMessage(event);
        console.error("voice-agent realtime error", event);
        if (isRealtimeApiNoise(message) && sessionRef.current) {
          sendRealtimeEvent(sessionRef.current.dataChannel, { type: "response.cancel" });
        }
        return;
      }
    },
    [handleFunctionCall],
  );

  const attachSession = useCallback(
    (session: VoiceAgentRealtimeSession, onOpen: () => void) => {
      sessionRef.current = session;
      session.dataChannel.addEventListener("open", onOpen);
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
    },
    [handleServerEvent],
  );

  const start = useCallback(
    async (nextMode: VoiceAgentMode) => {
      setErrorMessage(null);
      setMode(nextMode);
      setScreen("connecting");
      setSetup(null);
      setTranscript([]);
      setAdviceTranscript([]);
      setCheckedItems(new Set());
      setFeedback(null);
      setCoachingActive(false);
      setAskMoreOpen(false);
      adviceModeRef.current = false;
      assistantBufferRef.current.clear();
      endRequestedRef.current = false;
      sessionIdRef.current = newSessionId();
      startedAtRef.current = new Date().toISOString();

      try {
        const session = await connectVoiceAgentRealtimeSession(nextMode);
        attachSession(session, () => setScreen("session"));
      } catch (error) {
        teardown();
        setErrorMessage(error instanceof Error ? error.message : "Could not start the voice agent.");
        setScreen("error");
      }
    },
    [attachSession, teardown],
  );

  const endStationEarly = useCallback(() => {
    requestStationEnd();
  }, [requestStationEnd]);

  const closeAskMore = useCallback(() => {
    const session = sessionRef.current;
    if (session) setVoiceAgentMicEnabled(session, false);
    setCoachingActive(false);
    setAskMoreOpen(false);
  }, []);

  const openAskMore = useCallback(
    (prompt: string) => {
      const session = sessionRef.current;
      if (!session) {
        setErrorMessage("The voice session ended. Start a new session to keep talking.");
        return;
      }

      const firstOpen = !adviceModeRef.current;
      adviceModeRef.current = true;
      setAskMoreOpen(true);

      if (firstOpen && !sendSystemPrompt(prompt)) {
        adviceModeRef.current = false;
        setAskMoreOpen(false);
        return;
      }

      setVoiceAgentMicEnabled(session, true);
      setCoachingActive(true);
    },
    [sendSystemPrompt],
  );

  const beginCoaching = useCallback(() => {
    openAskMore(
      "[SYSTEM] The candidate is ready for post-station coaching. You are now Dr. Osler the examiner and coach — not the patient. In one short sentence, invite them to ask for tips, missed questions, better phrasing, or what a strong candidate would do on this station. Then wait for their question and keep going back and forth.",
    );
  }, [openAskMore]);

  const beginDeepDive = useCallback(() => {
    const session = sessionRef.current;
    if (!session) {
      setErrorMessage("The voice session ended. Start a new session to keep talking.");
      return;
    }
    if (
      !sendSystemPrompt(
        "[SYSTEM] Start a topic DEEP DIVE now. You are Dr. Osler the examiner-teacher, not the patient. Give a VERY detailed spoken teaching on this station's exact topic. Cover in order, with real OSCE-ready detail: (1) History — the specific questions to ask, grouped, with example phrasing; (2) Differential diagnosis — ranked, including can't-miss diagnoses and why each is in or out; (3) Examination if relevant; (4) Investigations; (5) Management and counseling / safety-netting. Be thorough, not brief. When finished, stop and wait. Do not invite questions yet.",
      )
    ) {
      return;
    }
    setVoiceAgentMicEnabled(session, false);
    setCoachingActive(false);
    setAskMoreOpen(false);
    setScreen("deepdive");
  }, [sendSystemPrompt]);

  const beginDeepDiveQuestions = useCallback(() => {
    openAskMore(
      "[SYSTEM] The candidate wants follow-up questions on this deep dive. Invite them in one short sentence to ask anything — more history questions, DDX, investigations, or management — then wait and keep going back and forth in the same level of detail.",
    );
  }, [openAskMore]);

  const beginAskMore = useCallback(() => {
    openAskMore(
      "[SYSTEM] The candidate tapped Ask more about this session. Invite them in one short sentence to ask anything about this topic — more history questions, DDX, investigations, management, or examiner questions — then wait and keep going back and forth in the same level of detail.",
    );
  }, [openAskMore]);

  const startAskMoreFromHistory = useCallback(
    async (record: VoiceAgentHistoryRecord) => {
      persistHistory();
      teardown();

      setErrorMessage(null);
      setMode(record.mode);
      setScreen("connecting");
      setSetup({
        durationMinutes: 0,
        topic: record.topic,
        stationType: record.stationType ?? "history",
        checklist: [],
      });
      setTranscript(record.transcript);
      setAdviceTranscript(record.adviceTranscript ?? []);
      setCheckedItems(new Set());
      setFeedback(record.feedback);
      setCoachingActive(false);
      setAskMoreOpen(false);
      adviceModeRef.current = true;
      assistantBufferRef.current.clear();
      endRequestedRef.current = false;
      sessionIdRef.current = record.id;
      startedAtRef.current = record.startedAt;

      try {
        const session = await connectVoiceAgentRealtimeSession(record.mode, { followup: true });
        attachSession(session, () => {
          setScreen(record.mode === "practice" && record.feedback ? "feedback" : "learning");
          setAskMoreOpen(true);
          setCoachingActive(true);
          setVoiceAgentMicEnabled(session, true);
          const original = compactTranscriptForPrompt(record.transcript);
          sendSystemPrompt(
            `[SYSTEM] The candidate tapped Ask more about this session. Topic: ${record.topic}. Original transcript:\n${original || "(none captured)"}\nInvite them in one short sentence to ask more, then wait and keep going back and forth.`,
          );
        });
      } catch (error) {
        teardown();
        setErrorMessage(error instanceof Error ? error.message : "Could not start the voice agent.");
        setScreen("error");
      }
    },
    [attachSession, persistHistory, sendSystemPrompt, teardown],
  );

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
    persistHistory();
    teardown();
    sessionIdRef.current = null;
    startedAtRef.current = null;
    adviceModeRef.current = false;
    setScreen("start");
    setErrorMessage(null);
    setSetup(null);
    setTranscript([]);
    setAdviceTranscript([]);
    setCheckedItems(new Set());
    setFeedback(null);
    setCoachingActive(false);
    setAskMoreOpen(false);
    setRemainingSeconds(0);
    setUserSpeaking(false);
    setAssistantSpeaking(false);
  }, [persistHistory, teardown]);

  const goBack = useCallback(() => {
    if (askMoreOpen) {
      closeAskMore();
      return;
    }
    if (screen === "deepdive") {
      setCoachingActive(false);
      setScreen("feedback");
      return;
    }
    reset();
  }, [askMoreOpen, closeAskMore, reset, screen]);

  const acquireNoteMic = useCallback(async () => {
    const session = sessionRef.current;
    if (session) {
      micEnabledBeforeNotesRef.current = session.micStream.getAudioTracks().some((track) => track.enabled);
      detachVoiceAgentMic(session);
      setVoiceAgentMicEnabled(session, true);
      return {
        stream: session.micStream,
        release: () => {
          const current = sessionRef.current;
          if (!current) return;
          setVoiceAgentMicEnabled(current, micEnabledBeforeNotesRef.current);
          attachVoiceAgentMic(current);
        },
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return {
      stream,
      release: () => {
        stream.getTracks().forEach((track) => track.stop());
      },
    };
  }, []);

  return {
    screen,
    mode,
    errorMessage,
    setup,
    transcript,
    adviceTranscript,
    checkedItems,
    feedback,
    remainingSeconds,
    userSpeaking,
    assistantSpeaking,
    coachingActive,
    askMoreOpen,
    history,
    start,
    endStationEarly,
    beginCoaching,
    beginDeepDive,
    beginDeepDiveQuestions,
    beginAskMore,
    startAskMoreFromHistory,
    closeAskMore,
    toggleChecklistItem,
    goBack,
    reset,
    acquireNoteMic,
  };
}
