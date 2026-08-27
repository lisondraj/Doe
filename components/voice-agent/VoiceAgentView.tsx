"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { VoiceAgentLessonPage } from "@/components/voice-agent/VoiceAgentLessonPage";
import { VoiceAgentNotesPanel } from "@/components/voice-agent/VoiceAgentNotesPanel";
import "@/lib/voice-agent/voice-agent-page.css";
import { fetchVoiceAgentLesson } from "@/lib/voice-agent/voice-agent-lesson";
import { upsertVoiceAgentHistory } from "@/lib/voice-agent/voice-agent-history";
import { useVoiceAgentAuth } from "@/lib/voice-agent/use-voice-agent-auth";
import { useVoiceAgentSession } from "@/lib/voice-agent/use-voice-agent-session";
import type {
  VoiceAgentHistoryRecord,
  VoiceAgentLesson,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";
import {
  VOICE_AGENT_MODE_LABELS,
  VOICE_AGENT_STATION_LABELS,
} from "@/lib/voice-agent/voice-agent-types";

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatHistoryWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function historyMeta(record: VoiceAgentHistoryRecord): string {
  const when = formatHistoryWhen(record.endedAt || record.startedAt);
  if (record.mode === "learn") {
    return [VOICE_AGENT_MODE_LABELS.learn, when].filter(Boolean).join(" · ");
  }
  const station = record.stationType ? VOICE_AGENT_STATION_LABELS[record.stationType] : null;
  return [VOICE_AGENT_MODE_LABELS.practice, station, when].filter(Boolean).join(" · ");
}

function visibleEntries(transcript: readonly VoiceAgentTranscriptEntry[]): VoiceAgentTranscriptEntry[] {
  return transcript.filter((entry) => {
    const text = entry.text.trim();
    if (!text) return false;
    const normalized = text.toLowerCase();
    return (
      !normalized.includes("missing required parameter") &&
      !normalized.startsWith("missing required") &&
      !normalized.includes("invalid_request_error") &&
      !normalized.includes("unknown parameter")
    );
  });
}

function BrandBar({
  showBack,
  onBack,
  notesOpen,
  onToggleNotes,
  onWordmarkClick,
}: {
  showBack?: boolean;
  onBack?: () => void;
  notesOpen?: boolean;
  onToggleNotes?: () => void;
  onWordmarkClick?: () => void;
}) {
  return (
    <div className="voice-agent-page__brand">
      <button
        type="button"
        className="voice-agent-page__wordmark"
        aria-label="OSCE home"
        onClick={onWordmarkClick}
      >
        Doe
      </button>
      <div className="voice-agent-page__brand-actions">
        {showBack ? (
          <button type="button" className="voice-agent-page__back" onClick={onBack}>
            Back
          </button>
        ) : null}
        {onToggleNotes ? (
          <button
            type="button"
            className="voice-agent-page__notes-toggle"
            data-open={notesOpen ? "true" : "false"}
            aria-pressed={notesOpen ? true : false}
            onClick={onToggleNotes}
          >
            {notesOpen ? "Close" : "Notes"}
          </button>
        ) : (
          <span className="voice-agent-page__kicker">OSCE Voice Coach</span>
        )}
      </div>
    </div>
  );
}

function ConfirmHomeModal({
  open,
  timedSession,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  timedSession: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="voice-agent-page__confirm" role="dialog" aria-modal="true" aria-labelledby="voice-agent-home-confirm-title">
      <div className="voice-agent-page__confirm-card">
        <h2 id="voice-agent-home-confirm-title" className="voice-agent-page__feedback-title">
          {timedSession ? "End this station?" : "Go to home?"}
        </h2>
        <p className="voice-agent-page__feedback-summary">
          {timedSession
            ? "This timed station is still running. Leaving now will end it early. Progress so far will be saved."
            : "Return to the OSCE home? You can reopen this from chat history."}
        </p>
        <div className="voice-agent-page__confirm-actions">
          <button type="button" className="voice-agent-page__cta voice-agent-page__cta--ghost" onClick={onCancel}>
            Stay
          </button>
          <button type="button" className="voice-agent-page__cta" onClick={onConfirm}>
            {timedSession ? "End station & go home" : "Go home"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TranscriptThread({
  entries,
  empty,
}: {
  entries: readonly VoiceAgentTranscriptEntry[];
  empty?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    root.scrollTop = root.scrollHeight;
  }, [entries]);

  return (
    <div ref={scrollerRef} className="voice-agent-page__transcript voice-agent-page__transcript--full">
      <div className="voice-agent-page__transcript-log">
        {entries.length === 0 ? (
          <p className="voice-agent-page__hint">{empty ?? "No spoken turns were captured."}</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`voice-agent-page__bubble voice-agent-page__bubble--${entry.role}`}
            >
              {entry.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function VoiceAgentView() {
  const { user, ready, signIn, signOut } = useVoiceAgentAuth();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const media = window.matchMedia("(min-width: 900px)");

    const apply = () => {
      const desktop = media.matches;
      html.setAttribute("data-voice-agent-layout", desktop ? "desktop" : "phone");
      if (desktop) {
        html.setAttribute("data-layout", "desktop");
        html.removeAttribute("data-doeforvc-always-phone");
        body.classList.add("desktop-route");
      } else {
        html.removeAttribute("data-layout");
        body.classList.remove("desktop-route");
      }
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      html.removeAttribute("data-voice-agent-layout");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    };
  }, []);

  if (!ready) {
    return (
      <div className="voice-agent-page">
        <div className="voice-agent-page__frame">
          <div className="voice-agent-page__scroll">
            <BrandBar />
            <div className="voice-agent-page__hero">
              <div className="voice-agent-page__orb-wrap" data-state="assistant">
                <div className="voice-agent-page__orb" />
              </div>
              <p className="voice-agent-page__connecting-label">Loading…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <VoiceAgentLogin onSignIn={signIn} />;
  }

  return <VoiceAgentApp onSignOut={() => void signOut()} />;
}

function VoiceAgentLogin({
  onSignIn,
}: {
  onSignIn: (username: string, password: string) => Promise<string | null>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = await onSignIn(username, password);
    if (message) setError(message);
    setSubmitting(false);
  };

  return (
    <div className="voice-agent-page">
      <div className="voice-agent-page__frame">
        <div className="voice-agent-page__scroll">
          <BrandBar />
          <div className="voice-agent-page__home">
            <div className="voice-agent-page__hero">
              <div className="voice-agent-page__orb-wrap" data-state="idle">
                <div className="voice-agent-page__orb" />
              </div>
              <h1 className="voice-agent-page__title">Sign in to practice.</h1>
              <p className="voice-agent-page__subtitle">
                Chat history is saved to your account so you can reopen past sessions.
              </p>
              <form className="voice-agent-page__login" onSubmit={(event) => void submit(event)}>
                <label className="voice-agent-page__field">
                  <span>Username</span>
                  <input
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={submitting}
                  />
                </label>
                <label className="voice-agent-page__field">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={submitting}
                  />
                </label>
                {error ? <p className="voice-agent-page__error">{error}</p> : null}
                <button type="submit" className="voice-agent-page__cta" disabled={submitting}>
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceAgentApp({ onSignOut }: { onSignOut: () => void }) {
  const {
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
    lesson,
    lessonLoading,
    lessonError,
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
    reloadLesson,
  } = useVoiceAgentSession();

  const [selectedHistory, setSelectedHistory] = useState<VoiceAgentHistoryRecord | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [homeConfirmOpen, setHomeConfirmOpen] = useState(false);
  const [historyLesson, setHistoryLesson] = useState<VoiceAgentLesson | null>(null);
  const [historyLessonLoading, setHistoryLessonLoading] = useState(false);
  const [historyLessonError, setHistoryLessonError] = useState<string | null>(null);
  const [historyLessonRetry, setHistoryLessonRetry] = useState(0);

  const orbState = userSpeaking ? "user" : assistantSpeaking ? "assistant" : "idle";
  const isLowTime = remainingSeconds > 0 && remainingSeconds <= 30;
  const hasTranscript = transcript.some((entry) => entry.text.trim());
  const showBack = askMoreOpen || selectedHistory !== null || screen !== "start";

  const sessionEntries = useMemo(() => visibleEntries(transcript), [transcript]);
  const adviceEntries = useMemo(() => visibleEntries(adviceTranscript), [adviceTranscript]);

  useEffect(() => {
    if (screen !== "start") setSelectedHistory(null);
  }, [screen]);

  useEffect(() => {
    if (!selectedHistory) {
      setHistoryLesson(null);
      setHistoryLessonLoading(false);
      setHistoryLessonError(null);
      return;
    }
    if (selectedHistory.lesson) {
      setHistoryLesson(selectedHistory.lesson);
      setHistoryLessonLoading(false);
      setHistoryLessonError(null);
      return;
    }
    if (selectedHistory.mode !== "learn") {
      setHistoryLesson(null);
      setHistoryLessonLoading(false);
      setHistoryLessonError(null);
      return;
    }
    let cancelled = false;
    setHistoryLessonLoading(true);
    setHistoryLessonError(null);
    const record = selectedHistory;
    void fetchVoiceAgentLesson(record.topic, "learn")
      .then(async (generated) => {
        if (cancelled) return;
        setHistoryLesson(generated);
        await upsertVoiceAgentHistory({ ...record, lesson: generated });
        if (!cancelled) setSelectedHistory((current) => (current?.id === record.id ? { ...current, lesson: generated } : current));
      })
      .catch((error) => {
        if (cancelled) return;
        setHistoryLesson(null);
        setHistoryLessonError(error instanceof Error ? error.message : "Could not generate the teaching page.");
      })
      .finally(() => {
        if (!cancelled) setHistoryLessonLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHistory?.id, selectedHistory?.lesson, selectedHistory?.mode, selectedHistory?.topic, historyLessonRetry]);

  const handleBack = () => {
    if (homeConfirmOpen) {
      setHomeConfirmOpen(false);
      return;
    }
    if (notesOpen) {
      setNotesOpen(false);
      return;
    }
    if (askMoreOpen) {
      closeAskMore();
      return;
    }
    if (selectedHistory && screen === "start") {
      setSelectedHistory(null);
      return;
    }
    goBack();
  };

  const atCoachHome = screen === "start" && !selectedHistory && !askMoreOpen && !notesOpen;
  const timedSessionLive =
    mode === "practice" && screen === "session" && Boolean(setup) && remainingSeconds > 0;

  const requestGoHome = () => {
    if (atCoachHome) return;
    setHomeConfirmOpen(true);
  };

  const confirmGoHome = () => {
    setHomeConfirmOpen(false);
    setNotesOpen(false);
    if (askMoreOpen) closeAskMore();
    setSelectedHistory(null);
    if (screen !== "start") reset();
  };

  return (
    <div className="voice-agent-page">
      <div className="voice-agent-page__frame">
        <div className="voice-agent-page__scroll">
          <BrandBar
            showBack={showBack}
            onBack={handleBack}
            notesOpen={notesOpen}
            onToggleNotes={() => setNotesOpen((open) => !open)}
            onWordmarkClick={requestGoHome}
          />

          {screen === "start" && !selectedHistory && (
            <div className="voice-agent-page__home">
              <div className="voice-agent-page__hero">
                <div className="voice-agent-page__orb-wrap" data-state="idle">
                  <div className="voice-agent-page__orb" />
                </div>
                <h1 className="voice-agent-page__title">Practice your OSCE, out loud.</h1>
                <p className="voice-agent-page__subtitle">
                  Run a timed station with Dr. Osler, or start a learning session on any topic —
                  history questions, DDX, investigations and management, then the top 10 examiner
                  questions.
                </p>
                <div className="voice-agent-page__cta-stack">
                  <button
                    type="button"
                    className="voice-agent-page__cta"
                    onClick={() => {
                      void start("practice");
                    }}
                  >
                    Start Practice
                  </button>
                  <button
                    type="button"
                    className="voice-agent-page__cta voice-agent-page__cta--secondary"
                    onClick={() => {
                      void start("learn");
                    }}
                  >
                    Start Learning Section
                  </button>
                </div>
                <p className="voice-agent-page__hint">Requires microphone access.</p>
              </div>

              <section className="voice-agent-page__history" aria-label="Chat history">
                <h2 className="voice-agent-page__history-heading">Chat history</h2>
                {history.length === 0 ? (
                  <p className="voice-agent-page__hint">No saved sessions yet. Practice or learn to start one.</p>
                ) : (
                  <ul className="voice-agent-page__history-list">
                    {history.map((record) => (
                      <li key={record.id}>
                        <button
                          type="button"
                          className="voice-agent-page__history-item"
                          onClick={() => setSelectedHistory(record)}
                        >
                          <span className="voice-agent-page__history-topic">{record.topic}</span>
                          <span className="voice-agent-page__history-meta">{historyMeta(record)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <button
                type="button"
                className="voice-agent-page__cta voice-agent-page__cta--ghost voice-agent-page__signout"
                onClick={onSignOut}
              >
                Sign out
              </button>
            </div>
          )}

          {screen === "start" && selectedHistory && (
            <div className="voice-agent-page__feedback">
              <div className="voice-agent-page__feedback-body">
                <h2 className="voice-agent-page__feedback-title">{selectedHistory.topic}</h2>
                <p className="voice-agent-page__feedback-summary">{historyMeta(selectedHistory)}</p>

                {selectedHistory.feedback?.overallImpression ? (
                  <p className="voice-agent-page__feedback-summary">
                    {selectedHistory.feedback.overallImpression}
                  </p>
                ) : null}

                {selectedHistory.feedback && selectedHistory.feedback.strengths.length > 0 && (
                  <div className="voice-agent-page__feedback-card">
                    <h3>What went well</h3>
                    <ul>
                      {selectedHistory.feedback.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedHistory.feedback && selectedHistory.feedback.improvements.length > 0 && (
                  <div className="voice-agent-page__feedback-card">
                    <h3>What to improve</h3>
                    <ul>
                      {selectedHistory.feedback.improvements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedHistory.mode === "learn" || selectedHistory.lesson ? (
                  <VoiceAgentLessonPage
                    lesson={historyLesson ?? selectedHistory.lesson}
                    loading={historyLessonLoading}
                    topic={selectedHistory.topic}
                    error={historyLessonError}
                    onRetry={() => setHistoryLessonRetry((value) => value + 1)}
                  />
                ) : (
                  <div className="voice-agent-page__split">
                    <div className="voice-agent-page__transcript-block">
                      <h3 className="voice-agent-page__transcript-heading">Transcript</h3>
                      <TranscriptThread entries={selectedHistory.transcript} />
                    </div>

                    {(selectedHistory.adviceTranscript?.length ?? 0) > 0 && (
                      <div className="voice-agent-page__transcript-block">
                        <h3 className="voice-agent-page__transcript-heading">Extra advice</h3>
                        <TranscriptThread entries={selectedHistory.adviceTranscript} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="voice-agent-page__actions">
                <button
                  type="button"
                  className="voice-agent-page__cta"
                  onClick={() => {
                    void startAskMoreFromHistory(selectedHistory);
                  }}
                >
                  Ask more about this session
                </button>
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={() => setSelectedHistory(null)}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {screen === "connecting" && (
            <div className="voice-agent-page__hero">
              <div className="voice-agent-page__orb-wrap" data-state="assistant">
                <div className="voice-agent-page__orb" />
              </div>
              <p className="voice-agent-page__connecting-label">
                {mode === "learn" ? "Connecting to your teacher…" : "Connecting to your examiner…"}
              </p>
              <button type="button" className="voice-agent-page__cta voice-agent-page__cta--ghost" onClick={handleBack}>
                Back
              </button>
            </div>
          )}

          {screen === "error" && (
            <div className="voice-agent-page__hero">
              <p className="voice-agent-page__error">
                {errorMessage || "Something went wrong starting the voice agent."}
              </p>
              <div className="voice-agent-page__cta-stack">
                <button
                  type="button"
                  className="voice-agent-page__cta"
                  onClick={() => {
                    void start(mode);
                  }}
                >
                  Try again
                </button>
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {screen === "session" && !setup && (
            <div
              className={`voice-agent-page__configuring${
                hasTranscript
                  ? " voice-agent-page__configuring--live"
                  : " voice-agent-page__configuring--empty"
              }`}
            >
              {!hasTranscript && (
                <>
                  <div className="voice-agent-page__orb-wrap" data-state={orbState}>
                    <div className="voice-agent-page__orb" />
                  </div>
                  <p className="voice-agent-page__subtitle">
                    {mode === "learn"
                      ? "Answer with your voice: what topic would you like to learn about?"
                      : "Answer with your voice: how many minutes, what topic, and whether this is a history, physical exam, or management & counseling station."}
                  </p>
                </>
              )}
              {hasTranscript && (
                <>
                  <div className="voice-agent-page__status-row">
                    <div className="voice-agent-page__mic-row">
                      <span className="voice-agent-page__mic-dot" data-active={userSpeaking} />
                      {userSpeaking
                        ? "Listening…"
                        : assistantSpeaking
                          ? mode === "learn"
                            ? "Teacher speaking…"
                            : "Examiner speaking…"
                          : "Mic live"}
                    </div>
                    <div
                      className="voice-agent-page__orb-wrap"
                      data-state={orbState}
                      style={{ width: "2.8rem", height: "2.8rem" }}
                    >
                      <div className="voice-agent-page__orb" style={{ width: "1.8rem", height: "1.8rem" }} />
                    </div>
                  </div>
                  <TranscriptThread entries={sessionEntries} />
                </>
              )}
              <div className="voice-agent-page__footer">
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {screen === "session" && setup && (
            <div className="voice-agent-page__session">
              <div className="voice-agent-page__status-row">
                <span className="voice-agent-page__badge">
                  {VOICE_AGENT_STATION_LABELS[setup.stationType]}
                </span>
                <span
                  className={`voice-agent-page__timer${
                    isLowTime ? " voice-agent-page__timer--low" : ""
                  }`}
                >
                  {formatClock(remainingSeconds)}
                </span>
              </div>

              <h2 className="voice-agent-page__topic">{setup.topic}</h2>

              {setup.stationType === "physical_exam" && setup.checklist.length > 0 && (
                <ul className="voice-agent-page__checklist">
                  {setup.checklist.map((item) => {
                    const done = checkedItems.has(item);
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          className="voice-agent-page__checklist-item"
                          data-done={done}
                          onClick={() => toggleChecklistItem(item)}
                        >
                          <span className="voice-agent-page__checklist-check">{done ? "✓" : ""}</span>
                          <span className="voice-agent-page__checklist-label">{item}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <TranscriptThread entries={sessionEntries} />

              <div className="voice-agent-page__footer">
                <div className="voice-agent-page__mic-row">
                  <span className="voice-agent-page__mic-dot" data-active={userSpeaking} />
                  {userSpeaking ? "Listening…" : assistantSpeaking ? "Examiner speaking…" : "Mic live"}
                </div>
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={endStationEarly}
                >
                  End station &amp; get feedback
                </button>
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {screen === "feedback" && feedback && (
            <div className="voice-agent-page__feedback">
              <div className="voice-agent-page__feedback-body">
                <h2 className="voice-agent-page__feedback-title">Station complete</h2>
                <p className="voice-agent-page__feedback-summary">{feedback.overallImpression}</p>

                {feedback.strengths.length > 0 && (
                  <div className="voice-agent-page__feedback-card">
                    <h3>What went well</h3>
                    <ul>
                      {feedback.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.improvements.length > 0 && (
                  <div className="voice-agent-page__feedback-card">
                    <h3>What to improve</h3>
                    <ul>
                      {feedback.improvements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="voice-agent-page__transcript-block">
                  <h3 className="voice-agent-page__transcript-heading">Transcript</h3>
                  <TranscriptThread entries={sessionEntries} empty="No spoken turns were captured." />
                </div>
              </div>

              <div className="voice-agent-page__actions">
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--secondary"
                  onClick={beginDeepDive}
                >
                  Deep dive this topic
                </button>
                <button type="button" className="voice-agent-page__cta" onClick={beginCoaching}>
                  Ask more about this session
                </button>
                {errorMessage && <p className="voice-agent-page__error">{errorMessage}</p>}
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {(screen === "deepdive" || screen === "learning") && (
            <div className="voice-agent-page__feedback">
              <div className="voice-agent-page__feedback-body">
                <h2 className="voice-agent-page__feedback-title">
                  {screen === "learning" ? "Learning" : "Deep dive"}
                  {setup?.topic ? ` · ${setup.topic}` : ""}
                </h2>
                <p className="voice-agent-page__feedback-summary">
                  Bullet-first OSCE teaching. Tap Ask more to talk it through.
                </p>
                <VoiceAgentLessonPage
                  lesson={lesson}
                  loading={lessonLoading}
                  topic={setup?.topic}
                  error={lessonError}
                  onRetry={reloadLesson}
                />
              </div>

              <div className="voice-agent-page__actions">
                <button
                  type="button"
                  className="voice-agent-page__cta"
                  onClick={screen === "learning" ? beginAskMore : beginDeepDiveQuestions}
                >
                  Ask more about this session
                </button>
                {errorMessage && <p className="voice-agent-page__error">{errorMessage}</p>}
                <button
                  type="button"
                  className="voice-agent-page__cta voice-agent-page__cta--ghost"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {askMoreOpen && (
          <div className="voice-agent-page__modal" role="dialog" aria-modal="true" aria-label="Ask more about this session">
            <BrandBar
              showBack
              onBack={closeAskMore}
              notesOpen={notesOpen}
              onToggleNotes={() => setNotesOpen((open) => !open)}
              onWordmarkClick={requestGoHome}
            />
            <h2 className="voice-agent-page__feedback-title">Ask more about this session</h2>
            <p className="voice-agent-page__feedback-summary">
              {setup?.topic ? `${setup.topic} — ` : ""}voice follow-up. Close anytime; it saves to this session.
            </p>
            <div
              className={`voice-agent-page__modal-body${
                screen === "learning" || screen === "deepdive" || mode === "learn"
                  ? " voice-agent-page__modal-body--single"
                  : ""
              }`}
            >
              {screen !== "learning" && screen !== "deepdive" && mode !== "learn" ? (
                <section className="voice-agent-page__modal-pane">
                  <h3 className="voice-agent-page__transcript-heading">Transcript</h3>
                  <TranscriptThread entries={sessionEntries} />
                </section>
              ) : null}
              <section className="voice-agent-page__modal-pane">
                <h3 className="voice-agent-page__transcript-heading">Extra advice</h3>
                <TranscriptThread
                  entries={adviceEntries}
                  empty="Ask anything — extra advice will show up here."
                />
              </section>
            </div>
            <div className="voice-agent-page__actions">
              <div className="voice-agent-page__coaching">
                <div className="voice-agent-page__mic-row">
                  <span className="voice-agent-page__mic-dot" data-active={userSpeaking} />
                  {userSpeaking
                    ? "Listening…"
                    : assistantSpeaking
                      ? "Coach speaking…"
                      : "Mic live — ask more"}
                </div>
              </div>
              {errorMessage && <p className="voice-agent-page__error">{errorMessage}</p>}
              <button
                type="button"
                className="voice-agent-page__cta voice-agent-page__cta--ghost"
                onClick={closeAskMore}
              >
                Back
              </button>
            </div>
          </div>
        )}

        <VoiceAgentNotesPanel
          open={notesOpen}
          onClose={() => setNotesOpen(false)}
          onWordmarkClick={requestGoHome}
          hintTopic={setup?.topic || selectedHistory?.topic}
          hintCategory={setup?.stationType ?? selectedHistory?.stationType}
          acquireNoteMic={acquireNoteMic}
        />

        <ConfirmHomeModal
          open={homeConfirmOpen}
          timedSession={timedSessionLive}
          onCancel={() => setHomeConfirmOpen(false)}
          onConfirm={confirmGoHome}
        />
      </div>
    </div>
  );
}
