import { Kernel } from "@onkernel/sdk";

import {
  assertBrowserHostAllowed,
  browserUrlForHost,
  normalizeBrowserHost,
} from "@/lib/doedtc/doedtc-browser-allowlist";
import {
  cancelOpenDoeDtcBrowserJobs,
  clearDoeDtcVaultPassword,
  createDoeDtcBrowserJob,
  createDoeDtcWorkToken,
  getDoeDtcBrowserJob,
  getDoeDtcVaultCredentials,
  getOpenDoeDtcBrowserJob,
  insertDoeDtcBrowserShot,
  updateDoeDtcBrowserJob,
} from "@/lib/doedtc/doedtc-browser-db";
import { doeDtcVaultUrl, doeDtcWorkUrl } from "@/lib/doedtc/doedtc-copy";
import { redactDoeDtcLogText } from "@/lib/doedtc/doedtc-privacy";
import { uploadDoeDtcBrowserShot } from "@/lib/doedtc/doedtc-shots";
import type {
  DoeDtcBrowserJobRow,
  DoeDtcBrowserPendingAction,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

type KernelBrowser = {
  session_id: string;
  browser_live_view_url?: string | null;
};

type BrowserExtract = {
  ok: boolean;
  url?: string;
  title?: string;
  excerpt?: string;
  error?: string;
};

type BrowserSnapshotResult = BrowserExtract & {
  workToken?: string;
  workUrl?: string;
};

const EXCERPT_MAX = 800;
const KERNEL_SESSION_TIMEOUT_SECONDS = 1800;
const WRITE_DENY_SELECTORS = [
  'button[type="submit"]',
  'input[type="submit"]',
  "[data-doedtc-write]",
];

function getKernel(): Kernel {
  const apiKey = process.env.KERNEL_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Browser automation is not configured.");
  }
  return new Kernel({ apiKey });
}

function isKernelConfigured(): boolean {
  return Boolean(process.env.KERNEL_API_KEY?.trim());
}

function warnKernelFailure(action: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[doedtc:kernel] ${action} failed: ${redactDoeDtcLogText(message)}`);
}

function kernelProfileName(userId: string, host: string): string {
  const safeHost = host.replace(/[^a-z0-9.-]/gi, "-").slice(0, 40);
  return `doe-${userId.slice(0, 8)}-${safeHost}`.slice(0, 64);
}

function shouldSaveKernelProfile(job: DoeDtcBrowserJobRow): boolean {
  return job.mode === "login" || job.mode === "write" || job.login_attempts > 0;
}

async function ensureDoeDtcKernelProfile(userId: string, host: string): Promise<string> {
  const kernel = getKernel();
  const name = kernelProfileName(userId, host);

  try {
    const existing = await kernel.profiles.retrieve(name);
    return existing.id;
  } catch {
    try {
      const created = await kernel.profiles.create({ name });
      return created.id;
    } catch (createError) {
      warnKernelFailure("create profile", createError);
      throw createError instanceof Error ? createError : new Error("Could not create browser profile.");
    }
  }
}

async function attachKernelProfileToJob(job: DoeDtcBrowserJobRow): Promise<DoeDtcBrowserJobRow> {
  if (job.kernel_profile_id || !job.allowed_host) {
    return job;
  }

  const profileId = await ensureDoeDtcKernelProfile(job.user_id, job.allowed_host);
  return updateDoeDtcBrowserJob({
    jobId: job.id,
    userId: job.user_id,
    patch: { kernel_profile_id: profileId },
  });
}

async function retrieveKernelSession(sessionId: string): Promise<KernelBrowser | null> {
  try {
    const kernel = getKernel();
    const browser = await kernel.browsers.retrieve(sessionId);
    return {
      session_id: browser.session_id,
      browser_live_view_url: browser.browser_live_view_url ?? null,
    };
  } catch (error) {
    warnKernelFailure("retrieve session", error);
    return null;
  }
}

async function createKernelSession(job: DoeDtcBrowserJobRow): Promise<KernelBrowser> {
  const kernel = getKernel();
  const saveProfile = Boolean(job.kernel_profile_id) && shouldSaveKernelProfile(job);

  const browser = await kernel.browsers.create({
    stealth: true,
    headless: true,
    timeout_seconds: KERNEL_SESSION_TIMEOUT_SECONDS,
    profile: job.kernel_profile_id ? { id: job.kernel_profile_id } : undefined,
    start_url: job.allowed_host ? browserUrlForHost(job.allowed_host) : undefined,
    ...(saveProfile ? { profile_save_changes: true } : {}),
  } as Parameters<Kernel["browsers"]["create"]>[0]);

  return {
    session_id: browser.session_id,
    browser_live_view_url: browser.browser_live_view_url ?? null,
  };
}

async function ensureKernelSession(job: DoeDtcBrowserJobRow): Promise<{
  job: DoeDtcBrowserJobRow;
  kernelBrowser: KernelBrowser;
}> {
  let activeJob = await attachKernelProfileToJob(job);

  if (activeJob.kernel_session_id) {
    const existing = await retrieveKernelSession(activeJob.kernel_session_id);
    if (existing) {
      if (
        existing.browser_live_view_url &&
        existing.browser_live_view_url !== activeJob.browser_live_view_url
      ) {
        activeJob = await updateDoeDtcBrowserJob({
          jobId: activeJob.id,
          userId: activeJob.user_id,
          patch: { browser_live_view_url: existing.browser_live_view_url },
        });
      }
      return { job: activeJob, kernelBrowser: existing };
    }

    activeJob = await updateDoeDtcBrowserJob({
      jobId: activeJob.id,
      userId: activeJob.user_id,
      patch: { kernel_session_id: null, browser_live_view_url: null },
    });
  }

  const kernelBrowser = await createKernelSession(activeJob);
  const updated = await updateDoeDtcBrowserJob({
    jobId: activeJob.id,
    userId: activeJob.user_id,
    patch: {
      kernel_session_id: kernelBrowser.session_id,
      browser_live_view_url: kernelBrowser.browser_live_view_url ?? null,
    },
  });

  return { job: updated, kernelBrowser };
}

async function deleteKernelSession(sessionId: string | null | undefined): Promise<void> {
  if (!sessionId || !isKernelConfigured()) return;
  try {
    const kernel = getKernel();
    await kernel.browsers.deleteByID(sessionId);
  } catch (error) {
    warnKernelFailure("delete session", error);
  }
}

async function runPlaywright<T>(sessionId: string, code: string): Promise<T> {
  const kernel = getKernel();
  const response = await kernel.browsers.playwright.execute(sessionId, { code });
  return response.result as T;
}

async function redactSensitiveFields(sessionId: string): Promise<void> {
  await runPlaywright(
    sessionId,
    `
    await page.evaluate(() => {
      document.querySelectorAll('input[type="password"], input[autocomplete="one-time-code"]').forEach((el) => {
        el.setAttribute('data-doedtc-redacted', 'true');
        el.style.filter = 'blur(8px)';
      });
    });
  `,
  );
}

async function extractPage(sessionId: string): Promise<BrowserExtract> {
  return runPlaywright<BrowserExtract>(
    sessionId,
    `
      const text = await page.evaluate(() => {
        const body = document.body?.innerText ?? '';
        return body.replace(/\\s+/g, ' ').trim().slice(0, ${EXCERPT_MAX});
      });
      return { ok: true, url: page.url(), title: await page.title(), excerpt: text };
    `,
  );
}

async function captureShot(params: {
  user: DoeDtcUserRow;
  job: DoeDtcBrowserJobRow;
  sessionId: string;
  kind: "progress" | "review" | "result" | "error";
  caption?: string;
}): Promise<{ workToken: string; workUrl: string; blobUrl: string }> {
  await redactSensitiveFields(params.sessionId);

  const base64 = await runPlaywright<string>(
    params.sessionId,
    `return (await page.screenshot({ type: 'jpeg', quality: 70, fullPage: false })).toString('base64');`,
  );
  const jpegBuffer = Buffer.from(base64, "base64");

  const uploaded = await uploadDoeDtcBrowserShot({
    userId: params.user.id,
    jobId: params.job.id,
    jpegBuffer,
  });

  const shot = await insertDoeDtcBrowserShot({
    userId: params.user.id,
    jobId: params.job.id,
    blobUrl: uploaded.blobUrl,
    pathname: uploaded.pathname,
    kind: params.kind,
    caption: params.caption ?? null,
  });

  const workToken = await createDoeDtcWorkToken({
    userId: params.user.id,
    jobId: params.job.id,
    shotId: shot.id,
    purpose: "work",
  });

  await updateDoeDtcBrowserJob({
    jobId: params.job.id,
    userId: params.user.id,
    patch: { last_work_token: workToken.token },
  });

  return {
    workToken: workToken.token,
    workUrl: doeDtcWorkUrl(workToken.token),
    blobUrl: uploaded.blobUrl,
  };
}

export async function startDoeDtcBrowserTask(params: {
  user: DoeDtcUserRow;
  intent: string;
  url: string;
  mode?: "research" | "login" | "write";
}): Promise<{ ok: true; jobId: string; host: string } | { ok: false; error: string }> {
  if (!isKernelConfigured()) {
    return { ok: false, error: "Browser automation is not configured." };
  }

  try {
    const host = normalizeBrowserHost(params.url);
    const mode = params.mode ?? "research";
    assertBrowserHostAllowed({ host, mode, declaredHost: mode === "research" ? null : host });

    let job = await createDoeDtcBrowserJob({
      userId: params.user.id,
      intent: params.intent,
      allowedHost: host,
      mode,
    });

    job = await attachKernelProfileToJob(job);

    return { ok: true, jobId: job.id, host };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not start browser task.",
    };
  }
}

export async function navigateDoeDtcBrowser(params: {
  user: DoeDtcUserRow;
  jobId: string;
  url: string;
}): Promise<BrowserExtract> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job || !["open", "needs_login"].includes(job.status)) {
    return { ok: false, error: "No active browser task." };
  }

  const host = normalizeBrowserHost(params.url);
  assertBrowserHostAllowed({
    host,
    mode: job.mode,
    declaredHost: job.allowed_host,
  });

  const { job: activeJob, kernelBrowser } = await ensureKernelSession(job);
  const targetUrl = params.url.includes("://") ? params.url : browserUrlForHost(host);

  await runPlaywright(
    kernelBrowser.session_id,
    `await page.goto(${JSON.stringify(targetUrl)}, { waitUntil: 'domcontentloaded', timeout: 45000 });`,
  );

  if (host !== activeJob.allowed_host) {
    await attachKernelProfileToJob({ ...activeJob, allowed_host: host });
  }

  return extractPage(kernelBrowser.session_id);
}

export async function actDoeDtcBrowser(params: {
  user: DoeDtcUserRow;
  jobId: string;
  action: "click" | "type" | "scroll";
  selector?: string;
  text?: string;
}): Promise<BrowserExtract> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job || job.status !== "open") {
    return { ok: false, error: "Browser task is not open for actions." };
  }
  if (job.mode === "write") {
    return { ok: false, error: "Write actions require CONFIRM first." };
  }

  const { kernelBrowser } = await ensureKernelSession(job);
  const selector = params.selector?.trim();
  if (!selector && params.action !== "scroll") {
    return { ok: false, error: "Selector is required." };
  }

  if (selector && WRITE_DENY_SELECTORS.some((deny) => selector.includes(deny))) {
    return { ok: false, error: "That action needs confirmation first." };
  }

  if (params.action === "click") {
    await runPlaywright(
      kernelBrowser.session_id,
      `await page.click(${JSON.stringify(selector)}, { timeout: 15000 });`,
    );
  } else if (params.action === "type") {
    await runPlaywright(
      kernelBrowser.session_id,
      `await page.fill(${JSON.stringify(selector)}, ${JSON.stringify(params.text ?? "")});`,
    );
  } else {
    await runPlaywright(kernelBrowser.session_id, `await page.mouse.wheel(0, 600);`);
  }

  return extractPage(kernelBrowser.session_id);
}

export async function snapshotDoeDtcBrowser(params: {
  user: DoeDtcUserRow;
  jobId: string;
  caption?: string;
  kind?: "progress" | "review" | "result" | "error";
}): Promise<BrowserSnapshotResult> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job || ["cancelled", "failed", "committed"].includes(job.status)) {
    return { ok: false, error: "No active browser task." };
  }

  const { kernelBrowser } = await ensureKernelSession(job);
  const extract = await extractPage(kernelBrowser.session_id);
  const shot = await captureShot({
    user: params.user,
    job,
    sessionId: kernelBrowser.session_id,
    kind: params.kind ?? "progress",
    caption: params.caption,
  });

  return {
    ...extract,
    workToken: shot.workToken,
    workUrl: shot.workUrl,
  };
}

export async function requestDoeDtcVaultLink(params: {
  user: DoeDtcUserRow;
  jobId: string;
  host: string;
}): Promise<{ ok: true; vaultUrl: string } | { ok: false; error: string }> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job) return { ok: false, error: "Browser task not found." };

  const host = normalizeBrowserHost(params.host);
  let updatedJob = await updateDoeDtcBrowserJob({
    jobId: job.id,
    userId: params.user.id,
    patch: { allowed_host: host, mode: "login", status: "needs_login" },
  });
  updatedJob = await attachKernelProfileToJob(updatedJob);

  const token = await createDoeDtcWorkToken({
    userId: params.user.id,
    jobId: job.id,
    purpose: "vault",
  });

  return { ok: true, vaultUrl: doeDtcVaultUrl(token.token) };
}

export async function requestDoeDtcLiveLogin(params: {
  user: DoeDtcUserRow;
  jobId: string;
}): Promise<{ ok: true; liveViewUrl: string } | { ok: false; error: string }> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job) return { ok: false, error: "Browser task not found." };

  const { kernelBrowser } = await ensureKernelSession(job);
  if (!kernelBrowser.browser_live_view_url) {
    return { ok: false, error: "Live view is unavailable for this session." };
  }

  await updateDoeDtcBrowserJob({
    jobId: job.id,
    userId: params.user.id,
    patch: { status: "needs_login", browser_live_view_url: kernelBrowser.browser_live_view_url },
  });

  return { ok: true, liveViewUrl: kernelBrowser.browser_live_view_url };
}

export async function attemptDoeDtcVaultLogin(params: {
  userId: string;
  jobId: string;
  host: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.userId });
  if (!job) return { ok: false, reason: "login_failed" };
  if (job.login_attempts >= 1) {
    return { ok: false, reason: "login_failed" };
  }

  const creds = await getDoeDtcVaultCredentials({ userId: params.userId, host: params.host });
  if (!creds) {
    return { ok: false, reason: "login_failed" };
  }

  let activeJob = await attachKernelProfileToJob(job);
  const { kernelBrowser } = await ensureKernelSession(activeJob);
  activeJob = await updateDoeDtcBrowserJob({
    jobId: activeJob.id,
    userId: params.userId,
    patch: { login_attempts: activeJob.login_attempts + 1 },
  });

  try {
    const loginUrl = browserUrlForHost(params.host);
    await runPlaywright(
      kernelBrowser.session_id,
      `
        await page.goto(${JSON.stringify(loginUrl)}, { waitUntil: 'domcontentloaded', timeout: 45000 });
        const userSelector = 'input[type="email"], input[name="username"], input[name="user"], input[type="text"]';
        const passSelector = 'input[type="password"]';
        if (await page.locator(userSelector).count()) {
          await page.locator(userSelector).first().fill(${JSON.stringify(creds.username)});
        }
        if (await page.locator(passSelector).count()) {
          await page.locator(passSelector).first().fill(${JSON.stringify(creds.password)});
        }
        const submit = page.locator('button[type="submit"], input[type="submit"]').first();
        if (await submit.count()) await submit.click();
        await page.waitForTimeout(2500);
      `,
    );

    const extract = await extractPage(kernelBrowser.session_id);
    const failed =
      /invalid|incorrect|failed|try again|locked|error/i.test(extract.excerpt ?? "") ||
      /login|sign in/i.test(extract.title ?? "");

    if (failed) {
      await updateDoeDtcBrowserJob({
        jobId: activeJob.id,
        userId: params.userId,
        patch: { status: "failed", outcome: "Login failed." },
      });
      await deleteKernelSession(kernelBrowser.session_id);
      return { ok: false, reason: "login_failed" };
    }

    await clearDoeDtcVaultPassword({ userId: params.userId, host: params.host });
    await updateDoeDtcBrowserJob({
      jobId: activeJob.id,
      userId: params.userId,
      patch: { status: "open", outcome: "Logged in." },
    });
    return { ok: true };
  } catch (error) {
    warnKernelFailure("vault login", error);
    await updateDoeDtcBrowserJob({
      jobId: activeJob.id,
      userId: params.userId,
      patch: { status: "failed", outcome: "Login failed." },
    });
    await deleteKernelSession(kernelBrowser.session_id);
    return { ok: false, reason: "login_failed" };
  }
}

export async function requestDoeDtcBrowserCommit(params: {
  user: DoeDtcUserRow;
  jobId: string;
  pendingAction: DoeDtcBrowserPendingAction;
}): Promise<BrowserSnapshotResult> {
  const job = await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.user.id });
  if (!job || job.status !== "open") {
    return { ok: false, error: "Browser task is not open." };
  }

  const snapshot = await snapshotDoeDtcBrowser({
    user: params.user,
    jobId: job.id,
    caption: `Review: ${params.pendingAction.label}`,
    kind: "review",
  });

  await updateDoeDtcBrowserJob({
    jobId: job.id,
    userId: params.user.id,
    patch: {
      status: "pending_confirm",
      pending_action: params.pendingAction,
      mode: "write",
    },
  });

  return snapshot;
}

export async function commitDoeDtcBrowserTask(params: {
  userId: string;
  jobId?: string;
}): Promise<{ ok: true; outcome: string } | { ok: false; error: string }> {
  const job =
    (params.jobId
      ? await getDoeDtcBrowserJob({ jobId: params.jobId, userId: params.userId })
      : null) ??
    (await getOpenDoeDtcBrowserJob(params.userId));

  if (!job || job.status !== "pending_confirm" || !job.pending_action) {
    return { ok: false, error: "No browser action is waiting for confirmation." };
  }

  const { kernelBrowser } = await ensureKernelSession(job);
  try {
    await runPlaywright(
      kernelBrowser.session_id,
      `await page.click(${JSON.stringify(job.pending_action.selector)}, { timeout: 15000 });`,
    );
    const extract = await extractPage(kernelBrowser.session_id);
    await updateDoeDtcBrowserJob({
      jobId: job.id,
      userId: params.userId,
      patch: {
        status: "committed",
        confirmed_at: new Date().toISOString(),
        outcome: extract.title ?? "Action completed.",
        pending_action: null,
      },
    });
    await deleteKernelSession(kernelBrowser.session_id);
    return { ok: true, outcome: extract.title ?? "Action completed." };
  } catch (error) {
    warnKernelFailure("commit", error);
    await updateDoeDtcBrowserJob({
      jobId: job.id,
      userId: params.userId,
      patch: {
        status: "failed",
        outcome: error instanceof Error ? error.message : "Commit failed.",
      },
    });
    await deleteKernelSession(kernelBrowser.session_id);
    return { ok: false, error: "Commit failed." };
  }
}

export async function stopDoeDtcBrowserForUser(userId: string): Promise<void> {
  const job = await getOpenDoeDtcBrowserJob(userId);
  if (job?.kernel_session_id) {
    await deleteKernelSession(job.kernel_session_id);
  }
  await cancelOpenDoeDtcBrowserJobs(userId);
}

export async function getActiveDoeDtcBrowserJobId(userId: string): Promise<string | null> {
  const job = await getOpenDoeDtcBrowserJob(userId);
  return job?.id ?? null;
}

export function isDoeDtcBrowserEnabled(): boolean {
  return isKernelConfigured();
}
