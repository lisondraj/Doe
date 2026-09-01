import { Agent } from "@openai/agents";

import { createDoeDtcSdkTools } from "@/lib/doedtc/agent/tools";
import { doeReplyOutputGuardrail } from "@/lib/doedtc/agent/guardrails";
import {
  DoePlanSchema,
  buildPlannerInstructionsBlock,
} from "@/lib/doedtc/agent/plan-schema";
import {
  toolsForSpecialist,
  type DoeSpecialistId,
} from "@/lib/doedtc/agent/tool-prompt-registry";
import {
  buildDoePlannerSystemPrompt,
  buildDoeSpecialistSystemPrompt,
} from "@/lib/doedtc/doedtc-agent";
import { DoeReplySchema, resolveDoeDtcAgentModel, type DoeDtcRunContext } from "@/lib/doedtc/agent/types";

const model = () => resolveDoeDtcAgentModel();

function subsetTools(ctx: DoeDtcRunContext, allowed: Set<string>) {
  return createDoeDtcSdkTools(ctx).filter((entry) => allowed.has(entry.name));
}

function specialistInstructions(ctx: DoeDtcRunContext, specialist: DoeSpecialistId): string {
  if (ctx.specialistInstructions?.[specialist]) return ctx.specialistInstructions[specialist]!;
  return ctx.instructions;
}

export function createDoePlannerAgent(ctx: DoeDtcRunContext) {
  const instructions = ctx.plannerInstructions ?? ctx.instructions;
  return new Agent<DoeDtcRunContext, typeof DoePlanSchema>({
    name: "DoePlanner",
    instructions,
    model: model(),
    outputType: DoePlanSchema,
  });
}

export function createDoeSpecialistAgents(ctx: DoeDtcRunContext) {
  const healthRecord = new Agent<DoeDtcRunContext>({
    name: "healthRecord",
    instructions: specialistInstructions(ctx, "healthRecord"),
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("healthRecord")),
  });

  const guides = new Agent<DoeDtcRunContext>({
    name: "guides",
    instructions: specialistInstructions(ctx, "guides"),
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("guides")),
  });

  const scheduling = new Agent<DoeDtcRunContext>({
    name: "scheduling",
    instructions: specialistInstructions(ctx, "scheduling"),
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("scheduling")),
  });

  const browser = new Agent<DoeDtcRunContext>({
    name: "browser",
    instructions: specialistInstructions(ctx, "browser"),
    model: model(),
    tools: subsetTools(ctx, toolsForSpecialist("browser")),
  });

  const manager = new Agent<DoeDtcRunContext, typeof DoeReplySchema>({
    name: "Doe",
    instructions: ctx.plannerInstructions ?? ctx.instructions,
    model: model(),
    outputType: DoePlanSchema,
    tools: [
      healthRecord.asTool({ toolName: "health_record", toolDescription: "Health chart reads and writes." }),
      guides.asTool({ toolName: "guides", toolDescription: "Visual guide authoring." }),
      scheduling.asTool({ toolName: "scheduling", toolDescription: "Reminders, accountability, and habit workflows." }),
      browser.asTool({ toolName: "browser", toolDescription: "Web research and browser automation." }),
    ],
  });

  return { manager, planner: createDoePlannerAgent(ctx), healthRecord, guides, scheduling, browser };
}

export function buildSpecialistInstructionMap(
  ctx: Omit<DoeDtcRunContext, "specialistInstructions" | "plannerInstructions"> & {
    promptParams: Parameters<typeof buildDoePlannerSystemPrompt>[0];
  },
): Pick<DoeDtcRunContext, "plannerInstructions" | "specialistInstructions" | "instructions"> {
  const specialists: DoeSpecialistId[] = ["healthRecord", "guides", "scheduling", "browser"];
  const specialistInstructions = Object.fromEntries(
    specialists.map((id) => [id, buildDoeSpecialistSystemPrompt(id, ctx.promptParams)]),
  ) as Record<DoeSpecialistId, string>;
  return {
    plannerInstructions: `${buildDoePlannerSystemPrompt(ctx.promptParams)}\n\n${buildPlannerInstructionsBlock()}`,
    specialistInstructions,
    instructions: specialistInstructions.scheduling,
  };
}
