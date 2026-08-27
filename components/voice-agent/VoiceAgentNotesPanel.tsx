"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  deleteVoiceAgentNote,
  groupNotesByTopic,
  insertVoiceAgentNote,
  loadVoiceAgentNotes,
} from "@/lib/voice-agent/voice-agent-notes";
import type { VoiceAgentNote, VoiceAgentStationType } from "@/lib/voice-agent/voice-agent-types";
import {
  VOICE_AGENT_NOTE_CATEGORIES,
  VOICE_AGENT_NOTE_CATEGORY_LABELS,
} from "@/lib/voice-agent/voice-agent-types";

export interface NoteMicHandle {
  stream: MediaStream;
  release: () => void;
}

function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function filenameForMime(mime: string): string {
  if (mime.includes("mp4") || mime.includes("aac") || mime.includes("m4a")) return "note.m4a";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "note.mp3";
  return "note.webm";
}

function isStationType(value: unknown): value is VoiceAgentStationType {
  return value === "history" || value === "physical_exam" || value === "management_counseling";
}

export function VoiceAgentNotesPanel({
  open,
  onClose,
  hintTopic,
  hintCategory,
  acquireNoteMic,
}: {
  open: boolean;
  onClose: () => void;
  hintTopic?: string | null;
  hintCategory?: VoiceAgentStationType | null;
  acquireNoteMic: () => Promise<NoteMicHandle>;
}) {
  const [notes, setNotes] = useState<VoiceAgentNote[]>([]);
  const [phase, setPhase] = useState<"idle" | "recording" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const releaseRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  const groups = useMemo(() => groupNotesByTopic(notes), [notes]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void loadVoiceAgentNotes().then((loaded) => {
      if (cancelled) return;
      setNotes(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!groups.length) return;
    if (!openTopic || !groups.some((group) => group.topic === openTopic)) {
      setOpenTopic(groups[0].topic);
    }
  }, [groups, openTopic]);

  useEffect(() => {
    if (open) return;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    releaseRef.current?.();
    releaseRef.current = null;
    setPhase("idle");
    setError(null);
  }, [open]);

  const stopRecording = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  };

  const saveRecording = async (blob: Blob) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setPhase("saving");
    setError(null);
    try {
      const form = new FormData();
      form.append("audio", new File([blob], filenameForMime(blob.type), { type: blob.type || "audio/webm" }));
      form.append("topics", JSON.stringify(Array.from(new Set(notes.map((note) => note.topic)))));
      if (hintTopic) form.append("hintTopic", hintTopic);
      if (hintCategory) form.append("hintCategory", hintCategory);

      const response = await fetch("/api/voice-agent/notes", { method: "POST", body: form });
      const data = (await response.json().catch(() => null)) as {
        text?: unknown;
        topic?: unknown;
        category?: unknown;
        error?: unknown;
      } | null;

      if (!response.ok || !data || typeof data.text !== "string" || typeof data.topic !== "string") {
        throw new Error(typeof data?.error === "string" ? data.error : "Could not save that note.");
      }

      const saved = await insertVoiceAgentNote({
        topic: data.topic,
        category: isStationType(data.category) ? data.category : hintCategory ?? "history",
        text: data.text,
      });
      setNotes(saved);
      setOpenTopic(canonicalDisplayTopic(data.topic, saved));
      setPhase("idle");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save that note.");
      setPhase("idle");
    } finally {
      savingRef.current = false;
    }
  };

  const startRecording = async () => {
    if (phase !== "idle") return;
    setError(null);
    try {
      const handle = await acquireNoteMic();
      releaseRef.current = handle.release;
      const mime = pickRecorderMime();
      const recorder = mime
        ? new MediaRecorder(handle.stream, { mimeType: mime })
        : new MediaRecorder(handle.stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        recorderRef.current = null;
        releaseRef.current?.();
        releaseRef.current = null;
        if (blob.size < 800) {
          setError("I did not catch that — tap Speak note and try again.");
          setPhase("idle");
          return;
        }
        void saveRecording(blob);
      };
      recorder.start(250);
      recorderRef.current = recorder;
      setPhase("recording");
      timeoutRef.current = setTimeout(stopRecording, 45_000);
    } catch {
      releaseRef.current?.();
      releaseRef.current = null;
      setError("Microphone access is required to save a spoken note.");
      setPhase("idle");
    }
  };

  const removeNote = async (id: string) => {
    const next = await deleteVoiceAgentNote(id);
    setNotes(next);
  };

  if (!open) return null;

  return (
    <div className="voice-agent-page__modal voice-agent-page__notes" role="dialog" aria-modal="true" aria-label="Notes">
      <div className="voice-agent-page__brand">
        <Link href="/" className="voice-agent-page__wordmark" aria-label="Doe home">
          Doe
        </Link>
        <div className="voice-agent-page__brand-actions">
          <button
            type="button"
            className="voice-agent-page__notes-toggle"
            data-open="true"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <div className="voice-agent-page__notes-head">
        <h2 className="voice-agent-page__feedback-title">Notes</h2>
        <p className="voice-agent-page__feedback-summary">
          Speak a key point. It is filed by topic, then history, physical exam, or management / counselling.
        </p>
      </div>

      <div className="voice-agent-page__notes-body">
        {groups.length === 0 ? (
          <p className="voice-agent-page__hint">
            No notes yet. Tap Speak note and say something like “chest pain history: ask about radiation to the arm.”
          </p>
        ) : (
          <div className="voice-agent-page__notes-topics">
            {groups.map((group) => {
              const expanded = openTopic === group.topic;
              return (
                <section key={group.topic} className="voice-agent-page__notes-topic">
                  <button
                    type="button"
                    className="voice-agent-page__notes-topic-toggle"
                    aria-expanded={expanded}
                    onClick={() => setOpenTopic(expanded ? null : group.topic)}
                  >
                    <span>{group.topic}</span>
                    <span className="voice-agent-page__notes-count">{group.count}</span>
                  </button>
                  {expanded
                    ? VOICE_AGENT_NOTE_CATEGORIES.map((category) => {
                        const items = group.notesByCategory[category];
                        if (items.length === 0) return null;
                        return (
                          <div key={category} className="voice-agent-page__notes-category">
                            <h3>{VOICE_AGENT_NOTE_CATEGORY_LABELS[category]}</h3>
                            <ul>
                              {items.map((note) => (
                                <li key={note.id}>
                                  <p>{note.text}</p>
                                  <button
                                    type="button"
                                    className="voice-agent-page__notes-delete"
                                    aria-label="Delete note"
                                    onClick={() => void removeNote(note.id)}
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })
                    : null}
                </section>
              );
            })}
          </div>
        )}
      </div>

      <div className="voice-agent-page__actions">
        {error ? <p className="voice-agent-page__error">{error}</p> : null}
        <button
          type="button"
          className="voice-agent-page__cta"
          data-recording={phase === "recording" ? "true" : "false"}
          disabled={phase === "saving"}
          onClick={() => {
            if (phase === "recording") stopRecording();
            else void startRecording();
          }}
        >
          {phase === "recording" ? "Tap to save" : phase === "saving" ? "Saving…" : "Speak note"}
        </button>
        <div className="voice-agent-page__mic-row">
          <span className="voice-agent-page__mic-dot" data-active={phase === "recording"} />
          {phase === "recording"
            ? "Listening… tap again when you are done"
            : phase === "saving"
              ? "Filing that under a topic…"
              : "Microphone captures the note only — the examiner cannot hear it"}
        </div>
      </div>
    </div>
  );
}

function canonicalDisplayTopic(topic: string, notes: readonly VoiceAgentNote[]): string {
  const grouped = groupNotesByTopic(notes);
  return grouped.find((group) => group.topic === topic)?.topic ?? grouped[0]?.topic ?? topic;
}
