import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyDocumentSubjectToWrites,
  buildDocumentSavingNotice,
  extractResultedAtFromText,
  extractTitleIsNameReply,
  formatDocumentParseForPrompt,
  interpretDocumentIdentityReply,
  looksLikePersonNameResultTitle,
  looksLikeSaveDocumentToOwnChart,
  preferredLabResultTitle,
  mapLabPanelToLogResultWrites,
  namesLooselyMatch,
  normalizeDocumentParseResult,
  resolveDocumentPatientName,
  profileUrlForSavedDocumentWrites,
  sanitizeDocumentParseSummary,
  shouldAutoCommitDocumentParse,
} from "@/lib/doedtc/agent/document-parse";

describe("document parse", () => {
  it("maps lab panel analytes to log_result writes", () => {
    const writes = mapLabPanelToLogResultWrites({
      resultedAt: "2026-08-15",
      analytes: [
        { title: "A1C", value: "7.8", unit: "%", range: "<6.5" },
        { title: "Glucose", value: "102", unit: "mg/dL" },
      ],
    });
    assert.equal(writes.length, 2);
    assert.equal(writes[0]?.tool, "log_result");
    assert.equal(writes[0]?.args.title, "A1C");
    assert.equal(writes[0]?.args.value, "7.8");
    assert.equal(writes[0]?.args.resulted_at, "2026-08-15");
  });

  it("sanitizes parser summaries without em dashes", () => {
    assert.equal(
      sanitizeDocumentParseSummary("Looks like your lab panel — I can log it"),
      "Looks like your lab panel - I can log it",
    );
  });

  it("normalizes structured parse JSON", () => {
    const parsed = normalizeDocumentParseResult({
      kind: "lab_panel",
      confidence: 0.91,
      summary: "Lab panel from August",
      patient_name: "  Simon  ",
      writes: [{ tool: "log_result", args: { title: "A1C", value: "7.8", unit: "%", resulted_at: "2026-08-15" } }],
    });
    assert.equal(parsed.kind, "lab_panel");
    assert.equal(parsed.writes.length, 1);
    assert.equal(parsed.patient_name, "Simon");
    assert.doesNotMatch(parsed.summary, /\u2014/);
  });

  it("auto-commits high-confidence attachment turns with empty caption", () => {
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "lab_panel",
          confidence: 0.9,
          summary: "Lab panel",
          patient_name: null,
          writes: [{ tool: "log_result", args: { title: "A1C", value: "7.8", unit: "%", resulted_at: "2026-08-15" } }],
        },
        inboundText: "[attachments: file-1]",
        attachmentTurn: true,
      }),
      true,
    );
  });

  it("routes a named child on the chart and guesses a caption name", () => {
    const members = [
      {
        id: "m-simon",
        full_name: "Simon",
        user_id: null,
        phone: null,
        status: "pending" as const,
        relationship: "child" as const,
        role: "member" as const,
        gender: "male" as const,
      },
    ];
    const onChart = resolveDocumentPatientName({
      parsedName: "Simon Lisondra",
      caption: "[attachments: file-1]",
      members,
      viewerUserId: "parent-1",
      viewerName: "James Lisondra",
    });
    assert.equal(onChart.name, "Simon");
    assert.equal(onChart.onChart, true);
    assert.equal(onChart.canSave, true);
    assert.equal(onChart.disposition, "household");

    const unknown = resolveDocumentPatientName({
      parsedName: "Riley",
      caption: "",
      members,
      viewerUserId: "parent-1",
      viewerName: "James Lisondra",
    });
    assert.equal(unknown.name, "Riley");
    assert.equal(unknown.onChart, false);
    assert.equal(unknown.canSave, false);
    assert.equal(unknown.disposition, "unknown_name");

    const writes = applyDocumentSubjectToWrites(
      [{ tool: "log_result", args: { title: "A1C", resulted_at: "2026-08-15" } }],
      "Simon",
    );
    assert.equal(writes[0]?.args.member_name, "Simon");
    assert.equal(buildDocumentSavingNotice({ inboundText: "Simon's labs" }), "Saving this to Simon's chart now.");
    assert.equal(buildDocumentSavingNotice({ inboundText: "[attachments: file-1]" }), "Saving this now.");
  });

  it("keeps messy vision JSON instead of failing the whole parse", () => {
    const parsed = normalizeDocumentParseResult({
      kind: "labs",
      confidence: "0.9",
      summary: "Liver panel from today",
      patient_name: "",
      results: [
        { analyte: "ALT", value: "32", unit: "U/L", date: "2026-09-01" },
        { tool: "log_results", args: { title: "AST", value: "28", unit: "U/L", resulted_at: "2026-09-01" } },
        { tool: "not_a_real_tool", name: "" },
      ],
    });
    assert.equal(parsed.kind, "lab_panel");
    assert.equal(parsed.confidence, 0.9);
    assert.equal(parsed.patient_name, null);
    assert.equal(parsed.writes.length, 2);
    assert.equal(parsed.writes[0]?.tool, "log_result");
    assert.equal(parsed.writes[0]?.args.title, "ALT");
    assert.equal(parsed.writes[0]?.args.value, "32");
    assert.equal(parsed.writes[1]?.tool, "log_result");
    assert.equal(parsed.writes[1]?.args.title, "AST");
  });

  it("does not auto-commit low-confidence other documents", () => {
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "other",
          confidence: 0.4,
          summary: "Not sure what this is",
          patient_name: null,
          writes: [],
        },
        inboundText: "[attachments: file-2]",
        attachmentTurn: true,
      }),
      false,
    );
  });

  it("matches printed names to the user without exact spelling", () => {
    assert.equal(namesLooselyMatch("OJEWALE MALIK null", "Malik Ojewale"), true);
    assert.equal(namesLooselyMatch("James Lisondra", "James"), true);
    assert.equal(namesLooselyMatch("James Lisondra", "Ojewale Malik"), false);
    assert.equal(namesLooselyMatch("James Brown", "James Lisondra"), false);

    const self = resolveDocumentPatientName({
      parsedName: "OJEWALE MALIK null",
      caption: "[attachments: file-1]",
      members: [],
      viewerUserId: "user-1",
      viewerName: "Malik Ojewale",
    });
    assert.equal(self.matchesUser, true);
    assert.equal(self.canSave, true);
    assert.equal(self.disposition, "self");

    const unnamed = resolveDocumentPatientName({
      parsedName: null,
      caption: "[attachments: file-1]",
      members: [],
      viewerUserId: "user-1",
      viewerName: "James Lisondra",
    });
    assert.equal(unnamed.disposition, "self");
    assert.equal(unnamed.canSave, true);
    assert.equal(unnamed.matchesUser, true);

    assert.equal(looksLikeSaveDocumentToOwnChart("Are these in My chart"), true);
    assert.equal(looksLikeSaveDocumentToOwnChart("what were my LFTs"), true);
    const myChart = resolveDocumentPatientName({
      parsedName: null,
      caption: "Are these in My chart",
      members: [],
      viewerUserId: "user-1",
      viewerName: "James Lisondra",
    });
    assert.equal(myChart.canSave, true);
    assert.equal(myChart.disposition, "self");
  });

  it("does not auto-commit when the printed name is not the user or household", () => {
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "lab_panel",
          confidence: 0.95,
          summary: "Liver panel",
          patient_name: "Ojewale Malik",
          writes: [{ tool: "log_result", args: { title: "ALT", value: "78", unit: "U/L", resulted_at: "2023-02-28" } }],
        },
        inboundText: "[attachments: file-1]",
        attachmentTurn: true,
        canSave: false,
      }),
      false,
    );
  });

  it("asks who it is or refuses the photo from parse output", () => {
    assert.match(
      formatDocumentParseForPrompt({
        ok: true,
        summary: "Liver function test",
        patient_name: "Ojewale Malik",
        can_save: false,
        disposition: "unknown_name",
        auto_committed: false,
      }) ?? "",
      /invite them to the household/i,
    );
    assert.match(
      formatDocumentParseForPrompt({
        ok: true,
        summary: "A photo",
        patient_name: null,
        can_save: false,
        disposition: "unnamed",
        auto_committed: false,
      }) ?? "",
      /treat it as theirs/i,
    );
  });

  it("builds the labs tab after saved document writes", () => {
    assert.match(
      profileUrlForSavedDocumentWrites({
        careToken: "tok",
        results: [{ tool: "log_result", ok: true }],
      }) ?? "",
      /tab=results/,
    );
    assert.equal(
      profileUrlForSavedDocumentWrites({
        careToken: "tok",
        results: [{ tool: "log_result", ok: false }],
      }),
      undefined,
    );
    assert.equal(
      profileUrlForSavedDocumentWrites({
        careToken: "tok",
        results: [{ tool: "add_medication", ok: true }],
        existingProfileUrl: "https://doe.care/app?t=tok&tab=conditions",
      }),
      "https://doe.care/app?t=tok&tab=conditions",
    );
  });

  it("tells the model the labs link goes out separately after a save", () => {
    assert.match(
      formatDocumentParseForPrompt({
        ok: true,
        summary: "Liver panel",
        patient_name: "James",
        can_save: true,
        auto_committed: true,
      }) ?? "",
      /labs tab link is sent automatically/i,
    );
  });

  it("reads who / invite replies for a held document", () => {
    const members = [
      {
        id: "m-simon",
        full_name: "Simon",
        user_id: null,
        phone: null,
        status: "pending" as const,
        relationship: "child" as const,
        role: "member" as const,
        gender: "male" as const,
      },
    ];
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "that's me",
        viewerName: "James Lisondra",
        members,
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "save_self",
    );
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "no",
        viewerName: "James Lisondra",
        members,
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "decline",
    );
    const addFamily = interpretDocumentIdentityReply({
      inboundText: "Add them to my family profile",
      viewerName: "James Lisondra",
      members,
      viewerUserId: "parent-1",
      printedName: "Ojewale Malik",
    });
    assert.equal(addFamily.action, "save_other");
    if (addFamily.action === "save_other") {
      assert.equal(addFamily.name, "Ojewale Malik");
      assert.equal(addFamily.invite, true);
    }
    const invite = interpretDocumentIdentityReply({
      inboundText: "yes invite him",
      viewerName: "James Lisondra",
      members,
      viewerUserId: "parent-1",
      printedName: "Ojewale Malik",
    });
    assert.equal(invite.action, "save_other");
    if (invite.action === "save_other") {
      assert.equal(invite.name, "Ojewale Malik");
      assert.equal(invite.invite, true);
    }
    const son = interpretDocumentIdentityReply({
      inboundText: "that's my son Simon",
      viewerName: "James Lisondra",
      members,
      viewerUserId: "parent-1",
      printedName: "Ojewale Malik",
    });
    assert.equal(son.action, "save_other");
    if (son.action === "save_other") {
      assert.equal(son.name, "Simon");
      assert.equal(son.relationship, "child");
    }
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "These are mine",
        viewerName: "James Lisondra",
        members,
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "save_self",
    );
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "Log these results to my chart",
        viewerName: "James Lisondra",
        members,
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "save_self",
    );
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "Title is James and 5/6/2024",
        viewerName: "James Lisondra",
        members,
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "save_self",
    );
  });

  it("does not invent a panel row when vision returns a summary but no values", () => {
    const parsed = normalizeDocumentParseResult({
      kind: "lab_panel",
      confidence: 0.9,
      summary: "Liver function test with ALT and AST in range and ALP slightly high.",
      patient_name: "Ojewale Malik",
      writes: [],
    });
    assert.equal(parsed.writes.length, 0);
    assert.match(
      formatDocumentParseForPrompt({
        ok: true,
        kind: "lab_panel",
        summary: parsed.summary,
        proposed_writes: [],
        auto_committed: false,
      }) ?? "",
      /no lab values were readable/i,
    );
  });

  it("treats these-are-mine and log-these as a save to the user's chart", () => {
    assert.equal(looksLikeSaveDocumentToOwnChart("These are mine"), true);
    assert.equal(looksLikeSaveDocumentToOwnChart("Log these results to my chart"), true);
    assert.equal(looksLikeSaveDocumentToOwnChart("Log these"), true);
    assert.equal(
      interpretDocumentIdentityReply({
        inboundText: "Log these",
        viewerName: "James Lisondra",
        members: [],
        viewerUserId: "parent-1",
        printedName: "Ojewale Malik",
      }).action,
      "save_self",
    );
    assert.equal(extractResultedAtFromText("Title is James and 5/6/2024"), "2024-05-06");
    assert.equal(extractTitleIsNameReply("Title is James and 5/6/2024"), "James");
    assert.equal(
      looksLikePersonNameResultTitle({ title: "James", viewerName: "James Lisondra" }),
      true,
    );
    assert.equal(
      looksLikePersonNameResultTitle({ title: "Liver function test", viewerName: "James Lisondra" }),
      false,
    );
    assert.equal(
      preferredLabResultTitle({
        title: "James",
        fallback: "Liver function test",
        viewerName: "James Lisondra",
      }),
      "Liver function test",
    );
    const claimed = resolveDocumentPatientName({
      parsedName: "Ojewale Malik",
      caption: "These are mine",
      members: [],
      viewerUserId: "user-1",
      viewerName: "James Lisondra",
    });
    assert.equal(claimed.canSave, true);
    assert.equal(claimed.disposition, "self");
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "lab_panel",
          confidence: 0.9,
          summary: "Liver panel",
          patient_name: "Ojewale Malik",
          writes: [{ tool: "log_result", args: { title: "ALT", value: "32", unit: "U/L", resulted_at: "2024-05-06" } }],
        },
        inboundText: "These are mine",
        attachmentTurn: true,
        canSave: true,
      }),
      true,
    );
  });
});
