"use client";

import { useCallback, useEffect, useState } from "react";

import "@/lib/doedtc/doedtc-watch.css";

type WatchUser = {
  id: string;
  phone: string;
  fullName: string | null;
  status: string;
};

type WatchToolCall = {
  id: string;
  tool_name: string;
  ok: boolean;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
};

type WatchTurn = {
  id: string;
  inbound_text: string;
  status: string;
  read_at: string | null;
  working_at: string | null;
  done_at: string | null;
  reply_text: string | null;
  thread_reply: boolean;
  final_reaction: string | null;
  error: string | null;
  created_at: string;
  tool_calls: WatchToolCall[];
};

type WatchBrowserJob = {
  id: string;
  status: string;
  allowed_host: string | null;
  intent: string;
  updated_at: string;
  ageSeconds: number;
  stale: boolean;
};

type WatchPayload = {
  ok: boolean;
  user?: WatchUser;
  turns?: WatchTurn[];
  browserJobs?: WatchBrowserJob[];
  error?: string;
};

function formatTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function statusPillClass(status: string): string {
  if (status === "failed") return "doe-watch__pill doe-watch__pill--failed";
  if (status === "done") return "doe-watch__pill doe-watch__pill--done";
  if (status === "working" || status === "browsing" || status === "read") {
    return "doe-watch__pill doe-watch__pill--working";
  }
  return "doe-watch__pill";
}

export function DoeDtcAgentWatch(props: {
  initialUser: WatchUser | null;
  initialTurns: WatchTurn[];
  initialBrowserJobs: WatchBrowserJob[];
}) {
  const [user, setUser] = useState(props.initialUser);
  const [turns, setTurns] = useState(props.initialTurns);
  const [browserJobs, setBrowserJobs] = useState(props.initialBrowserJobs);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/doedtc/watch", { cache: "no-store" });
      const json = (await response.json()) as WatchPayload;
      if (!json.ok) {
        setError(json.error ?? "Watch feed failed.");
        return;
      }
      setError(null);
      setUser(json.user ?? null);
      setTurns(json.turns ?? []);
      setBrowserJobs(json.browserJobs ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Watch feed failed.");
    }
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [refresh, visible]);

  return (
    <div className="doe-watch">
      <header className="doe-watch__header">
        <div>
          <div className="doe-watch__title">Agent Watch</div>
          <div className="doe-watch__meta">
            {user
              ? `${user.fullName ?? "User"} · ${user.phone} · ${user.status}`
              : "No active user"}
          </div>
        </div>
        <div className="doe-watch__meta">{visible ? "live" : "paused"}</div>
      </header>

      {error ? <div className="doe-watch__lane doe-watch__error">{error}</div> : null}

      <section className="doe-watch__lane">
        <div className="doe-watch__lane-title">Browser lane</div>
        {browserJobs.length === 0 ? (
          <div className="doe-watch__meta">No open browser jobs.</div>
        ) : (
          browserJobs.map((job) => (
            <div key={job.id} className="doe-watch__browser-row">
              <span>{job.status}</span>
              <span>{job.allowed_host ?? "unknown host"}</span>
              <span>{job.intent}</span>
              <span>{job.ageSeconds}s</span>
              {job.stale ? <span className="doe-watch__stale">stale</span> : null}
            </div>
          ))
        )}
      </section>

      <section className="doe-watch__timeline">
        {turns.map((turn) => {
          const live = !["done", "failed"].includes(turn.status);
          return (
            <article
              key={turn.id}
              className={`doe-watch__turn${live ? " doe-watch__turn--live" : ""}`}
            >
              <div className="doe-watch__turn-head">
                <span className={statusPillClass(turn.status)}>{turn.status}</span>
                <span className="doe-watch__meta">{formatTime(turn.created_at)}</span>
              </div>
              <div className="doe-watch__inbound">{turn.inbound_text || "[empty]"}</div>
              <div className="doe-watch__timestamps">
                <span>read {formatTime(turn.read_at)}</span>
                <span>working {formatTime(turn.working_at)}</span>
                <span>done {formatTime(turn.done_at)}</span>
                <span>
                  {turn.thread_reply ? "inline reply" : "no inline reply"}
                  {turn.final_reaction ? ` · ${turn.final_reaction}` : ""}
                </span>
              </div>
              {turn.tool_calls.length > 0 ? (
                <div className="doe-watch__tools">
                  {turn.tool_calls.map((tool) => (
                    <div
                      key={tool.id}
                      className={`doe-watch__tool${tool.ok ? "" : " doe-watch__tool--fail"}`}
                    >
                      {tool.tool_name} · {tool.ok ? "ok" : "fail"}
                      {tool.duration_ms != null ? ` · ${tool.duration_ms}ms` : ""}
                      {tool.error ? ` · ${tool.error}` : ""}
                    </div>
                  ))}
                </div>
              ) : null}
              {turn.reply_text ? (
                <div className="doe-watch__reply">→ {turn.reply_text}</div>
              ) : null}
              {turn.error ? <div className="doe-watch__error">{turn.error}</div> : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
