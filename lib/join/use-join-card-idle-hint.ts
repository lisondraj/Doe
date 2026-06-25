"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Show the hint only during the first 10s without card interaction. */
const INITIAL_HINT_MS = 10000;
/** Matches `join-card-idle-blur-pulse` duration — two blur cycles. */
const PULSE_MS = 1500;
const PULSE_INTERVAL_MS = 3200;

export function useJoinCardIdleHint({
  enabled,
  resetEpoch,
}: {
  enabled: boolean;
  resetEpoch: number;
}) {
  const [hasContacted, setHasContacted] = useState(false);
  const [initialWindowExpired, setInitialWindowExpired] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const mountTimeRef = useRef(Date.now());
  const pulseEndTimerRef = useRef<number | null>(null);
  const pulseIntervalRef = useRef<number | null>(null);
  const initialWindowTimerRef = useRef<number | null>(null);

  const clearPulseTimers = useCallback(() => {
    if (pulseEndTimerRef.current !== null) {
      window.clearTimeout(pulseEndTimerRef.current);
      pulseEndTimerRef.current = null;
    }
    if (pulseIntervalRef.current !== null) {
      window.clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setHasContacted(false);
    setInitialWindowExpired(false);
    setIsPulsing(false);
    mountTimeRef.current = Date.now();
    clearPulseTimers();

    if (initialWindowTimerRef.current !== null) {
      window.clearTimeout(initialWindowTimerRef.current);
    }
    initialWindowTimerRef.current = window.setTimeout(() => {
      setInitialWindowExpired(true);
      setIsPulsing(false);
      clearPulseTimers();
      initialWindowTimerRef.current = null;
    }, INITIAL_HINT_MS);

    return () => {
      if (initialWindowTimerRef.current !== null) {
        window.clearTimeout(initialWindowTimerRef.current);
        initialWindowTimerRef.current = null;
      }
      clearPulseTimers();
    };
  }, [resetEpoch, clearPulseTimers]);

  const registerContact = useCallback(() => {
    setHasContacted(true);
    setIsPulsing(false);
    clearPulseTimers();
  }, [clearPulseTimers]);

  const bumpActivity = useCallback(() => {
    // Pointer/focus on the card counts as interaction for dismissing the hint.
  }, []);

  const showIdleHint = enabled && !hasContacted && !initialWindowExpired;

  useEffect(() => {
    if (!showIdleHint) {
      setIsPulsing(false);
      clearPulseTimers();
      return;
    }

    const triggerPulse = () => {
      if (Date.now() - mountTimeRef.current >= INITIAL_HINT_MS) return;
      setIsPulsing(true);
      if (pulseEndTimerRef.current !== null) {
        window.clearTimeout(pulseEndTimerRef.current);
      }
      pulseEndTimerRef.current = window.setTimeout(() => {
        setIsPulsing(false);
        pulseEndTimerRef.current = null;
      }, PULSE_MS);
    };

    triggerPulse();
    pulseIntervalRef.current = window.setInterval(triggerPulse, PULSE_INTERVAL_MS);

    return () => {
      clearPulseTimers();
    };
  }, [showIdleHint, clearPulseTimers]);

  return { showIdleHint, isPulsing, registerContact, bumpActivity };
}
