"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_LISTEN } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcListenSessionRow } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

const MAX_DURATION_MS = 60 * 60 * 1000;

function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type Phase = "idle" | "recording" | "uploading" | "done" | "error";

type DoeDtcListenViewProps = {
  token: string;
  sessionId: string;
  valid: boolean;
  initialSession: DoeDtcListenSessionRow | null;
};

export function DoeDtcListenView({
  token,
  sessionId,
  valid,
  initialSession,
}: DoeDtcListenViewProps) {
  const [phase, setPhase] = useState<Phase>(
    initialSession?.status === "completed" ? "done" : "idle",
  );
  const [elapsed, setElapsed] = useState(initialSession?.duration_seconds ?? 0);
  const [error, setError] = useState("");
  const [session, setSession] = useState(initialSession);
  const [profileHref, setProfileHref] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupStream = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  async function startRecording() {
    setError("");
    try {
      const mime = pickRecorderMime();
      if (!mime) {
        throw new Error("Recording is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start(1000);
      startedAtRef.current = Date.now();
      setElapsed(0);
      setPhase("recording");

      timerRef.current = setInterval(() => {
        if (!startedAtRef.current) return;
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 500);

      maxTimerRef.current = setTimeout(() => {
        void endRecording();
      }, MAX_DURATION_MS);
    } catch (recordError) {
      cleanupStream();
      setPhase("error");
      setError(
        recordError instanceof DOMException && recordError.name === "NotAllowedError"
          ? DOEDTC_LISTEN.micDenied
          : recordError instanceof Error
            ? recordError.message
            : DOEDTC_LISTEN.errorGeneric,
      );
    }
  }

  async function endRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    setPhase("uploading");

    const durationSeconds = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : elapsed;

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    cleanupStream();

    try {
      const mime = recorder.mimeType || pickRecorderMime() || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: mime });
      const form = new FormData();
      form.append("token", token);
      form.append("sessionId", sessionId);
      form.append("durationSeconds", String(durationSeconds));
      form.append("audio", blob, mime.includes("mp4") ? "listen.m4a" : "listen.webm");

      const response = await fetch("/api/doedtc/listen", {
        method: "POST",
        body: form,
      });
      const json = (await response.json()) as {
        ok?: boolean;
        error?: string;
        session?: DoeDtcListenSessionRow;
        profileHref?: string;
      };

      if (!response.ok || !json.ok || !json.session) {
        throw new Error(json.error ?? DOEDTC_LISTEN.errorGeneric);
      }

      setSession(json.session);
      setProfileHref(json.profileHref ?? "");
      setElapsed(json.session.duration_seconds ?? durationSeconds);
      setPhase("done");
    } catch (uploadError) {
      setPhase("error");
      setError(uploadError instanceof Error ? uploadError.message : DOEDTC_LISTEN.errorGeneric);
    }
  }

  if (!valid || !sessionId) {
    return (
      <DoeDtcPageShell>
        <DoeDtcTopBar />
        <div className="doedtc-card doedtc-card--flat">
          <strong>{DOEDTC_LISTEN.invalidTokenTitle}</strong>
          <p>{DOEDTC_LISTEN.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar href={profileHref || "/doedtc"} />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_LISTEN.pageTitle}</h1>
        <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_LISTEN.subtitle}</p>
      </header>

      <div className="doedtc-card doedtc-card--flat doedtc-listen-panel">
        {phase === "idle" ? (
          <>
            <p className="doedtc-muted">{DOEDTC_LISTEN.maxDurationHint}</p>
            <button className="doedtc-button" type="button" onClick={() => void startRecording()}>
              {DOEDTC_LISTEN.recordLabel}
            </button>
          </>
        ) : null}

        {phase === "recording" ? (
          <>
            <p className="doedtc-listen-status">{DOEDTC_LISTEN.listeningLabel}</p>
            <p className="doedtc-listen-timer">{formatDuration(elapsed)}</p>
            <button className="doedtc-button doedtc-button--secondary" type="button" onClick={() => void endRecording()}>
              {DOEDTC_LISTEN.endCallLabel}
            </button>
          </>
        ) : null}

        {phase === "uploading" ? (
          <>
            <p className="doedtc-listen-status">{DOEDTC_LISTEN.buildingLabel}</p>
            <p className="doedtc-listen-timer">{formatDuration(elapsed)}</p>
          </>
        ) : null}

        {phase === "done" && session ? (
          <>
            <strong>{DOEDTC_LISTEN.savedTitle}</strong>
            <p>{session.summary || DOEDTC_LISTEN.savedBody}</p>
            {session.transcript ? (
              <details className="doedtc-listen-transcript">
                <summary>View transcript</summary>
                <p className="doedtc-body">{session.transcript}</p>
              </details>
            ) : null}
            {profileHref ? (
              <a className="doedtc-button" href={profileHref}>
                {DOEDTC_LISTEN.openProfileLabel}
              </a>
            ) : null}
          </>
        ) : null}

        {phase === "error" ? (
          <>
            <p className="doedtc-error">{error || DOEDTC_LISTEN.errorGeneric}</p>
            <button className="doedtc-button doedtc-button--secondary" type="button" onClick={() => setPhase("idle")}>
              {DOEDTC_LISTEN.recordLabel}
            </button>
          </>
        ) : null}
      </div>
    </DoeDtcPageShell>
  );
}
