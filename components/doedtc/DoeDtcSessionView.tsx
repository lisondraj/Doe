"use client";

import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_SESSION } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcSessionPageData, DoeDtcSessionTaskStatus } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcSessionViewProps = {
  valid: boolean;
  session: DoeDtcSessionPageData | null;
};

function taskStatusLabel(status: DoeDtcSessionTaskStatus): string {
  switch (status) {
    case "active":
      return DOEDTC_SESSION.statusActive;
    case "waiting":
      return DOEDTC_SESSION.statusWaiting;
    case "pending":
    default:
      return DOEDTC_SESSION.statusPending;
  }
}

export function DoeDtcSessionView({ valid, session }: DoeDtcSessionViewProps) {
  const hasLiveView = Boolean(session?.liveViewUrl);
  const hasTasks = Boolean(session?.tasks.length);

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>
          {!valid || !session ? DOEDTC_SESSION.invalidTitle : DOEDTC_SESSION.pageTitle}
        </h1>
        {!valid || !session ? (
          <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_SESSION.invalidBody}</p>
        ) : null}
      </header>

      {!valid || !session ? null : (
        <div className="doedtc-session">
          <section className="doedtc-card doedtc-card--flat doedtc-session__live">
            <p className="doedtc-label">{DOEDTC_SESSION.liveLabel}</p>
            {hasLiveView ? (
              <div className="doedtc-session-live">
                <iframe
                  title={session.browserIntent || DOEDTC_SESSION.liveLabel}
                  src={session.liveViewUrl ?? undefined}
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            ) : (
              <div className="doedtc-session-empty">
                <p className={`doedtc-body ${dmSans.className}`}>{DOEDTC_SESSION.emptyTitle}</p>
                <p className="doedtc-body doedtc-body--muted">{DOEDTC_SESSION.emptyBody}</p>
              </div>
            )}
            {session.browserIntent ? (
              <p className="doedtc-body doedtc-body--spaced doedtc-body--muted">
                {session.browserIntent}
              </p>
            ) : null}
          </section>

          {hasTasks ? (
            <section className="doedtc-card doedtc-card--flat doedtc-session__tasks">
              <p className="doedtc-label">{DOEDTC_SESSION.tasksLabel}</p>
              <ul className="doedtc-row-list">
                {session.tasks.map((task) => (
                  <li key={task.id} className="doedtc-row-item">
                    <div className="doedtc-row-item__body">
                      <p className="doedtc-body">{task.label}</p>
                      {task.detail ? (
                        <p className="doedtc-row-item__meta">{task.detail}</p>
                      ) : null}
                    </div>
                    <span className={`doedtc-tag doedtc-tag--${task.status}`}>
                      {taskStatusLabel(task.status)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </DoeDtcPageShell>
  );
}
