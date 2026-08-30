import { getOpenDoeDtcBrowserJob } from "@/lib/doedtc/doedtc-browser-db";
import { resolveDoeDtcSessionLiveView } from "@/lib/doedtc/doedtc-browser";
import { getDoeDtcUserByCareToken, listDoeDtcListenSessions, listDoeDtcSymptoms } from "@/lib/doedtc/doedtc-db";
import type {
  DoeDtcBrowserJobStatus,
  DoeDtcSessionPageData,
  DoeDtcSessionTask,
  DoeDtcSessionTaskStatus,
} from "@/lib/doedtc/doedtc-types";

function browserTaskStatus(status: DoeDtcBrowserJobStatus): DoeDtcSessionTaskStatus {
  if (status === "pending_confirm" || status === "needs_login") return "waiting";
  return "active";
}

function browserStatusLabel(status: DoeDtcBrowserJobStatus): string {
  switch (status) {
    case "needs_login":
      return "Waiting for sign-in";
    case "pending_confirm":
      return "Needs your confirmation";
    case "open":
    default:
      return "In progress";
  }
}

export async function getDoeDtcSessionPageData(careToken: string): Promise<DoeDtcSessionPageData | null> {
  const user = await getDoeDtcUserByCareToken(careToken.trim());
  if (!user) return null;

  const [liveView, listenSessions, symptoms] = await Promise.all([
    resolveDoeDtcSessionLiveView(user.id),
    listDoeDtcListenSessions(user.id, 6),
    listDoeDtcSymptoms(user.id, 3),
  ]);

  const tasks: DoeDtcSessionTask[] = [];

  if (liveView?.browserIntent && liveView.browserStatus) {
    tasks.push({
      id: "browser",
      label: liveView.browserIntent,
      detail: browserStatusLabel(liveView.browserStatus),
      status: browserTaskStatus(liveView.browserStatus),
    });
  } else {
    const openJob = await getOpenDoeDtcBrowserJob(user.id);
    if (openJob) {
      tasks.push({
        id: "browser",
        label: openJob.intent,
        detail: browserStatusLabel(openJob.status),
        status: browserTaskStatus(openJob.status),
      });
    }
  }

  for (const session of listenSessions.filter((row) => row.status === "pending").slice(0, 2)) {
    tasks.push({
      id: `listen-${session.id}`,
      label: "Listen ready",
      detail: "Tap the link in iMessage to record",
      status: "pending",
    });
  }

  for (const symptom of symptoms.slice(0, 2)) {
    const label = symptom.summary?.trim() || symptom.raw_text.trim().slice(0, 80);
    if (!label) continue;
    tasks.push({
      id: `symptom-${symptom.id}`,
      label: "Logged symptom",
      detail: label,
      status: "pending",
    });
  }

  return {
    liveViewUrl: liveView?.liveViewUrl ?? null,
    browserIntent: liveView?.browserIntent ?? null,
    browserStatus: liveView?.browserStatus ?? null,
    tasks,
  };
}
