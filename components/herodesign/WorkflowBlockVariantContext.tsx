"use client";

import { createContext, useContext } from "react";
import { workflowBlockTheme, type WorkflowBlockVariant } from "@/lib/herodesign/workflowBlockTheme";

const WorkflowBlockVariantContext = createContext<WorkflowBlockVariant>("dark");

export function WorkflowBlockVariantProvider({
  variant,
  children,
}: {
  variant: WorkflowBlockVariant;
  children: React.ReactNode;
}) {
  return (
    <WorkflowBlockVariantContext.Provider value={variant}>{children}</WorkflowBlockVariantContext.Provider>
  );
}

export function useWorkflowBlockTheme() {
  return workflowBlockTheme(useContext(WorkflowBlockVariantContext));
}
