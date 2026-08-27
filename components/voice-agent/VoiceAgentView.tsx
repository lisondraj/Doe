"use client";

import { useMemo, useState } from "react";

import "@/lib/voice-agent/voice-agent-page.css";
import { useVoiceAgentSession } from "@/lib/voice-agent/use-voice-agent-session";
import { VOICE_AGENT_STATION_LABELS } from "@/lib/voice-agent/voice-agent-types";

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function VoiceAgentView() {
  const {
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
  } = useVoiceAgentSession();

  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const orbState = userSpeaking ? "user" : assistantSpeaking ? "assistant" : "idle";
  const isLowTime = remainingSeconds > 0 && remainingSeconds <= 30;

  const visibleTranscript = useMemo(() => transcript.filter((entry) => entry.text.trim()), [
    transcript,
  ]);

  return (
    <div className="voice-agent-page">
      <div className="voice-agent-page__frame">
        <div className="voice-agent-page__scroll">
          <div className="voice-agent-page__brand">
            <span className="voice-agent-page__wordmark">Doe</span>
            <span className="voice-agent-page__kicker">OSCE Voice Coach</span>
          </div>

          {screen === "start" && (
            <div className="voice-agent-page__hero">
              <div className="voice-agent-page__orb-wrap" data-state="idle">
                <div className="voice-agent-page__orb" />
              </div>
              <h1 className="voice-agent-page__title">Practice your OSCE, out loud.</h1>
              <p className="voice-agent-page__subtitle">
                Tap start, then tell your examiner the duration, topic, and station type by voice.
                History, physical exam, or management &amp; counseling — Dr. Osler will run the
                station with you and give a spoken debrief at the end.
              </p>
              <button
                type="button"
                className="voice-agent-page__cta"
                onClick={() => {
                  void start();
                }}
              >
                Start session
              </button>
              <p className="voice-agent-page__hint">Requires microphone access.</p>
            </div>
          )}

          {screen === "connecting" && (
            <div className="voice-agent-page__hero">
              <div className="voice-agent-page__orb-wrap" data-state="assistant">
                <div className="voice-agent-page__orb" />
              </div>
              <p className="voice-agent-page__connecting-label">Connecting to your examiner…</p>
            </div>
          )}

          {screen === "error" && (
            <div className="voice-agent-page__hero">
              <p className="voice-agent-page__error">
                {errorMessage || "Something went wrong starting the voice agent."}
              </p>
              <button
                type="button"
                className="voice-agent-page__cta"
                onClick={() => {
                  void start();
                }}
              >
                Try again
              </button>
            </div>
          )}

          {screen === "session" && !setup && (
            <div className="voice-agent-page__configuring">
              <div className="voice-agent-page__orb-wrap" data-state={orbState}>
                <div className="voice-agent-page__orb" />
              </div>
              <p className="voice-agent-page__subtitle">
                Answer with your voice: how many minutes, what topic, and whether this is a
                history, physical exam, or management &amp; counseling station.
              </p>
              <div className="voice-agent-page__transcript" style={{ flex: "none", maxHeight: "26vh" }}>
                {visibleTranscript.slice(-6).map((entry) => (
                  <div
                    key={entry.id}
                    className={`voice-agent-page__bubble voice-agent-page__bubble--${entry.role}`}
                  >
                    {entry.text}
                  </div>
                ))}
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

              <div className="voice-agent-page__transcript">
                {visibleTranscript.slice(-12).map((entry) => (
                  <div
                    key={entry.id}
                    className={`voice-agent-page__bubble voice-agent-page__bubble--${entry.role}`}
                  >
                    {entry.text}
                  </div>
                ))}
              </div>

              <div className="voice-agent-page__footer">
                <div className="voice-agent-page__orb-wrap" data-state={orbState} style={{ width: "5.5rem", height: "5.5rem" }}>
                  <div className="voice-agent-page__orb" style={{ width: "3.6rem", height: "3.6rem" }} />
                </div>
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
              </div>
            </div>
          )}

          {screen === "feedback" && feedback && (
            <div className="voice-agent-page__feedback">
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

              <button
                type="button"
                className="voice-agent-page__transcript-toggle"
                onClick={() => setShowFullTranscript((value) => !value)}
              >
                {showFullTranscript ? "Hide full transcript" : "Show full transcript"}
              </button>

              {showFullTranscript && (
                <div className="voice-agent-page__transcript" style={{ maxHeight: "28vh" }}>
                  {visibleTranscript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`voice-agent-page__bubble voice-agent-page__bubble--${entry.role}`}
                    >
                      {entry.text}
                    </div>
                  ))}
                </div>
              )}

              <button type="button" className="voice-agent-page__cta" onClick={reset}>
                Start new session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
