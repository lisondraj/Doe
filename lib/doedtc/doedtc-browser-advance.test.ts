import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canClaimBrowserJobAdvance,
  doeDtcRuntimeOrigin,
  shouldRecoverBrowserJob,
} from "@/lib/doedtc/doedtc-browser-advance";

describe("browser advance dispatch", () => {
  it("prefers this Vercel deployment over the public marketing origin", () => {
    const previousVercel = process.env.VERCEL_URL;
    const previousPublic = process.env.DOEDTC_PUBLIC_ORIGIN;
    process.env.VERCEL_URL = "doe-abc.vercel.app";
    process.env.DOEDTC_PUBLIC_ORIGIN = "https://doe.care";
    try {
      assert.equal(doeDtcRuntimeOrigin(), "https://doe-abc.vercel.app");
    } finally {
      if (previousVercel === undefined) delete process.env.VERCEL_URL;
      else process.env.VERCEL_URL = previousVercel;
      if (previousPublic === undefined) delete process.env.DOEDTC_PUBLIC_ORIGIN;
      else process.env.DOEDTC_PUBLIC_ORIGIN = previousPublic;
    }
  });

  it("recovers open research jobs that never sent a screenshot", () => {
    const now = Date.parse("2026-09-02T02:00:00.000Z");
    assert.equal(
      shouldRecoverBrowserJob(
        {
          mode: "research",
          status: "open",
          outcome: null,
          created_at: "2026-09-02T01:59:00.000Z",
          updated_at: "2026-09-02T01:59:00.000Z",
        },
        now,
      ),
      true,
    );
    assert.equal(
      shouldRecoverBrowserJob(
        {
          mode: "research",
          status: "open",
          outcome: null,
          created_at: "2026-09-02T01:59:50.000Z",
          updated_at: "2026-09-02T01:59:50.000Z",
        },
        now,
      ),
      false,
    );
    assert.equal(
      shouldRecoverBrowserJob(
        {
          mode: "login",
          status: "open",
          outcome: null,
          created_at: "2026-09-02T01:59:00.000Z",
          updated_at: "2026-09-02T01:59:00.000Z",
        },
        now,
      ),
      false,
    );
  });

  it("does not steal a research job that is already advancing", () => {
    const now = Date.parse("2026-09-02T02:00:00.000Z");
    assert.equal(
      shouldRecoverBrowserJob(
        {
          mode: "research",
          status: "open",
          outcome: "advancing",
          created_at: "2026-09-02T01:59:00.000Z",
          updated_at: "2026-09-02T01:59:30.000Z",
        },
        now,
      ),
      false,
    );
    assert.equal(
      shouldRecoverBrowserJob(
        {
          mode: "research",
          status: "open",
          outcome: "advancing",
          created_at: "2026-09-02T01:57:00.000Z",
          updated_at: "2026-09-02T01:57:00.000Z",
        },
        now,
      ),
      true,
    );
  });

  it("allows re-advancing an open research job after a screenshot outcome", () => {
    assert.equal(
      canClaimBrowserJobAdvance({
        status: "open",
        outcome: "Screenshot captured",
        updated_at: "2026-09-02T01:05:00.000Z",
      }),
      true,
    );
  });
});
