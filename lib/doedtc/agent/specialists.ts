import { Agent } from "@openai/agents";

import { createDoeDtcSdkTools } from "@/lib/doedtc/agent/tools";
import { doeReplyOutputGuardrail } from "@/lib/doedtc/agent/guardrails";
import { toolsForSpecialist } from "@/lib/doedtc/agent/tool-prompt-registry";
import { DoeReplySchema, resolveDoeDtcAgentModel, type DoeDtcRunContext } from "@/lib/doedtc/agent/types";

const model = () => resolveDoeDtcAgentModel();

function subsetTools(ctx: DoeDtcRunContext, allowed: Set<string>) {
  return createDoeDtcSdkTools(ctx).filter((entry) => allowed.has(entry.name));
}

export function createDoeSpecialistAgents(ctx: DoeDtcRunContext) {
  const sharedInstructions = ctx.instructions;

  const healthRecord = new Agent<DoeDtcRunContext>({
    name: "healthRecord",
    instructions: sharedInstructions,
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("healthRecord")),
  });

  const guides = new Agent<DoeDtcRunContext>({
    name: "guides",
    instructions: sharedInstructions,
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("guides")),
  });

  const scheduling = new Agent<DoeDtcRunContext>({
    name: "scheduling",
    instructions: sharedInstructions,
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("scheduling")),
  });

  const browser = new Agent<DoeDtcRunContext>({
    name: "browser",
    instructions: sharedInstructions,
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("browser")),
  });

  const manager = new Agent<DoeDtcRunContext, typeof DoeReplySchema>({
    name: "Doe",
    instructions: sharedInstructions,
    model: model(),
    outputType: DoeReplySchema,
    outputGuardrails: [doeReplyOutputGuardrail],
    tools: [
      healthRecord.asTool({ toolName: "health_record", toolDescription: "Health chart reads and writes." }),
      guides.asTool({ toolName: "guides", toolDescription: "Visual guide authoring." }),
      scheduling.asTool({ toolName: "scheduling", toolDescription: "Reminders, accountability, and habit workflows." }),
      browser.asTool({ toolName: "browser", toolDescription: "Web research and browser automation." }),
    ],
  });

  return { manager, healthRecord, guides, scheduling, browser };
}
