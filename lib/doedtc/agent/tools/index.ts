import { tool } from "@openai/agents";
import { z } from "zod";

import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
import { executeDoeDtcTool, DOE_DTC_TOOL_NAMES } from "@/lib/doedtc/agent/tool-dispatch";
import type { DoeDtcRunContext } from "@/lib/doedtc/agent/types";

const STRUCTURED_OUTPUT_ONLY = new Set(["react_to_message", "use_thread_reply"]);

const APPROVAL_TOOLS = new Set([
  "schedule_text",
  "save_guide",
  "start_accountability",
  "start_habit_workflow",
  "request_commit",
]);

const BROWSER_TOOLS = new Set([
  "browser_navigate",
  "browser_act",
  "browser_computer",
  "browser_snapshot",
  "request_vault",
  "request_live_login",
  "show_session",
  "request_commit",
]);

function looseParamsSchema() {
  return z.object({}).passthrough();
}

export function doeDtcToolNames(): readonly string[] {
  return DOE_DTC_TOOL_NAMES;
}

function requireRunContext(runContext: { context: unknown } | undefined): DoeDtcRunContext {
  if (!runContext?.context) {
    throw new Error("Doe agent run context is missing.");
  }
  return runContext.context as DoeDtcRunContext;
}

export function createDoeDtcSdkTools(ctx: DoeDtcRunContext) {
  return DOEDTC_AGENT_TOOLS.filter(
    (entry) => !STRUCTURED_OUTPUT_ONLY.has(entry.function.name),
  ).map((entry) => {
    const name = entry.function.name;
    return tool({
      name,
      description: entry.function.description,
      parameters: looseParamsSchema(),
      needsApproval: APPROVAL_TOOLS.has(name),
      isEnabled: ({ runContext }) => {
        const runtimeCtx = requireRunContext(runContext);
        if (BROWSER_TOOLS.has(name)) {
          return Boolean(runtimeCtx.turnState.activeBrowserJobId);
        }
        if (name === "start_browser_task") {
          return !runtimeCtx.turnState.activeBrowserJobId;
        }
        return true;
      },
      execute: async (args, runContext) => {
        const runtimeCtx = requireRunContext(runContext);
        return executeDoeDtcTool({
          name,
          args: args as Record<string, unknown>,
          ctx: {
            user: runtimeCtx.user,
            inboundText: runtimeCtx.inboundText,
            inboundMessageId: runtimeCtx.inboundMessageId,
            snapshot: runtimeCtx.snapshot,
          },
          state: runtimeCtx.turnState,
        });
      },
    });
  });
}
