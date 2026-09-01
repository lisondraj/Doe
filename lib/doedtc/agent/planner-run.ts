import { run } from "@openai/agents";

import { executeDoeDtcTool } from "@/lib/doedtc/agent/tool-dispatch";
import { resolveActionSlots } from "@/lib/doedtc/agent/action-slots";
import { createDoePlannerAgent, createDoeSpecialistAgents } from "@/lib/doedtc/agent/specialists";
import {
  DoePlanSchema,
  type DoePlan,
  workflowGraphFromPlanWorkflow,
} from "@/lib/doedtc/agent/plan-schema";
import type { DoeDtcRunContext } from "@/lib/doedtc/agent/types";
import {
  classifyAgentAction,
  inboundAlreadyAsked,
  validateDoePlan,
} from "@/lib/doedtc/doedtc-agent-policy";
import { setAgentPending } from "@/lib/doedtc/doedtc-pending";

function planTextsThirdParty(plan: DoePlan): boolean {
  return plan.immediate.some((step) => {
    const tool = step.tool.trim();
    return (
      tool === "schedule_text" ||
      tool === "start_habit_workflow" ||
      tool === "start_workflow" ||
      tool === "propose_scheduled_text" ||
      tool === "propose_habit_workflow" ||
      tool === "propose_workflow"
    );
  });
}

export async function runDoePlannerTurn(ctx: DoeDtcRunContext): Promise<DoePlan | null> {
  try {
    const planner = createDoePlannerAgent(ctx);
    const result = await run(planner, ctx.inboundText, { context: ctx, maxTurns: 4 });
    const parsed = DoePlanSchema.safeParse(result.finalOutput);
    if (!parsed.success) {
      console.warn("[doedtc:planner] output failed schema:", parsed.error.message);
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.warn(
      "[doedtc:planner] run failed:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

export async function executeDoePlan(params: {
  plan: DoePlan;
  ctx: DoeDtcRunContext;
}): Promise<{ ok: boolean; reply: string; preservePending?: boolean }> {
  const { plan, ctx } = params;
  const slots = resolveActionSlots({
    inboundText: ctx.inboundText,
    viewerUserId: ctx.user.id,
    members: ctx.snapshot.household.members,
    artifacts: ctx.snapshot.artifacts,
    guides: ctx.snapshot.guides,
  });
  const validation = validateDoePlan(plan, {
    inboundText: ctx.inboundText,
    textsThirdParty: planTextsThirdParty(plan),
    missingSlot: plan.action === "confirm_once" || slots.missingSlot,
    irreversible: plan.immediate.some((step) =>
      ["save_guide", "send_family_invite", "revoke_household_access", "request_commit"].includes(
        step.tool,
      ),
    ),
    emergencyOrDiagnosis: ctx.turnMode?.emergencyOrDiagnosis ?? plan.action === "refuse",
  });

  if (!validation.ok) {
    if (validation.action === "confirm_once") {
      await setAgentPending({
        userId: ctx.user.id,
        kind: "start_workflow",
        commitTool: plan.immediate[0]?.tool ?? "schedule_text",
        args: {
          plan,
          ...(plan.immediate[0]?.args ?? {}),
        },
        summary: plan.intent,
      });
      ctx.turnState.preservePendingOffer = true;
      return { ok: true, reply: plan.reply, preservePending: true };
    }
    return { ok: false, reply: plan.reply || "I can't do that." };
  }

  if (validation.action === "refuse") {
    return { ok: true, reply: plan.reply };
  }

  if (plan.action === "confirm_once") {
    await setAgentPending({
      userId: ctx.user.id,
      kind: "start_workflow",
      commitTool: plan.immediate[0]?.tool ?? "start_workflow",
      args: { plan, ...(plan.immediate[0]?.args ?? {}) },
      summary: plan.intent,
    });
    ctx.turnState.preservePendingOffer = true;
    return { ok: true, reply: plan.reply, preservePending: true };
  }

  for (const step of plan.immediate) {
    try {
      await executeDoeDtcTool({
        name: step.tool,
        args: step.args,
        ctx: {
          user: ctx.user,
          inboundText: ctx.inboundText,
          inboundMessageId: ctx.inboundMessageId,
          snapshot: ctx.snapshot,
          attachmentContext: ctx.attachmentContext,
        },
        state: ctx.turnState,
      });
    } catch (error) {
      console.warn(
        "[doedtc:planner] immediate tool failed:",
        step.tool,
        error instanceof Error ? error.message : String(error),
      );
      return { ok: false, reply: plan.reply };
    }
  }

  if (plan.workflow) {
    const graph = workflowGraphFromPlanWorkflow(plan.workflow);
    if (graph) {
      await executeDoeDtcTool({
        name: "start_workflow",
        args: {
          goal: plan.intent,
          graph,
          ...(plan.immediate[0]?.args ?? {}),
        },
        ctx: {
          user: ctx.user,
          inboundText: ctx.inboundText,
          inboundMessageId: ctx.inboundMessageId,
          snapshot: ctx.snapshot,
          attachmentContext: ctx.attachmentContext,
        },
        state: ctx.turnState,
      });
    } else if ("preset" in plan.workflow && plan.workflow.preset === "habit_default") {
      const habitStep = plan.immediate.find((step) => step.tool === "start_habit_workflow");
      if (!habitStep) {
        await executeDoeDtcTool({
          name: "start_habit_workflow",
          args: { goal: plan.intent, subject_name: ctx.user.full_name ?? "You" },
          ctx: {
            user: ctx.user,
            inboundText: ctx.inboundText,
            inboundMessageId: ctx.inboundMessageId,
            snapshot: ctx.snapshot,
            attachmentContext: ctx.attachmentContext,
          },
          state: ctx.turnState,
        });
      }
    }
  }

  return { ok: true, reply: plan.reply };
}

export async function runDoeSpecialistForPlan(params: {
  plan: DoePlan;
  ctx: DoeDtcRunContext;
}): Promise<void> {
  if (!params.plan.specialist || params.plan.immediate.length === 0) return;
  const agents = createDoeSpecialistAgents(params.ctx);
  const specialist =
    params.plan.specialist === "healthRecord"
      ? agents.healthRecord
      : params.plan.specialist === "guides"
        ? agents.guides
        : params.plan.specialist === "scheduling"
          ? agents.scheduling
          : agents.browser;
  await run(specialist, params.ctx.inboundText, { context: params.ctx, maxTurns: 8 });
}

export function inferPlanActionFromInbound(
  inboundText: string,
  members: Parameters<typeof resolveActionSlots>[0]["members"] = [],
  viewerUserId = "viewer",
): "act_now" | "confirm_once" {
  const slots = resolveActionSlots({
    inboundText,
    viewerUserId,
    members,
  });
  if (slots.missingSlot || slots.actionClass === "confirm_once") return "confirm_once";
  if (inboundAlreadyAsked(inboundText)) return "act_now";
  return classifyAgentAction({ inboundText }) === "act_now" ? "act_now" : "confirm_once";
}
