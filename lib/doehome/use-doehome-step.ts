"use client";

import { useEffect, useState } from "react";

export function useDoeHomeStep(revealed: boolean, count: number, stepMs: number) {
  const [lit, setLit] = useState(0);
  const [auto, setAuto] = useState(false);
  const complete = lit >= count;

  useEffect(() => {
    if (!revealed) return;
    setLit(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setLit((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, lit, stepMs]);

  return { lit, complete };
}
