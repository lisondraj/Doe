"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 5000;
/** Matches `join-card-idle-blur-pulse` duration — two blur cycles. */
const PULSE_MS = 1500;

export function useJoinCardIdleHint({
  enabled,
  resetEpoch,
}: {
  enabled: boolean;
  resetEpoch: number;
}) {
  const [hasContacted, setHasContacted] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const pulseEndTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setHasContacted(false);
    setIsPulsing(false);
    lastActivityRef.current = Date.now();
  }, [resetEpoch]);

  const registerContact = useCallback(() => {
    setHasContacted(true);
    setIsPulsing(false);
    if (pulseEndTimerRef.current !== null) {
      window.clearTimeout(pulseEndTimerRef.current);
      pulseEndTimerRef.current = null;
    }
  }, []);

  const bumpActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isPulsing) setIsPulsing(false);
    if (pulseEndTimerRef.current !== null) {
      window.clearTimeout(pulseEndTimerRef.current);
      pulseEndTimerRef.current = null;
    }
  }, [isPulsing]);

  const showIdleHint = enabled && !hasContacted;

  useEffect(() => {
    if (!showIdleHint) {
      setIsPulsing(false);
      return;
    }

    const tick = () => {
      if (isPulsing) return;
      if (Date.now() - lastActivityRef.current >= IDLE_MS) {
        setIsPulsing(true);
        pulseEndTimerRef.current = window.setTimeout(() => {
          setIsPulsing(false);
          lastActivityRef.current = Date.now();
          pulseEndTimerRef.current = null;
        }, PULSE_MS);
      }
    };

    const interval = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(interval);
      if (pulseEndTimerRef.current !== null) {
        window.clearTimeout(pulseEndTimerRef.current);
        pulseEndTimerRef.current = null;
      }
    };
  }, [showIdleHint, isPulsing]);

  return { showIdleHint, isPulsing, registerContact, bumpActivity };
}
