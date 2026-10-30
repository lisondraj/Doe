"use client";

import { DemoClinicLanding } from "@/components/demo/DemoClinicLanding";
import { DemoFrame } from "@/components/demo/DemoFrame";
import { DemoGate } from "@/components/demo/DemoGate";
import { useDemoAgent } from "@/components/demo/useDemoAgent";

/**
 * /demo: the consent screen an agent meets first, then the clinic's page on a live session. The page uses the same
 * API as agents connecting over REST or MCP, so /demo/clinic sees all of them the same way.
 */
export function DemoPage() {
  const agent = useDemoAgent();
  if (!agent.ready) return <DemoFrame agentView>{null}</DemoFrame>;
  if (agent.state) return <DemoClinicLanding state={agent.state} act={agent.act} onEnd={agent.end} />;
  return (
    <DemoFrame agentView>
      <DemoGate
        onProceed={async (consent, userName) => {
          const r = await agent.connect(consent, userName);
          return r.ok ? null : r.error;
        }}
      />
    </DemoFrame>
  );
}
