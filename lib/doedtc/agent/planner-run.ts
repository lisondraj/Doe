import { run } from "@openai/agents";

import { executeDoeDtcTool } from "@/lib/doedtc/agent/tool-dispatch";
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
  const planner = createDoePlannerAgent(ctx);
  const result = await run(planner, ctx.inboundText, { context: ctx, maxTurns: 4 });
  const parsed = DoePlanSchema.safeParse(result.finalOutput);
  return parsed.success ? parsed.data : null;
}

export async function executeDoePlan(params: {
  plan: DoePlan;
  ctx: DoeDtcRunContext;
}): Promise<{ ok: boolean; reply: string; preservePending?: boolean }> {
  const { plan, ctx } = params;
  const validation = validateDoePlan(plan, {
    inboundText: ctx.inboundText,
    textsThirdParty: planTextsThirdParty(plan),
    missingSlot: plan.action === "confirm_once",
    irreversible: plan.immediate.some((step) =>
      ["save_guide", "send_family_invite", "revoke_household_access", "request_commit"].includes(
        step.tool,
      ),
    ),
    emergencyOrDiagnosis: plan.action === "refuse",
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
    await executeDoeDtcTool({
      name: step.tool,
      args: step.args,
      ctx: {
        user: ctx.user,
        inboundText: ctx.inboundText,
        inboundMessageId: ctx.inboundMessageId,
        snapshot: ctx.snapshot,
      },
      state: ctx.turnState,
    });
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

export function inferPlanActionFromInbound(inboundText: string): "act_now" | "confirm_once" {
  if (inboundAlreadyAsked(inboundText)) return "act_now";
  return classifyAgentAction({ inboundText }) === "act_now" ? "act_now" : "confirm_once";
}
