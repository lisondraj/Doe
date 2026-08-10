"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { PremedLearnMoreModal } from "@/components/premed/PremedLearnMoreModal";

type PremedLearnMoreContextValue = {
  openLearnMoreModal: () => void;
};

const PremedLearnMoreContext = createContext<PremedLearnMoreContextValue | null>(null);

export function PremedLearnMoreProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openLearnMoreModal = useCallback(() => {
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      openLearnMoreModal,
    }),
    [openLearnMoreModal],
  );

  return (
    <PremedLearnMoreContext.Provider value={value}>
      {children}
      <PremedLearnMoreModal open={open} onClose={() => setOpen(false)} />
    </PremedLearnMoreContext.Provider>
  );
}

export function usePremedLearnMoreModal(): PremedLearnMoreContextValue {
  const context = useContext(PremedLearnMoreContext);
  if (!context) {
    throw new Error("usePremedLearnMoreModal must be used within PremedLearnMoreProvider");
  }
  return context;
}
