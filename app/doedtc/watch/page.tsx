import { DoeDtcAgentWatch } from "@/components/doedtc/DoeDtcAgentWatch";
import { listDoeDtcAgentTurns } from "@/lib/doedtc/doedtc-agent-audit";
import {
  KERNEL_SESSION_TIMEOUT_SECONDS,
  listOpenDoeDtcBrowserJobs,
} from "@/lib/doedtc/doedtc-browser-db";
import { getDoeDtcWatchUser } from "@/lib/doedtc/doedtc-db";

export const dynamic = "force-dynamic";

export default async function DoeDtcWatchPage() {
  const user = await getDoeDtcWatchUser();
  const [turns, browserJobs] = user
    ? await Promise.all([
        listDoeDtcAgentTurns({ userId: user.id, limit: 40 }),
        listOpenDoeDtcBrowserJobs(user.id),
      ])
    : [[], []];

  return (
    <DoeDtcAgentWatch
      initialUser={
        user
          ? {
              id: user.id,
              phone: user.phone,
              fullName: user.full_name,
              status: user.status,
            }
          : null
      }
      initialTurns={turns}
      initialBrowserJobs={browserJobs.map((job) => ({
        id: job.id,
        status: job.status,
        allowed_host: job.allowed_host,
        intent: job.intent,
        updated_at: job.updated_at,
        ageSeconds: Math.round((Date.now() - Date.parse(job.updated_at)) / 1000),
        stale: Date.now() - Date.parse(job.updated_at) > KERNEL_SESSION_TIMEOUT_SECONDS * 1000,
      }))}
    />
  );
}
