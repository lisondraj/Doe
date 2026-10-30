"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AgentAction } from "@/lib/demo/demo-engine";
import type { AgentPayload } from "@/lib/demo/demo-service";
import type { DemoConsent } from "@/lib/demo/demo-types";

const TOKEN_KEY = "doe-demo-token";
const POLL_MS = 3000;
const HEADERS = { "content-type": "application/json", "x-doe-client": "browser" };

type Result = { ok: true; result: Record<string, unknown> } | { ok: false; error: string };

/**
 * The browser agent's session in /demo: connects through the same API other agents use, keeps the token in this
 * browser, polls for clinic updates, and runs actions.
 */
export function useDemoAgent() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<AgentPayload | null>(null);
  const [ready, setReady] = useState(false);
  const tokenRef = useRef<string | null>(null);

  const load = useCallback(async (t: string) => {
    const res = await fetch("/api/demo/v1/session", { headers: { ...HEADERS, authorization: `Bearer ${t}` }, cache: "no-store" });
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      tokenRef.current = null;
      setToken(null);
      setState(null);
      return;
    }
    if (res.ok) setState(await res.json());
  }, []);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setReady(true);
      return;
    }
    tokenRef.current = t;
    setToken(t);
    load(t).finally(() => setReady(true));
  }, [load]);

  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible" && tokenRef.current) load(tokenRef.current).catch(() => undefined);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [token, load]);

  const connect = useCallback(async (consent: DemoConsent, userName: string, check: { website: string; elapsedMs: number }): Promise<Result> => {
    const res = await fetch("/api/demo/v1/connect", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ agent_name: "Browser agent", user_name: userName, consent, website: check.website, elapsed_ms: check.elapsedMs }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Couldn't connect." };
    localStorage.setItem(TOKEN_KEY, data.token);
    tokenRef.current = data.token;
    setToken(data.token);
    setState(data);
    return { ok: true, result: {} };
  }, []);

  const act = useCallback(async (action: AgentAction): Promise<Result> => {
    const t = tokenRef.current;
    if (!t) return { ok: false, error: "Not connected." };
    const res = await fetch("/api/demo/v1/actions", { method: "POST", headers: { ...HEADERS, authorization: `Bearer ${t}` }, body: JSON.stringify(action) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "That didn't work." };
    const { result, ...payload } = data;
    setState(payload as AgentPayload);
    return { ok: true, result: result ?? {} };
  }, []);

  const end = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    tokenRef.current = null;
    setToken(null);
    setState(null);
  }, []);

  return { ready, token, state, connect, act, end };
}
