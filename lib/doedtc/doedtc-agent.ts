import {
  actDoeDtcBrowser,
  getActiveDoeDtcBrowserJobId,
  navigateDoeDtcBrowser,
  requestDoeDtcBrowserCommit,
  requestDoeDtcLiveLogin,
  requestDoeDtcVaultLink,
  snapshotDoeDtcBrowser,
  startDoeDtcBrowserTask,
  toUserSafeBrowserError,
} from "@/lib/doedtc/doedtc-browser";
import {
  buildDoeAgentVoiceBlock,
  DOE_AGENT_MAKE_SURE_ROUTING,
  hasConcretePlan,
  looksCapabilityHedge,
} from "@/lib/doedtc/doedtc-agent-voice";
import { DOE_AGENT_ACTION_POLICY } from "@/lib/doedtc/doedtc-agent-policy";
import {
  buildScheduledTextPendingArgs,
  executeAgentPendingCommit,
} from "@/lib/doedtc/doedtc-agent-commit";
import {
  addDoeDtcMem0Fact,
  addDoeDtcMem0PlaybookNote,
  formatMem0Block,
  searchDoeDtcMem0Memories,
  searchDoeDtcMem0Playbook,
} from "@/lib/doedtc/doedtc-memory";
import {
  clearAgentPending,
  formatAgentPendingForPrompt,
  getAgentPending,
  parseAffirmation,
  parseDecline,
  setAgentPending,
} from "@/lib/doedtc/doedtc-pending";
import { doeDtcAppUrl, doeDtcArtifactShareUrl, doeDtcCareUrl, doeDtcFeedbackUrl, doeDtcGuideUrl, doeDtcListenUrl, doeDtcPrepareUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import {
  formatDoeDtcAppointmentWhen,
  normalizeDoeDtcAppointmentTiming,
  type DoeDtcAppointmentTimingPrecision,
} from "@/lib/doedtc/doedtc-appointment-timing";
import { normalizeArtifactLayout } from "@/lib/doedtc/doedtc-artifacts";
import {
  addDoeDtcAppointment,
  addDoeDtcHouseholdMember,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  archiveDoeDtcArtifact,
  createDoeDtcArtifact,
  createDoeDtcHouseholdInvite,
  findDoeDtcArtifactByTitle,
  logDoeDtcArtifactEntry,
  removeDoeDtcArtifactEntry,
  removeDoeDtcCondition,
  removeDoeDtcMedication,
  renameDoeDtcCondition,
  renameDoeDtcMedication,
  resolveDoeDtcHouseholdSubject,
  revokeDoeDtcHouseholdAccess,
  shareDoeDtcArtifact,
  unshareDoeDtcArtifact,
  updateDoeDtcArtifact,
  updateDoeDtcArtifactEntry,
  createDoeDtcListenSession,
  createDoeDtcPreparation,
  createDoeDtcTicket,
  getDoeDtcProfileSnapshot,
  insertDoeDtcMemory,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  listDoeDtcMessages,
  loadDoeDtcHouseholdAccessContext,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import {
  findHouseholdMemberByName,
  formatHouseholdForAgent,
  isHouseholdMemberAdult,
} from "@/lib/doedtc/doedtc-household";
import {
  findAccountabilityPactForUser,
  inviteAccountabilityPartner,
  logAccountabilityCheckIn,
  pauseAccountabilityPact,
  resumeAccountabilityPact,
  startAccountabilityPact,
  withdrawAccountabilityPact,
} from "@/lib/doedtc/doedtc-accountability-db";
import {
  formatAccountabilityForAgent,
  normalizeAccountabilityMechanics,
} from "@/lib/doedtc/doedtc-accountability";
import {
  cancelScheduledText,
  createScheduledText,
  listScheduledTextsForUser,
  resolveScheduledTextRecipient,
  sendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled-db";
import {
  agentNowLabel,
  ensureFutureSendAt,
  formatScheduledSendAtLabel,
  formatScheduledTextForAgent,
  isPendingOfferText,
  isScheduleOfferText,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
  shouldSendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled";
import {
  buildHabitWorkflowConfig,
  cancelWorkflow,
  createHabitWorkflow,
  formatWorkflowsForAgent,
  listActiveWorkflowsForUser,
} from "@/lib/doedtc/doedtc-workflows";
import {
  createDoeDtcGuide,
  listGuidesForUser,
  saveDoeDtcGuide,
  updateDoeDtcGuide,
} from "@/lib/doedtc/doedtc-guides-db";
import {
  formatGuideForAgent,
  isGuideSaveOfferText,
  normalizeGuideBlocks,
  normalizeGuideLayout,
} from "@/lib/doedtc/doedtc-guides";
import { sendDoeDtcFamilyInviteMessage, sendDoeDtcHouseholdAccessRevokedNotice } from "@/lib/doedtc/doedtc-messaging";
import {
  DOEDTC_PROFILE_READ_TABS,
  formatDoeDtcProfileOverview,
  readDoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-profile-read";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";
import type {
  DoeDtcAppointmentRow,
  DoeDtcAssessmentResult,
  DoeDtcAssessmentRow,
  DoeDtcFamilyMemberRow,
  DoeDtcFamilyRelationship,
  DoeDtcMessageRow,
  DoeDtcProfileTab,
  DoeDtcSymptomRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const DOEDTC_AGENT_MODEL = "gpt-4o";
const DOEDTC_ASSESSMENT_MODEL = "gpt-4o-mini";
const MAX_TOOL_ROUNDS = 8;

const HOUSEHOLD_MEMBER_PARAMS = {
  member_id: { type: "string", description: "Household member id from the family tab." },
  member_name: { type: "string", description: "Family member name when id is unknown." },
} as const;

export const DOEDTC_AGENT_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "log_symptoms",
      description:
        "Log reported symptoms to the user's symptom history. Call whenever the user describes symptoms, even if also assessing.",
      parameters: {
        type: "object",
        properties: {
          raw_text: { type: "string", description: "What the user reported in their own words." },
          summary: { type: "string", description: "Short clinical summary of the symptom report." },
          severity: {
            type: "string",
            enum: ["mild", "moderate", "severe", "unknown"],
          },
          onset: { type: "string", description: "When symptoms started, if known." },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Short tags like headache, fever, chest pain.",
          },
        },
        required: ["raw_text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "run_assessment",
      description:
        "Generate a structured clinical review when there is enough information or the user asks what it might be.",
      parameters: {
        type: "object",
        properties: {
          symptoms_text: {
            type: "string",
            description: "Combined symptom narrative to assess.",
          },
          focus: {
            type: "string",
            description: "Optional focus area for the assessment.",
          },
        },
        required: ["symptoms_text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_appointment",
      description:
        "Save a medical appointment. Never invent a date or time. Use approximate when timing is vague (next week, soon). Use day when the user names a specific day without a time. Use exact only when they give date and time.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "What the appointment is for, e.g. Asthma follow-up." },
          timing_precision: {
            type: "string",
            enum: ["exact", "day", "approximate"],
            description:
              "exact = user gave date and time. day = user named a specific day only. approximate = vague window like next week or soon.",
          },
          starts_at: {
            type: "string",
            description:
              "ISO 8601 datetime. Required for exact or day. Omit for approximate — never guess.",
          },
          timing_note: {
            type: "string",
            description:
              "User's exact vague wording, e.g. next week. Required when timing_precision is approximate.",
          },
          location: { type: "string", description: "Clinic or location if known." },
          notes: { type: "string", description: "Any extra context the user shared." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["title", "timing_precision"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_family_member",
      description:
        "Add a person to the user's Family chart. Call for each named family member. Use relationship child for sons/daughters. If they mention kids without names, still call with full_name Child.",
      parameters: {
        type: "object",
        properties: {
          full_name: { type: "string", description: "The family member's name." },
          relationship: {
            type: "string",
            enum: [
              "grandmother",
              "grandfather",
              "mother",
              "father",
              "child",
              "sibling",
              "partner",
              "other",
            ],
            description: "Use child for son or daughter.",
          },
          phone: { type: "string", description: "Phone number if the user shared one." },
          date_of_birth: {
            type: "string",
            description: "Optional ISO date for children — needed for 18+ consent on invite.",
          },
        },
        required: ["full_name", "relationship"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_family_invite",
      description:
        "Text a family invite link to a household member who has a phone but has not joined Doe yet. Only call after the user says yes.",
      parameters: {
        type: "object",
        properties: {
          member_id: { type: "string", description: "Household member id." },
          member_name: { type: "string", description: "Family member name if id is unknown." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "add_medication",
      description:
        "Add a medication to the user's profile. Call when they mention a medicine they take. Never use remember_fact for medications. If they are changing an existing medication, use update_medication instead.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Medication name, e.g. Metformin." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "add_condition",
      description:
        "Add a medical condition or diagnosis to the user's profile. Call when they mention a condition they have. Never use remember_fact for conditions. If they are changing an existing condition, use update_condition instead.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Condition name, e.g. Asthma." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_medication",
      description:
        "Replace an existing medication name on the profile. Use when they correct or change a medication. Do not add a second copy.",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Current medication name on the profile." },
          to: { type: "string", description: "Replacement medication name." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["from", "to"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_medication",
      description: "Remove a medication from the profile.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Medication name to remove." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_condition",
      description:
        "Replace an existing condition name on the profile. Use when they correct or change a condition. Do not add a second copy.",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Current condition name on the profile." },
          to: { type: "string", description: "Replacement condition name." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["from", "to"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_condition",
      description: "Remove a medical condition from the profile.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Condition name to remove." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_profile_artifact",
      description:
        "Create a schema-driven tracker on the user's profile (e.g. Ozempic shots, water intake, mood). Use when they want to track, log, count, or keep a list over time — not for one-off questions. Prefer updating an existing matching tracker instead of creating a duplicate.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Tracker title, e.g. Ozempic shots." },
          kind: {
            type: "string",
            enum: ["log", "counter", "checklist", "score"],
            description: "Tracker type. Default log.",
          },
          fields: {
            type: "array",
            description:
              "Form fields for each entry. Each item: key, label, type (text|number|select|date|datetime|boolean), optional options array for select, optional boolean optional.",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                label: { type: "string" },
                type: {
                  type: "string",
                  enum: ["text", "number", "select", "date", "datetime", "boolean"],
                },
                optional: { type: "boolean" },
                options: { type: "array", items: { type: "string" } },
              },
              required: ["key", "label", "type"],
            },
          },
          layout: {
            type: "string",
            enum: ["log", "series", "counter", "checklist", "score"],
            description: "Visual layout. Calorie/weight → series; water → counter; mood → score.",
          },
          blocks: {
            type: "array",
            description:
              "Presentation blocks (hero, stats, chart, counter, gauge, week_grid, checklist_today, form, log, goal, callout, illustration). Max ~10.",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          goal: {
            type: "number",
            description: "Optional numeric goal for chart goal line (e.g. daily calorie target).",
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_profile_artifact",
      description:
        "Rename a tracker, change its fields, or archive it. Use artifact_id from read_profile trackers tab.",
      parameters: {
        type: "object",
        properties: {
          artifact_id: { type: "string", description: "Tracker id." },
          title: { type: "string", description: "New title." },
          kind: {
            type: "string",
            enum: ["log", "counter", "checklist", "score"],
          },
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                label: { type: "string" },
                type: {
                  type: "string",
                  enum: ["text", "number", "select", "date", "datetime", "boolean"],
                },
                optional: { type: "boolean" },
                options: { type: "array", items: { type: "string" } },
              },
              required: ["key", "label", "type"],
            },
          },
          layout: {
            type: "string",
            enum: ["log", "series", "counter", "checklist", "score"],
          },
          blocks: {
            type: "array",
            items: { type: "object", additionalProperties: true },
          },
          goal: { type: "number" },
          archive: { type: "boolean", description: "Set true to archive this tracker." },
        },
        required: ["artifact_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_artifact_entry",
      description: "Log a new entry on a profile tracker.",
      parameters: {
        type: "object",
        properties: {
          artifact_id: { type: "string", description: "Tracker id." },
          values: {
            type: "object",
            description: "Field values keyed by field key.",
            additionalProperties: true,
          },
          occurred_at: {
            type: "string",
            description: "Optional ISO datetime for when this happened.",
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["artifact_id", "values"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "share_artifact",
      description:
        "Share a profile tracker via a public read-only link. Call only after they ask to share a named tracker. Never auto-share on create.",
      parameters: {
        type: "object",
        properties: {
          artifact_id: { type: "string", description: "Tracker id from read_profile." },
          title: { type: "string", description: "Tracker title if id unknown." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "unshare_artifact",
      description: "Stop sharing a profile tracker (revokes the public link).",
      parameters: {
        type: "object",
        properties: {
          artifact_id: { type: "string", description: "Tracker id." },
        },
        required: ["artifact_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_artifact_entry",
      description: "Update an existing tracker entry.",
      parameters: {
        type: "object",
        properties: {
          entry_id: { type: "string", description: "Entry id." },
          values: {
            type: "object",
            additionalProperties: true,
          },
          occurred_at: { type: "string" },
        },
        required: ["entry_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_artifact_entry",
      description: "Delete a tracker entry.",
      parameters: {
        type: "object",
        properties: {
          entry_id: { type: "string", description: "Entry id." },
        },
        required: ["entry_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_preparation",
      description:
        "Create a one-off visit-prep summary the patient can share with their provider via a 5-digit code. Call when they say prepare, or ask for a summary for their doctor, visit, or refill. Use a general health snapshot if no specific reason is given.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Optional short title for the summary page." },
          reason: {
            type: "string",
            description: "Optional visit reason, e.g. Ozempic refill, annual checkup.",
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_guide",
      description:
        "Create a visual how-to guide from typed blocks (hero, steps, checklist, timeline, dose_card, site_map, callout, do_dont, faq, facts, illustration). Call when they ask for a guide, visual instructions, or how-to (e.g. take Ozempic). Do NOT auto-save to profile — ask if they want it saved after sending the link.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "Plain-language request, e.g. take Ozempic properly." },
          title: { type: "string", description: "Short page title." },
          layout: {
            type: "string",
            enum: ["howto", "schedule", "checklist", "explainer", "comparison"],
          },
          blocks: {
            type: "array",
            description:
              "Ordered blocks. Each needs kind and fields for that kind. Always include educational disclaimer via disclaimer kind or let the server append one.",
            items: { type: "object" },
          },
        },
        required: ["topic", "title"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "save_guide",
      description: "Save a guide to the user's profile Guides tab after they confirm.",
      parameters: {
        type: "object",
        properties: {
          guide_id: { type: "string" },
          title_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_guide",
      description:
        "Edit an existing guide — replace blocks, add steps, retitle, etc. Use guide_id or title_hint to pick the guide.",
      parameters: {
        type: "object",
        properties: {
          guide_id: { type: "string" },
          title_hint: { type: "string" },
          title: { type: "string" },
          topic: { type: "string" },
          layout: {
            type: "string",
            enum: ["howto", "schedule", "checklist", "explainer", "comparison"],
          },
          blocks: { type: "array", items: { type: "object" } },
          replace_blocks: { type: "boolean", description: "If true, replace all blocks. If false, append/patch." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_guides",
      description: "List recent guides (saved and unsaved).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_guide_link",
      description: "Re-send the link for an existing guide (e.g. send my Ozempic guide).",
      parameters: {
        type: "object",
        properties: {
          guide_id: { type: "string" },
          title_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "submit_ticket",
      description:
        "Submit user feedback or a bug report. Call when they ask to send feedback, report a bug, or file something that went wrong. Do not use for one-off product questions.",
      parameters: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            enum: ["feedback", "bug"],
            description: "feedback for suggestions; bug for something broken or a mistake.",
          },
          title: { type: "string", description: "Short summary." },
          body: { type: "string", description: "Full description of the feedback or bug." },
        },
        required: ["kind", "title", "body"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remember_fact",
      description:
        "Store a durable preference or context (doctor name, travel plans). Not for symptoms, family chart entries, medications, or conditions.",
      parameters: {
        type: "object",
        properties: {
          fact: { type: "string", description: "The fact to remember in plain language." },
          category: {
            type: "string",
            description: "Short category like provider, preference, family, general.",
          },
        },
        required: ["fact"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_listen",
      description:
        "Create a Listen session for recording and transcribing a medical visit. You MUST call this before telling the user a Listen link is coming.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: {
            type: "string",
            description: "Optional existing appointment id to link this recording to.",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_profile_link",
      description:
        "Send the user's Doe profile link. You MUST call this before telling the user a profile or dashboard link is coming. For a family member, pass member_id or member_name.",
      parameters: {
        type: "object",
        properties: {
          tab: { type: "string", description: "Optional profile tab to open." },
          artifact: {
            type: "string",
            description: "Optional tracker id to deep-link on the Trackers tab (private profile link, not public share).",
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "read_profile",
      description:
        "Read a Doe profile tab (dashboard/integrations, appointments, results, conditions, family, locker, share, trackers, guides, accountability, feedback). Use this to answer questions about what is already saved — Whoop, Apple Health, meds, locker sites, results, share codes, custom trackers, saved guides, accountability pacts, feedback/bug reports. Never invent status. This is a read, not an add.",
      parameters: {
        type: "object",
        properties: {
          tab: {
            type: "string",
            enum: [...DOEDTC_PROFILE_READ_TABS],
            description: "Profile tab to read. Use dashboard for Whoop, Apple Health, name, and email.",
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["tab"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_browser_task",
      description:
        "Browse the web and screenshot the page. For 'go to Google and type mayo', call once with url google and intent type mayo — do not type into the box yourself. Selector is optional for later typing.",
      parameters: {
        type: "object",
        properties: {
          intent: {
            type: "string",
            description: "What to find or do, e.g. type mayo, search asthma.",
          },
          url: {
            type: "string",
            description: "Site nickname (mayo, google), hostname, or full URL. Optional if intent has the site.",
          },
          mode: { type: "string", enum: ["research", "login", "write"] },
        },
        required: ["intent"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_navigate",
      description: "Navigate the active browser task to a URL or site nickname.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_act",
      description:
        "Click, type, or scroll in the active browser task. For type, selector is optional — Doe finds the search box. Prefer start_browser_task with the query instead of typing on Google.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["click", "type", "scroll"] },
          selector: { type: "string" },
          text: { type: "string" },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "browser_snapshot",
      description:
        "Screenshot the current browser page and send the image to the patient in iMessage. Use when they ask for a screenshot, picture, or to see the page.",
      parameters: {
        type: "object",
        properties: {
          caption: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_vault",
      description: "Send a secure vault link so the patient can sign in on the web. Never ask for passwords in iMessage.",
      parameters: {
        type: "object",
        properties: {
          host: { type: "string", description: "Site hostname, e.g. mychart.example.org" },
        },
        required: ["host"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_live_login",
      description: "Send a Live View link so the patient can log in themselves.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "show_session",
      description:
        "Send the Doe live session page so the patient can watch the browser work. Use when they ask to watch, stream, see a live session, or follow along — if a browser task is active. Never say you cannot stream. Never send the raw Kernel URL.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "propose_scheduled_text",
      description:
        "Draft a one-time text when who/when is ambiguous or it texts someone else without a clear ask. If they already asked with enough detail, call schedule_text instead. Do NOT persist until they confirm.",
      parameters: {
        type: "object",
        properties: {
          intent: { type: "string", description: "Plain-language reason for the text." },
          body: { type: "string", description: "SMS body to send." },
          send_at: {
            type: "string",
            description:
              "Local wall-clock time — tomorrow at 8am, at 8, 8pm, in 2 hours, in 5 seconds, for 30 seconds, or naive ISO like 2026-08-30T08:00. Sub-minute timers send inline.",
          },
          timezone: { type: "string", description: "IANA timezone, e.g. America/New_York. Defaults to Eastern." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["intent", "body", "send_at"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "schedule_text",
      description:
        "Commit a one-time outbound text. Default when they already asked (timers, self-reminders, make-sure tonight). Supports in N seconds for sub-minute timers.",
      parameters: {
        type: "object",
        properties: {
          intent: { type: "string" },
          body: { type: "string" },
          send_at: { type: "string" },
          timezone: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["intent", "body", "send_at"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "cancel_scheduled_text",
      description: "Cancel a pending scheduled text.",
      parameters: {
        type: "object",
        properties: {
          scheduled_text_id: { type: "string" },
          intent_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_scheduled_texts",
      description: "List pending scheduled texts for the user.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "revoke_household_access",
      description:
        "Revoke this user's household profile sharing (self only). Under 18: after they clearly ask. 18+: only after explicit confirmation.",
      parameters: {
        type: "object",
        properties: {
          confirmed: { type: "boolean", description: "True only after the user explicitly confirms." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "propose_accountability",
      description:
        "Draft recurring check-ins when who/when is ambiguous or it texts someone else without a clear ask. If they already asked with names and a reasonable time, call start_accountability or start_habit_workflow instead. Do NOT persist until they confirm.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short title, e.g. Evening brushing." },
          goal: { type: "string", description: "Plain-language goal." },
          subject_name: { type: "string", description: "Who the goal is for." },
          involve_partner: { type: "boolean", description: "Whether a partner/sponsor should be invited." },
          partner_name: { type: "string" },
          partner_phone: { type: "string" },
          mechanics: {
            type: "object",
            properties: {
              cadence: { type: "string", enum: ["daily", "weekdays", "weekly", "on_demand"] },
              timezone: { type: "string" },
              check_in_hour: { type: "number", description: "0-23 local hour for scheduled ping." },
              who_gets_check_in: { type: "string", enum: ["subject", "partner", "both", "owner"] },
              confirmation: { type: "string", enum: ["self", "partner", "either"] },
              miss_notify_partner: { type: "boolean" },
              privacy: { type: "string", enum: ["high", "normal"] },
            },
          },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "subject_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_accountability",
      description:
        "Commit recurring check-ins (legacy pact). Prefer start_habit_workflow for daily habits with miss notify. Call when they already asked or after confirm.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          goal: { type: "string" },
          subject_name: { type: "string" },
          involve_partner: { type: "boolean" },
          partner_name: { type: "string" },
          partner_phone: { type: "string" },
          mechanics: { type: "object" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "subject_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "propose_habit_workflow",
      description:
        "Draft a daily habit workflow (send → await reply → notify on miss) when who/when is ambiguous or it texts someone else without a clear ask. If they already asked, call start_habit_workflow instead.",
      parameters: {
        type: "object",
        properties: {
          goal: { type: "string", description: "Plain-language habit goal." },
          subject_name: { type: "string", description: "Who the habit is for." },
          check_in_hour: { type: "number", description: "0-23 local hour. Default evening ~19." },
          check_in_body: { type: "string", description: "SMS body for the daily ping." },
          await_timeout_minutes: { type: "number", description: "Minutes to wait for reply before notifying parent. Default 120." },
          timezone: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "subject_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_habit_workflow",
      description:
        "Commit a daily habit workflow: text subject at check_in_hour, await yes/no, notify owner on miss. Default for make-sure-daily asks when they already asked.",
      parameters: {
        type: "object",
        properties: {
          goal: { type: "string" },
          subject_name: { type: "string" },
          check_in_hour: { type: "number" },
          check_in_body: { type: "string" },
          await_timeout_minutes: { type: "number" },
          timezone: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "subject_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "cancel_habit_workflow",
      description: "Cancel an active habit workflow.",
      parameters: {
        type: "object",
        properties: {
          workflow_id: { type: "string" },
          goal_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "invite_accountability_partner",
      description: "Text a partner invite for an existing pact after the user confirms phone/name.",
      parameters: {
        type: "object",
        properties: {
          pact_id: { type: "string" },
          partner_name: { type: "string" },
          partner_phone: { type: "string" },
        },
        required: ["partner_phone"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_accountability_checkin",
      description: "Log a yes/no/skip check-in on an accountability pact.",
      parameters: {
        type: "object",
        properties: {
          pact_id: { type: "string" },
          goal_hint: { type: "string", description: "Goal or title if pact_id unknown." },
          outcome: { type: "string", enum: ["yes", "no", "skip"] },
          note: { type: "string" },
        },
        required: ["outcome"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "withdraw_accountability",
      description: "Withdraw a pact (owner only) after explicit confirmation. Stops check-ins and notifies participants.",
      parameters: {
        type: "object",
        properties: {
          pact_id: { type: "string" },
          goal_hint: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "pause_accountability",
      description: "Pause scheduled check-ins without deleting history (owner only).",
      parameters: {
        type: "object",
        properties: {
          pact_id: { type: "string" },
          goal_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "resume_accountability",
      description: "Resume a paused accountability pact (owner only).",
      parameters: {
        type: "object",
        properties: {
          pact_id: { type: "string" },
          goal_hint: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "react_to_message",
      description:
        "Rarely react to the patient's latest iMessage with a custom emoji. Use sparingly — not every turn, not for CONFIRM/STOP/Hi Doe. Vary emojis.",
      parameters: {
        type: "object",
        properties: {
          emoji: { type: "string", description: "Single emoji, e.g. 👍, 🙏, 💪" },
        },
        required: ["emoji"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "use_thread_reply",
      description:
        "Occasionally reply in-thread to the patient's latest iMessage (iOS reply-to). Use for direct answers or corrections — not every turn, never for link-only replies.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_commit",
      description: "Prepare an irreversible browser action and ask the patient to reply CONFIRM.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string" },
          label: { type: "string", description: "Plain-language description of the action." },
          url: { type: "string" },
        },
        required: ["selector", "label"],
      },
    },
  },
];

type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; content: string };

export type DoeDtcAgentTurnResult = {
  replyText: string;
  careUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  feedbackUrl?: string;
  prepareUrl?: string;
  guideUrl?: string;
  artifactShareUrl?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  reactionEmoji?: string;
  replyToInbound?: boolean;
  browserNeedsConfirm?: boolean;
  assessmentRan: boolean;
  preservePendingOffer?: boolean;
};

const URL_IN_TEXT = /https?:\/\/\S+/gi;
const CLOSER_TAIL =
  /(?:\s*[,.!]+\s*)?(?:feel free to (?:ask|let me know|reach out|text|message)(?:\b.{0,80})?|let me know if (?:you(?:'d| would)? (?:like|want|need)|you have |there's |you need ).{0,80}|if there(?:'s| is) anything you need.{0,40}|if you need anything.{0,40}|here if you need me.{0,20}|just let me know(?:\b.{0,60})?|let me know\.[!?.,]?\s*$|don'?t hesitate to (?:ask|reach out|text).{0,40}|happy to (?:help|chat|look)(?:\b.{0,40})?(?: if you want)?|(?:is there )?anything else I can (?:help|do).{0,40}|what else can I (?:help|do).{0,40}|(?:^|(?<=[.!?]\s))want me to .{0,80}|i can also (?:help|look|check|do|add).{0,60}|just say the word[!?.,]?\s*$)[!?.,]?\s*$/i;
const KEEP_CLOSER_RATE = 0.08;
const INCOMPLETE_FRAGMENT_START =
  /^(if|when|want|let me|feel free|i can also|what else|anything else|is there|do you|would you|should i|can i|could you)\b/i;

function looksIncompleteFragment(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/[.!?]$/.test(trimmed)) return false;
  if (INCOMPLETE_FRAGMENT_START.test(trimmed)) return true;
  if (/[,;…]$/.test(trimmed) || /\.{2,}$/.test(trimmed)) return true;
  if (/\bif you\b/i.test(trimmed)) return true;
  return false;
}

function splitCompleteAndTrailing(text: string): { complete: string[]; trailing: string | null } {
  const trimmed = text.trim();
  if (!trimmed) return { complete: [], trailing: null };

  const complete: string[] = [];
  const regex = /[^.!?]+[.!?]+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(trimmed)) !== null) {
    complete.push(match[0].trim());
    lastIndex = regex.lastIndex;
  }
  const trailing = trimmed.slice(lastIndex).trim();
  return { complete, trailing: trailing || null };
}

function dropIncompleteTrailingSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "All set.";

  const { complete, trailing } = splitCompleteAndTrailing(trimmed);

  if (trailing && looksIncompleteFragment(trailing)) {
    const joined = complete.join(" ").trim();
    return joined || "All set.";
  }

  if (complete.length === 0 && looksIncompleteFragment(trimmed)) {
    return "All set.";
  }

  return trimmed;
}

function stripMarkdownFromReply(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1");
}

export function sanitizeDoeDtcReplyText(
  text: string,
  options?: {
    keepCloserRate?: number;
    preservePendingOffer?: boolean;
    /** @deprecated use preservePendingOffer */
    preserveScheduleOffer?: boolean;
    /** @deprecated use preservePendingOffer */
    preserveGuideSaveOffer?: boolean;
  },
): string {
  const withoutMarkdown = stripMarkdownFromReply(text);
  const withoutUrls = withoutMarkdown.replace(URL_IN_TEXT, "");
  const shouldPreserveOffer =
    (options?.preservePendingOffer && isPendingOfferText(withoutUrls)) ||
    (options?.preserveScheduleOffer && isScheduleOfferText(withoutUrls)) ||
    (options?.preserveGuideSaveOffer && isGuideSaveOfferText(withoutUrls));
  const stripped = shouldPreserveOffer ? withoutUrls : withoutUrls.replace(CLOSER_TAIL, "");
  const rate = options?.keepCloserRate ?? KEEP_CLOSER_RATE;
  const keepCloser = stripped !== withoutUrls && Math.random() < rate;
  const normalized = (keepCloser ? withoutUrls : stripped)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[,;]+(?:\s*[.!]*)?\s*$/g, "")
    .trim();
  const cleaned = dropIncompleteTrailingSentence(normalized);
  if (looksCapabilityHedge(cleaned) && !hasConcretePlan(cleaned)) {
    return "Tell me who to text and when, and I'll set it up.";
  }
  return cleaned;
}

function compactTranscript(messages: DoeDtcMessageRow[]): string {
  const lines = messages
    .filter((entry) => entry.body.trim())
    .map((entry) => {
      const speaker = entry.direction === "inbound" ? "User" : "Doe";
      return `${speaker}: ${entry.body.trim()}`;
    });
  const joined = lines.join("\n");
  if (joined.length <= 9000) return joined;
  return joined.slice(joined.length - 9000);
}

function formatSymptomLog(symptoms: DoeDtcSymptomRow[]): string {
  if (symptoms.length === 0) return "No prior symptom logs.";
  return symptoms
    .map((row) => {
      const label = row.summary?.trim() || row.raw_text.trim();
      const parts = [label];
      if (row.severity !== "unknown") parts.push(`severity: ${row.severity}`);
      if (row.onset) parts.push(`onset: ${row.onset}`);
      if (row.tags.length > 0) parts.push(`tags: ${row.tags.join(", ")}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatAssessmentHistory(assessments: DoeDtcAssessmentRow[]): string {
  if (assessments.length === 0) return "No prior assessments.";
  return assessments
    .map((row) => `- ${row.result.summary} (reported: ${row.symptoms_text.slice(0, 120)})`)
    .join("\n");
}

function formatAppointmentLog(appointments: DoeDtcAppointmentRow[]): string {
  if (appointments.length === 0) return "No appointments logged.";
  return appointments
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      const parts = [`${row.title} | when: ${when}`];
      if (row.timing_note) parts.push("(approximate — do not state as an exact calendar datetime)");
      if (row.location) parts.push(`at ${row.location}`);
      if (row.notes) parts.push(`notes: ${row.notes}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatFamilyLog(familyMembers: DoeDtcFamilyMemberRow[]): string {
  if (familyMembers.length === 0) return "No family members logged.";
  return familyMembers
    .map((row) => {
      const parts = [`${row.full_name} (${row.relationship})`];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

async function resolveAgentHouseholdSubject(params: {
  viewerUserId: string;
  args: Record<string, unknown>;
  requireEdit?: boolean;
}): Promise<
  | { subjectUserId: string; subjectMemberId?: string; subjectMemberName?: string }
  | { error: string }
> {
  const memberId = typeof params.args.member_id === "string" ? params.args.member_id.trim() : "";
  const memberName = typeof params.args.member_name === "string" ? params.args.member_name.trim() : "";
  if (!memberId && !memberName) {
    return { subjectUserId: params.viewerUserId };
  }
  const resolved = await resolveDoeDtcHouseholdSubject({
    viewerUserId: params.viewerUserId,
    memberId: memberId || null,
    memberName: memberName || null,
  });
  if ("error" in resolved) return { error: resolved.error };
  if (!resolved.canView) {
    return { error: `You do not have permission to view ${resolved.subjectMember.full_name}'s profile.` };
  }
  if (params.requireEdit && !resolved.canEdit) {
    return {
      error: `You do not have permission to edit ${resolved.subjectMember.full_name}'s profile.`,
    };
  }
  return {
    subjectUserId: resolved.subjectUserId,
    subjectMemberId: resolved.subjectMember.id,
    subjectMemberName: resolved.subjectMember.full_name,
  };
}

function replyClaimsListenLink(text: string): boolean {
  return (
    /\b(listen|record(?:ing)?|transcrib(?:e|ing)?)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

function replyClaimsProfileLink(text: string): boolean {
  return (
    /\b(profile|dashboard|appointments?\s*page)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

function inboundWantsLiveSession(text: string): boolean {
  return /\b(watch|stream|live(?:\s+(?:view|session|browser|sandbox))?|see (?:the )?(?:browser|session|sandbox)|follow along)\b/i.test(
    text,
  );
}

function replyRefusesLiveSession(text: string): boolean {
  return /\b(can'?t|cannot|unable to|don'?t|won'?t|not able to)\b.{0,60}\b(stream|live|watch|session)\b/i.test(
    text,
  );
}

function replyClaimsSessionLink(text: string): boolean {
  return (
    /\b(session|live view|watch|sandbox)\b/i.test(text) &&
    /\b(link|send(?:ing)?|here'?s)\b/i.test(text)
  );
}

async function fulfillClaimedLinks(params: {
  user: DoeDtcUserRow;
  replyText: string;
  inboundText: string;
  listenUrl?: string;
  profileUrl?: string;
  sessionUrl?: string;
  activeBrowserJobId: string | null;
}): Promise<{ listenUrl?: string; profileUrl?: string; sessionUrl?: string; replyText: string }> {
  let listenUrl = params.listenUrl;
  let profileUrl = params.profileUrl;
  let sessionUrl = params.sessionUrl;
  let replyText = params.replyText;

  if (!listenUrl && replyClaimsListenLink(params.replyText)) {
    const session = await createDoeDtcListenSession({ userId: params.user.id });
    listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
  }

  if (!profileUrl && replyClaimsProfileLink(params.replyText)) {
    profileUrl = doeDtcAppUrl(params.user.care_token);
  }

  const shouldSendSession =
    Boolean(params.activeBrowserJobId) &&
    (inboundWantsLiveSession(params.inboundText) ||
      replyClaimsSessionLink(params.replyText) ||
      replyRefusesLiveSession(params.replyText));

  if (!sessionUrl && shouldSendSession) {
    sessionUrl = doeDtcSessionUrl(params.user.care_token);
  }

  if (sessionUrl && replyRefusesLiveSession(replyText)) {
    replyText = "Sending a live session link so you can watch.";
  }

  return { listenUrl, profileUrl, sessionUrl, replyText };
}

function buildReplyFromTurnState(params: {
  modelContent?: string | null;
  assessmentSummary?: string;
  browserNeedsConfirm: boolean;
  browserExcerpt?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  feedbackUrl?: string;
  prepareUrl?: string;
  guideUrl?: string;
  artifactShareUrl?: string;
  browserUserMessage?: string;
  preservePendingOffer?: boolean;
}): string {
  if (params.browserUserMessage?.trim()) {
    return sanitizeDoeDtcReplyText(params.browserUserMessage, {
      preservePendingOffer: params.preservePendingOffer,
    });
  }

  const trimmed = params.modelContent?.trim();
  if (trimmed) {
    return sanitizeDoeDtcReplyText(trimmed, {
      preservePendingOffer: params.preservePendingOffer,
    });
  }

  if (params.assessmentSummary) return params.assessmentSummary;
  if (params.browserNeedsConfirm) return "Reply CONFIRM to proceed, or STOP to cancel.";
  if (params.browserExcerpt) {
    const snippet = params.browserExcerpt.replace(/\s+/g, " ").trim().slice(0, 280);
    return snippet.length > 0 ? snippet : "Here's what I found — sending a preview.";
  }
  if (params.workUrl) return "Here's what I found — sending a preview.";
  if (params.screenshotUrl) return "Here's a screenshot of the page.";
  if (params.vaultUrl) return "Sending a secure sign-in link.";
  if (params.liveViewUrl) return "Sending a Live View link so you can sign in.";
  if (params.sessionUrl) return "Sending a live session link so you can watch.";
  if (params.listenUrl) return "Sending a Listen link to record your visit.";
  if (params.profileUrl) return "Sending your profile link.";
  if (params.feedbackUrl) return "Sending a link to track your report.";
  if (params.prepareUrl) return "Sending your visit prep summary.";
  if (params.guideUrl) return "Sending your guide.";
  if (params.artifactShareUrl) return "Sending your shared tracker link.";

  return "Got it.";
}

function buildSystemPrompt(params: {
  user: DoeDtcUserRow;
  medications: string[];
  conditions: string[];
  transcript: string;
  symptomLog: string;
  assessmentHistory: string;
  appointmentLog: string;
  relevantMemories: string;
  playbookNotes: string;
  pendingBlock: string;
  familyLog: string;
  householdLog: string;
  accountabilityLog: string;
  scheduledLog: string;
  workflowsLog: string;
  guidesLog: string;
  profileOverview: string;
  nowLabel: string;
}): string {
  return `${buildDoeAgentVoiceBlock()}

${DOE_AGENT_ACTION_POLICY}

Now (user local time): ${params.nowLabel}.
${params.pendingBlock ? `\n${params.pendingBlock}\n` : ""}
Playbook (how you've corrected yourself before):
${params.playbookNotes}

Profile:

- Name: ${params.user.full_name ?? "Unknown"}
- Medications: ${params.medications.join(", ") || "None listed"}
- Conditions: ${params.conditions.join(", ") || "None listed"}
- Why using Doe: ${params.user.why_doe ?? "Not specified"}

Profile tabs (read with read_profile if you need more detail):
${params.profileOverview}

Recent conversation:
${params.transcript || "No prior messages."}

Appointments:
${params.appointmentLog}

Family chart:
${params.familyLog}

Household (shared family):
${params.householdLog}

Accountability pacts:
${params.accountabilityLog}

Scheduled texts:
${params.scheduledLog}

Habit workflows:
${params.workflowsLog}

Guides (saved + recent):
${params.guidesLog}

Relevant memories:
${params.relevantMemories}

Symptom log:
${params.symptomLog}

Prior assessments:
${params.assessmentHistory}

What you can do:
- Log symptoms, run structured reviews, track appointments and family members.
- Add medications (add_medication) and conditions (add_condition) to the profile.
- To change a medication or condition, use update_medication / update_condition. Never add a second copy and leave the old name.
- To delete one, use remove_medication / remove_condition.
- Add family members to the Family chart (log_family_member) — never remember_fact for family.
- If a named family member has a phone but has not joined Doe yet, you may offer to send an invite (send_family_invite) — do not auto-invite without a yes. Same after log_family_member when a phone is present.
- When they ask how a family member is doing, their next appointment, symptoms last week, or to prepare a child's summary, use read_profile / create_preparation / trackers with member_id or member_name — do not say you cannot see family.
- send_family_invite texts a join link. Only the household admin can add/remove members or send invites.
${DOE_AGENT_MAKE_SURE_ROUTING}
- One-time texts / timers: schedule_text when they already asked (including in N seconds). propose_scheduled_text only if confirm_once applies. list_scheduled_texts / cancel_scheduled_text to manage.
- Daily habits (shower, bath, meds, routines): start_habit_workflow when they already asked — texts subject, awaits reply, notifies owner on miss (~2h). propose_habit_workflow only if ambiguous. cancel_habit_workflow to stop.
- Accountability pacts (legacy recurring): start_accountability when they already asked; propose_accountability only if ambiguous. withdraw/pause/resume as before. Read accountability tab with read_profile.
- Household sharing: only members with can_view can see another member's health profile. revoke_household_access is self-only — minors may revoke immediately after they ask; adults need explicit confirmation (confirmed: true). Never revoke for someone else.
- Send a Listen link to record and transcribe visits (start_listen).
- Read any profile tab with read_profile — dashboard includes Whoop and Apple Health. Answer from that data. Never say you cannot add or cannot see Whoop, locker, results, family, or share.
- If they want to connect Whoop or Apple Health, tell them the current status and send_profile_link so they can tap Connect. Do not treat a status question as an add.
- Send the profile / dashboard link (send_profile_link).
- Create profile trackers (create_profile_artifact) when they want to track, log, count, or keep a list over time — e.g. Ozempic shots, water, mood, calories. Compose layout and presentation blocks: calorie/food → layout series with calories number field + chart block; water → counter; mood → score + gauge. Do not create trackers for one-off questions. Prefer updating an existing matching tracker over a duplicate. Log entries with log_artifact_entry. Read trackers tab with read_profile.
- After creating a tracker or logging a useful entry, send_profile_link with tab=trackers and artifact id so they can view/edit it (private profile link).
- share_artifact when they ask to share a named tracker publicly (read-only link). unshare_artifact when they ask to stop sharing. Never auto-share on create. "Share my calorie tracker" → share_artifact, not create_preparation. "Send my tracker" without share → send_profile_link with artifact.
- Submit feedback or bug reports (submit_ticket) when they ask to send feedback or report a bug. After submitting, send the track link. Read feedback tab with read_profile.
- Create a visit-prep summary (create_preparation) when they say prepare, or ask for something to share with their provider, doctor, visit, or refill. Use a general health snapshot if they do not name a reason. After creating, send the prep link with the 5-digit provider code. For a family member, build it from their profile — a tracker is also saved on their Trackers tab.
- Visual guides (create_guide): when they ask for a how-to, visual instructions, or guide (e.g. take Ozempic properly), compose blocks from the catalog (hero, steps, checklist, timeline, dose_card, site_map, callout, do_dont, faq, facts, illustration). Pick layout howto/schedule/checklist/explainer/comparison. Use profile meds when relevant. After create_guide, send the guide link and ask "Want me to save this to your profile?" — wait for yes before save_guide. update_guide to edit (add steps, change copy). list_guides / send_guide_link to resend. Do NOT use create_preparation for how-to guides.
- After logging an appointment, or when they mention an upcoming visit or refill, you may briefly offer to prepare a provider summary — not every turn, and do not create it unless they ask or say prepare.
- If a tool fails, you cannot complete a task, or you made a mistake, mention they can text "report a bug" or "send feedback" and you will file it. Do not auto-file unless they ask.
- Browse the web via start_browser_task. For "go to Google and type mayo" (or screenshot the result), call once with url google and intent type mayo — that opens search results and screenshots them. Do not try to type into Google with a CSS selector. For general topics without naming Google, one call with the query in intent is enough.
- Screenshot the current page with browser_snapshot when they ask for a picture, screenshot, or to see the page.
- Help with patient portals via request_vault or request_live_login — never ask for passwords in iMessage.
- Send the live session page (show_session) when they want to watch, stream, or follow the browser and a task is active. You can send a live session. Never say you cannot stream or watch a live browser.
- Store preferences and general context with remember_fact — not for meds, conditions, or family chart entries.

Parallel work:
- Only one browser task runs at a time, but you may run other tools in the same turn (log symptoms, family, meds, start_listen, etc.) while a browser job is open.
- Do not wait for browsing to finish before saving profile or appointment data.

iMessage texture:
- react_to_message: rarely, with varied emojis — skip routine turns, CONFIRM/STOP/Hi Doe, and most replies.
- use_thread_reply: occasionally when answering a direct question or correction (~1 in 3 eligible turns), never for link-only bubbles.

Safety:
- Never invent appointment dates or times. Use log_appointment with approximate timing when vague.
- For approximate appointments, repeat the user's vague wording — never convert to an exact datetime.
- Use log_family_member for every family chart entry. Use relationship child for sons/daughters. If names are missing, use full_name Child.
- Use add_medication and add_condition for profile medical info — never remember_fact for those.
- When the patient corrects a med or condition, update or remove the existing row. Do not leave the old name on the profile.
- Never claim a definitive diagnosis. Flag emergencies clearly.
- Irreversible browser actions need request_commit, then the patient replies CONFIRM.
- After useful browser findings, you may store a one-line outcome via remember_fact.`;
}

export async function generateDoeDtcAssessment(params: {
  symptomsText: string;
  medications: string[];
  conditions: string[];
  whyDoe: string;
  focus?: string;
}): Promise<DoeDtcAssessmentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Symptom assessment is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DOEDTC_ASSESSMENT_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Doe, a consumer health companion. Output JSON only with this shape:
{
  "presentingSymptoms": "short restatement of what the user reported",
  "summary": "2-3 sentence plain-language overview for iMessage",
  "findings": [{"name":"condition","why":"why it fits","evidence":["bullet"],"likelihood":"high|moderate|low"}],
  "cantMiss": ["can't-miss diagnosis or red flag"],
  "urgency": "when to seek urgent or emergency care",
  "disclaimer": "Doe is not a doctor and this is not a diagnosis."
}

Rules:
- Use the user's medications, conditions, and goals as context when relevant.
- Rank 3-6 likely explanations with evidence grounded in common clinical reasoning.
- Always include can't-miss/red-flag guidance and a conservative urgency note.
- Never claim a definitive diagnosis. Encourage professional care when appropriate.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            symptoms: params.symptomsText,
            medications: params.medications,
            conditions: params.conditions,
            whyDoe: params.whyDoe,
            focus: params.focus ?? null,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Assessment generation failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Assessment generation returned no content.");
  }

  const parsed = JSON.parse(content) as DoeDtcAssessmentResult;
  return {
    presentingSymptoms: parsed.presentingSymptoms || params.symptomsText,
    summary: parsed.summary || "I reviewed what you shared and put together a few possibilities.",
    findings: Array.isArray(parsed.findings) ? parsed.findings : [],
    cantMiss: Array.isArray(parsed.cantMiss) ? parsed.cantMiss : [],
    urgency: parsed.urgency || "If symptoms worsen or feel unsafe, seek urgent medical care.",
    disclaimer:
      parsed.disclaimer ||
      "Doe is not a doctor and this is not a diagnosis. If you think you're having an emergency, call 911.",
  };
}

async function callDoeDtcAgent(messages: ChatMessage[]): Promise<{
  message: {
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: { name: string; arguments: string };
    }>;
  };
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Doe agent is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DOEDTC_AGENT_MODEL,
      temperature: 0.4,
      tools: DOEDTC_AGENT_TOOLS,
      tool_choice: "auto",
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Doe agent failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: "function";
          function: { name: string; arguments: string };
        }>;
      };
    }>;
  };

  const message = json.choices?.[0]?.message;
  if (!message) {
    throw new Error("Doe agent returned no message.");
  }

  return { message };
}

export async function runDoeDtcAgentTurn(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const timezone = normalizeScheduledTimezone(null);

  const [snapshot, messageHistory, relevantMemoryRows, recentGuides, pendingRow, playbookNotes] =
    await Promise.all([
      getDoeDtcProfileSnapshot(params.user.id),
      listDoeDtcMessages(params.user.id, 40),
      searchDoeDtcMem0Memories({ userId: params.user.id, query: params.inboundText, topK: 5 }),
      listGuidesForUser(params.user.id),
      getAgentPending(params.user.id),
      searchDoeDtcMem0Playbook({ userId: params.user.id, query: params.inboundText, topK: 3 }),
    ]);

  if (pendingRow && parseDecline(params.inboundText)) {
    await clearAgentPending(params.user.id);
    return {
      replyText: "Okay, I won't.",
      assessmentRan: false,
    };
  }

  let affirmCommitFailedNote: string | null = null;
  if (pendingRow && parseAffirmation(params.inboundText)) {
    let commit = await executeAgentPendingCommit({ user: params.user, pending: pendingRow });
    if (!commit.ok && commit.recoverable) {
      commit = await executeAgentPendingCommit({
        user: params.user,
        pending: pendingRow,
        allowRollForward: true,
      });
    }
    if (commit.ok) {
      await clearAgentPending(params.user.id);
      if (commit.playbookNote) {
        await addDoeDtcMem0PlaybookNote({ userId: params.user.id, note: commit.playbookNote });
      }
      return {
        replyText: sanitizeDoeDtcReplyText(commit.replyHint),
        profileUrl: commit.profileUrl,
        assessmentRan: false,
      };
    }
    affirmCommitFailedNote = `Pending ${pendingRow.commit_tool} failed: ${commit.error}. Fix the stored args and call ${pendingRow.commit_tool} — do not propose again or re-ask the same confirmation.`;
  }

  const pendingBlock = pendingRow
    ? `${formatAgentPendingForPrompt(pendingRow)}${affirmCommitFailedNote ? `\n${affirmCommitFailedNote}` : ""}`
    : "";
  const playbookBlock =
    playbookNotes.length > 0 ? playbookNotes.map((note) => `- ${note}`).join("\n") : "None yet.";
  const activeWorkflows = await listActiveWorkflowsForUser(params.user.id);

  const systemPrompt = buildSystemPrompt({
    user: params.user,
    medications: snapshot.medications,
    conditions: snapshot.conditions,
    transcript: compactTranscript(messageHistory),
    symptomLog: formatSymptomLog(snapshot.symptoms),
    assessmentHistory: formatAssessmentHistory(snapshot.assessments),
    appointmentLog: formatAppointmentLog(snapshot.appointments),
    relevantMemories: formatMem0Block(relevantMemoryRows),
    playbookNotes: playbookBlock,
    pendingBlock,
    familyLog: formatFamilyLog(snapshot.familyMembers),
    householdLog: formatHouseholdForAgent({
      household: snapshot.household.household,
      members: snapshot.household.members,
      consents: snapshot.household.consents,
      viewerUserId: params.user.id,
    }),
    accountabilityLog: formatAccountabilityForAgent(snapshot.accountabilityPacts),
    scheduledLog: formatScheduledTextForAgent(snapshot.scheduledTexts.filter((row) => row.status === "pending")),
    workflowsLog: formatWorkflowsForAgent(activeWorkflows),
    guidesLog:
      recentGuides.length === 0
        ? "None yet."
        : recentGuides.map((row) => `- ${formatGuideForAgent(row)} | id: ${row.id}`).join("\n"),
    profileOverview: formatDoeDtcProfileOverview(snapshot),
    nowLabel: agentNowLabel(timezone),
  });

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: params.inboundText },
  ];

  let latestSymptomId: string | null = null;
  let assessmentRan = false;
  let careUrl: string | undefined;
  let listenUrl: string | undefined;
  let profileUrl: string | undefined;
  let feedbackUrl: string | undefined;
  let prepareUrl: string | undefined;
  let guideUrl: string | undefined;
  let artifactShareUrl: string | undefined;
  let workUrl: string | undefined;
  let screenshotUrl: string | undefined;
  let vaultUrl: string | undefined;
  let liveViewUrl: string | undefined;
  let sessionUrl: string | undefined;
  let reactionEmoji: string | undefined;
  let replyToInbound = false;
  let browserNeedsConfirm = false;
  let activeBrowserJobId: string | null = await getActiveDoeDtcBrowserJobId(params.user.id);
  let assessmentSummary: string | undefined;
  let browserExcerpt: string | undefined;
  let browserUserMessage: string | undefined;
  let lastModelContent: string | null = null;
  let preservePendingOffer = false;
  let reflectionNoteInjected = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const toolErrorsThisRound: string[] = [];
    const { message } = await callDoeDtcAgent(messages);
    lastModelContent = message.content;

    if (!message.tool_calls?.length) {
      let replyText = buildReplyFromTurnState({
        modelContent: message.content,
        assessmentSummary,
        browserNeedsConfirm,
        browserExcerpt,
        browserUserMessage,
        workUrl,
        screenshotUrl,
        vaultUrl,
        liveViewUrl,
        sessionUrl,
        listenUrl,
        profileUrl,
        feedbackUrl,
        prepareUrl,
        guideUrl,
        artifactShareUrl,
        preservePendingOffer,
      });

      const fulfilled = await fulfillClaimedLinks({
        user: params.user,
        replyText,
        inboundText: params.inboundText,
        listenUrl,
        profileUrl,
        sessionUrl,
        activeBrowserJobId,
      });
      listenUrl = fulfilled.listenUrl;
      profileUrl = fulfilled.profileUrl;
      sessionUrl = fulfilled.sessionUrl;
      replyText = fulfilled.replyText;

      if (!message.content?.trim()) {
        replyText = buildReplyFromTurnState({
          assessmentSummary,
          browserNeedsConfirm,
          browserExcerpt,
          browserUserMessage,
          workUrl,
          screenshotUrl,
          vaultUrl,
          liveViewUrl,
          sessionUrl,
          listenUrl,
          profileUrl,
          feedbackUrl,
          prepareUrl,
          guideUrl,
          artifactShareUrl,
          preservePendingOffer,
        });
      }

      return {
        replyText,
        careUrl: assessmentRan ? careUrl : undefined,
        listenUrl,
        profileUrl,
        feedbackUrl,
        prepareUrl,
        guideUrl,
        artifactShareUrl,
        workUrl,
        screenshotUrl,
        vaultUrl,
        liveViewUrl,
        sessionUrl,
        reactionEmoji,
        replyToInbound,
        browserNeedsConfirm,
        assessmentRan,
        preservePendingOffer,
      };
    }

    messages.push({
      role: "assistant",
      content: message.content,
      tool_calls: message.tool_calls,
    });

    for (const toolCall of message.tool_calls) {
      let output: Record<string, unknown>;

      try {
        const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;

        if (toolCall.function.name === "log_symptoms") {
          const rawText = String(args.raw_text ?? params.inboundText).trim();
          const row = await insertDoeDtcSymptom({
            userId: params.user.id,
            rawText,
            summary: typeof args.summary === "string" ? args.summary : null,
            severity:
              args.severity === "mild" ||
              args.severity === "moderate" ||
              args.severity === "severe"
                ? args.severity
                : "unknown",
            onset: typeof args.onset === "string" ? args.onset : null,
            tags: Array.isArray(args.tags)
              ? args.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
              : [],
          });
          latestSymptomId = row.id;
          output = { ok: true, id: row.id };
        } else if (toolCall.function.name === "run_assessment") {
          const symptomsText = String(args.symptoms_text ?? params.inboundText).trim();
          const result = await generateDoeDtcAssessment({
            symptomsText,
            medications: snapshot.medications,
            conditions: snapshot.conditions,
            whyDoe: params.user.why_doe ?? "",
            focus: typeof args.focus === "string" ? args.focus : undefined,
          });
          const saved = await saveDoeDtcAssessment({
            userId: params.user.id,
            symptomsText,
            result,
          });
          if (latestSymptomId) {
            await linkDoeDtcSymptomToAssessment({
              symptomId: latestSymptomId,
              assessmentId: saved.id,
            });
          }
          assessmentRan = true;
          assessmentSummary = result.summary;
          careUrl = doeDtcCareUrl(params.user.care_token);
          output = {
            ok: true,
            assessment_id: saved.id,
            summary: result.summary,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "log_appointment") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const precision = String(args.timing_precision ?? "").trim() as DoeDtcAppointmentTimingPrecision;
          const normalized = normalizeDoeDtcAppointmentTiming({
            title: String(args.title ?? ""),
            timing_precision: precision,
            starts_at: typeof args.starts_at === "string" ? args.starts_at : null,
            timing_note: typeof args.timing_note === "string" ? args.timing_note : null,
            location: typeof args.location === "string" ? args.location : null,
            notes: typeof args.notes === "string" ? args.notes : null,
          });
          const row = await addDoeDtcAppointment({
            userId: subject.subjectUserId,
            title: normalized.title,
            startsAt: normalized.startsAt,
            timingNote: normalized.timingNote,
            location: normalized.location,
            notes: normalized.notes,
          });
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            starts_at: row.starts_at,
            timing_note: row.timing_note,
          };
          const when = formatDoeDtcAppointmentWhen(row);
          await addDoeDtcMem0Fact({
            userId: params.user.id,
            fact: `Appointment: ${row.title} — ${when}`,
          });
        } else if (toolCall.function.name === "log_family_member") {
          const relationshipRaw = String(args.relationship ?? "").trim();
          const relationship = normalizeDoeDtcFamilyRelationship(relationshipRaw);
          if (!relationship) throw new Error("Invalid relationship.");
          const fullName = resolveDoeDtcFamilyMemberName({
            fullName: String(args.full_name ?? ""),
            relationship,
          });
          if (!fullName) throw new Error("full_name is required.");
          const row = await addDoeDtcHouseholdMember({
            adminUserId: params.user.id,
            fullName,
            relationship,
            phone: typeof args.phone === "string" ? args.phone : null,
            dateOfBirth: typeof args.date_of_birth === "string" ? args.date_of_birth : null,
          });
          output = {
            ok: true,
            id: row.id,
            full_name: row.full_name,
            relationship: row.relationship,
            status: row.status,
            invite_available: Boolean(row.phone && row.status === "pending"),
          };
        } else if (toolCall.function.name === "send_family_invite") {
          const memberId = String(args.member_id ?? "").trim();
          const memberName = String(args.member_name ?? "").trim();
          let resolvedMemberId = memberId;
          if (!resolvedMemberId && memberName) {
            const { members } = await loadDoeDtcHouseholdAccessContext(params.user.id);
            const member = findHouseholdMemberByName(members, memberName);
            if (!member) throw new Error("Family member not found.");
            resolvedMemberId = member.id;
          }
          if (!resolvedMemberId) throw new Error("member_id or member_name is required.");
          const { invite, member } = await createDoeDtcHouseholdInvite({
            adminUserId: params.user.id,
            memberId: resolvedMemberId,
          });
          await sendDoeDtcFamilyInviteMessage({
            adminUser: params.user,
            memberPhone: member.phone!,
            inviteToken: invite.token,
            memberName: member.full_name,
          });
          output = {
            ok: true,
            member_id: member.id,
            full_name: member.full_name,
            invite_sent: true,
          };
        } else if (toolCall.function.name === "add_medication") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Medication name is required.");
          const result = await appendDoeDtcMedication({ userId: subject.subjectUserId, name });
          output = { ok: true, name: result.name, added: result.added, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "update_medication") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const from = String(args.from ?? "").trim();
          const to = String(args.to ?? "").trim();
          if (!from || !to) throw new Error("Both medication names are required.");
          const result = await renameDoeDtcMedication({ userId: subject.subjectUserId, from, to });
          output = { ok: true, from: result.from, to: result.to, updated: result.updated, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "remove_medication") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Medication name is required.");
          const result = await removeDoeDtcMedication({ userId: subject.subjectUserId, name });
          output = { ok: true, name: result.name, removed: result.removed, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "add_condition") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Condition name is required.");
          const result = await appendDoeDtcCondition({ userId: subject.subjectUserId, name });
          output = { ok: true, name: result.name, added: result.added, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "update_condition") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const from = String(args.from ?? "").trim();
          const to = String(args.to ?? "").trim();
          if (!from || !to) throw new Error("Both condition names are required.");
          const result = await renameDoeDtcCondition({ userId: subject.subjectUserId, from, to });
          output = { ok: true, from: result.from, to: result.to, updated: result.updated, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "remove_condition") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const name = String(args.name ?? "").trim();
          if (!name) throw new Error("Condition name is required.");
          const result = await removeDoeDtcCondition({ userId: subject.subjectUserId, name });
          output = { ok: true, name: result.name, removed: result.removed, subject: subject.subjectMemberName ?? "you" };
        } else if (toolCall.function.name === "create_profile_artifact") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const title = String(args.title ?? "").trim();
          if (!title) throw new Error("Tracker title is required.");
          const existing = await findDoeDtcArtifactByTitle({
            userId: subject.subjectUserId,
            title,
          });
          const row =
            existing ??
            (await createDoeDtcArtifact({
              userId: subject.subjectUserId,
              title,
              kind:
                args.kind === "counter" ||
                args.kind === "checklist" ||
                args.kind === "score" ||
                args.kind === "log"
                  ? args.kind
                  : undefined,
              layout: typeof args.layout === "string" ? normalizeArtifactLayout(args.layout) : undefined,
              fields: args.fields,
              blocks: args.blocks,
              goal: typeof args.goal === "number" ? args.goal : undefined,
            }));
          profileUrl = doeDtcAppUrl(params.user.care_token, {
            tab: "trackers",
            artifact: row.id,
            member: subject.subjectUserId !== params.user.id ? subject.subjectUserId : undefined,
          });
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            kind: row.kind,
            created: !existing,
            subject: subject.subjectMemberName ?? "you",
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "update_profile_artifact") {
          const artifactId = String(args.artifact_id ?? "").trim();
          if (!artifactId) throw new Error("artifact_id is required.");
          if (args.archive === true) {
            await archiveDoeDtcArtifact({ userId: params.user.id, artifactId });
            output = { ok: true, id: artifactId, archived: true };
          } else {
            const row = await updateDoeDtcArtifact({
              userId: params.user.id,
              artifactId,
              title: typeof args.title === "string" ? args.title : undefined,
              kind:
                args.kind === "counter" ||
                args.kind === "checklist" ||
                args.kind === "score" ||
                args.kind === "log"
                  ? args.kind
                  : undefined,
              layout: typeof args.layout === "string" ? normalizeArtifactLayout(args.layout) : undefined,
              fields: args.fields,
              blocks: args.blocks,
              goal: typeof args.goal === "number" ? args.goal : args.goal === null ? null : undefined,
            });
            profileUrl = doeDtcAppUrl(params.user.care_token, {
              tab: "trackers",
              artifact: row.id,
            });
            output = {
              ok: true,
              id: row.id,
              title: row.title,
              kind: row.kind,
              link_sent_separately: true,
            };
          }
        } else if (toolCall.function.name === "log_artifact_entry") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const artifactId = String(args.artifact_id ?? "").trim();
          if (!artifactId) throw new Error("artifact_id is required.");
          const row = await logDoeDtcArtifactEntry({
            userId: subject.subjectUserId,
            artifactId,
            values: args.values,
            occurredAt: typeof args.occurred_at === "string" ? args.occurred_at : null,
          });
          profileUrl = doeDtcAppUrl(params.user.care_token, {
            tab: "trackers",
            artifact: artifactId,
            member: subject.subjectUserId !== params.user.id ? subject.subjectUserId : undefined,
          });
          output = {
            ok: true,
            id: row.id,
            artifact_id: artifactId,
            occurred_at: row.occurred_at,
            subject: subject.subjectMemberName ?? "you",
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "share_artifact") {
          const artifactId = typeof args.artifact_id === "string" ? args.artifact_id.trim() : undefined;
          const titleHint = typeof args.title === "string" ? args.title.trim() : undefined;
          const row = await shareDoeDtcArtifact({
            userId: params.user.id,
            artifactId,
            titleHint,
          });
          if (!row.share_token) throw new Error("Could not create share link.");
          artifactShareUrl = doeDtcArtifactShareUrl(row.share_token);
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            shared: true,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "unshare_artifact") {
          const artifactId = String(args.artifact_id ?? "").trim();
          if (!artifactId) throw new Error("artifact_id is required.");
          const row = await unshareDoeDtcArtifact({ userId: params.user.id, artifactId });
          output = { ok: true, id: row.id, title: row.title, shared: false };
        } else if (toolCall.function.name === "update_artifact_entry") {
          const entryId = String(args.entry_id ?? "").trim();
          if (!entryId) throw new Error("entry_id is required.");
          const row = await updateDoeDtcArtifactEntry({
            userId: params.user.id,
            entryId,
            values: args.values,
            occurredAt: typeof args.occurred_at === "string" ? args.occurred_at : null,
          });
          output = {
            ok: true,
            id: row.id,
            artifact_id: row.artifact_id,
            occurred_at: row.occurred_at,
          };
        } else if (toolCall.function.name === "remove_artifact_entry") {
          const entryId = String(args.entry_id ?? "").trim();
          if (!entryId) throw new Error("entry_id is required.");
          await removeDoeDtcArtifactEntry({ userId: params.user.id, entryId });
          output = { ok: true, id: entryId, removed: true };
        } else if (toolCall.function.name === "create_preparation") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: false,
          });
          if ("error" in subject) throw new Error(subject.error);
          const prepTitle =
            typeof args.title === "string"
              ? args.title
              : subject.subjectMemberName
                ? `${subject.subjectMemberName} — visit prep`
                : undefined;
          const row = await createDoeDtcPreparation({
            userId: subject.subjectUserId,
            title: prepTitle,
            reason: typeof args.reason === "string" ? args.reason : undefined,
          });
          if (subject.subjectUserId !== params.user.id && typeof args.reason === "string") {
            await createDoeDtcArtifact({
              userId: subject.subjectUserId,
              title: args.reason.slice(0, 80),
              kind: "log",
            });
          }
          prepareUrl = doeDtcPrepareUrl(params.user.care_token, { preparation: row.id });
          output = {
            ok: true,
            id: row.id,
            code: row.code,
            title: row.title,
            subject: subject.subjectMemberName ?? "you",
            on_subject_profile: subject.subjectUserId !== params.user.id,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "create_guide") {
          const topic = String(args.topic ?? "").trim();
          const title = String(args.title ?? "").trim();
          if (!topic || !title) throw new Error("topic and title are required.");
          const blocks = Array.isArray(args.blocks) ? normalizeGuideBlocks(args.blocks) : undefined;
          const row = await createDoeDtcGuide({
            userId: params.user.id,
            title,
            topic,
            layout: normalizeGuideLayout(args.layout),
            blocks,
          });
          guideUrl = doeDtcGuideUrl(params.user.care_token, { guide: row.id });
          await setAgentPending({
            userId: params.user.id,
            kind: "save_guide",
            commitTool: "save_guide",
            args: { guide_id: row.id },
            summary: `Save guide "${row.title}" to profile`,
          });
          preservePendingOffer = true;
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            layout: row.layout,
            blocks: row.blocks.length,
            link_sent_separately: true,
            next_step: "Ask if they want you to save this to their profile before calling save_guide.",
          };
        } else if (toolCall.function.name === "save_guide") {
          const row = await saveDoeDtcGuide({
            userId: params.user.id,
            guideId: typeof args.guide_id === "string" ? args.guide_id : undefined,
            titleHint: typeof args.title_hint === "string" ? args.title_hint : undefined,
          });
          profileUrl = doeDtcAppUrl(params.user.care_token, { tab: "guides" });
          await clearAgentPending(params.user.id);
          output = { ok: true, id: row.id, title: row.title, saved: true };
        } else if (toolCall.function.name === "update_guide") {
          const row = await updateDoeDtcGuide({
            userId: params.user.id,
            guideId: typeof args.guide_id === "string" ? args.guide_id : undefined,
            titleHint: typeof args.title_hint === "string" ? args.title_hint : undefined,
            title: typeof args.title === "string" ? args.title : undefined,
            topic: typeof args.topic === "string" ? args.topic : undefined,
            layout: args.layout ? normalizeGuideLayout(args.layout) : undefined,
            blocks: Array.isArray(args.blocks) ? normalizeGuideBlocks(args.blocks) : undefined,
            replaceBlocks: args.replace_blocks === true,
          });
          guideUrl = doeDtcGuideUrl(params.user.care_token, { guide: row.id });
          output = {
            ok: true,
            id: row.id,
            title: row.title,
            blocks: row.blocks.length,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "list_guides") {
          const rows = await listGuidesForUser(params.user.id);
          output = {
            ok: true,
            guides: rows.map((row) => ({
              id: row.id,
              title: row.title,
              topic: row.topic,
              saved: Boolean(row.saved_at),
              layout: row.layout,
            })),
          };
        } else if (toolCall.function.name === "send_guide_link") {
          const rows = await listGuidesForUser(params.user.id);
          const guideId = typeof args.guide_id === "string" ? args.guide_id.trim() : "";
          const titleHint = typeof args.title_hint === "string" ? args.title_hint.trim() : "";
          const match = guideId
            ? rows.find((row) => row.id === guideId)
            : titleHint
              ? rows.find(
                  (row) =>
                    row.title.toLowerCase().includes(titleHint.toLowerCase()) ||
                    row.topic.toLowerCase().includes(titleHint.toLowerCase()),
                )
              : rows[0];
          if (!match) throw new Error("Guide not found.");
          guideUrl = doeDtcGuideUrl(params.user.care_token, { guide: match.id });
          output = { ok: true, id: match.id, title: match.title, link_sent_separately: true };
        } else if (toolCall.function.name === "submit_ticket") {
          const kind = args.kind === "bug" ? "bug" : "feedback";
          const title = String(args.title ?? "").trim();
          const body = String(args.body ?? "").trim();
          if (!title || !body) throw new Error("Title and description are required.");
          const row = await createDoeDtcTicket({
            userId: params.user.id,
            kind,
            title,
            body,
          });
          feedbackUrl = doeDtcFeedbackUrl(params.user.care_token, { ticket: row.id });
          output = {
            ok: true,
            id: row.id,
            kind: row.kind,
            title: row.title,
            status: row.status,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "remember_fact") {
          const fact = String(args.fact ?? "").trim();
          if (!fact) throw new Error("Fact is required.");
          const row = await insertDoeDtcMemory({
            userId: params.user.id,
            fact,
            category: typeof args.category === "string" ? args.category : "general",
          });
          await addDoeDtcMem0Fact({ userId: params.user.id, fact: row.fact });
          output = { ok: true, id: row.id, fact: row.fact };
        } else if (toolCall.function.name === "start_browser_task") {
          const started = await startDoeDtcBrowserTask({
            user: params.user,
            intent: String(args.intent ?? ""),
            url: String(args.url ?? ""),
            mode:
              args.mode === "login" || args.mode === "write" || args.mode === "research"
                ? args.mode
                : "research",
          });
          if (!started.ok) {
            browserUserMessage = started.user_message;
            output = {
              ok: false,
              error: started.error,
              user_message: started.user_message,
            };
          } else {
            activeBrowserJobId = started.jobId;
            if (started.workUrl) {
              workUrl = started.workUrl;
            }
            if (started.screenshotUrl) {
              screenshotUrl = started.screenshotUrl;
            }
            if (started.excerpt) {
              browserExcerpt = started.excerpt;
            }
            output = {
              ok: true,
              job_id: started.jobId,
              host: started.host,
              url: started.url,
              title: started.title,
              excerpt: started.excerpt,
              screenshot_sent_separately: Boolean(started.screenshotUrl),
              link_sent_separately: Boolean(started.workUrl),
            };
          }
        } else if (toolCall.function.name === "browser_navigate") {
          const jobId = activeBrowserJobId ?? "";
          const result = await navigateDoeDtcBrowser({
            user: params.user,
            jobId,
            url: String(args.url ?? ""),
          });
          output = result;
        } else if (toolCall.function.name === "browser_act") {
          const jobId = activeBrowserJobId ?? "";
          const result = await actDoeDtcBrowser({
            user: params.user,
            jobId,
            action:
              args.action === "click" || args.action === "type" || args.action === "scroll"
                ? args.action
                : "scroll",
            selector: typeof args.selector === "string" ? args.selector : undefined,
            text: typeof args.text === "string" ? args.text : undefined,
          });
          if (
            result.ok &&
            /\b(ss|screenshot|snap(?:shot)?|picture|photo)\b/i.test(params.inboundText)
          ) {
            const shot = await snapshotDoeDtcBrowser({
              user: params.user,
              jobId,
              caption: typeof args.text === "string" ? args.text : params.inboundText,
            });
            if (shot.workUrl) workUrl = shot.workUrl;
            if (shot.screenshotUrl) screenshotUrl = shot.screenshotUrl;
            if (shot.excerpt) browserExcerpt = shot.excerpt;
            output = {
              ...result,
              screenshot_sent_separately: Boolean(shot.screenshotUrl),
            };
          } else if (!result.ok) {
            browserUserMessage = toUserSafeBrowserError(result.error ?? "Browser action failed.");
            output = { ...result, user_message: browserUserMessage };
          } else {
            output = result;
          }
        } else if (toolCall.function.name === "browser_snapshot") {
          const jobId = activeBrowserJobId ?? "";
          const result = await snapshotDoeDtcBrowser({
            user: params.user,
            jobId,
            caption: typeof args.caption === "string" ? args.caption : undefined,
          });
          if (result.workUrl) {
            workUrl = result.workUrl;
          }
          if (result.screenshotUrl) {
            screenshotUrl = result.screenshotUrl;
          }
          if (result.excerpt) {
            browserExcerpt = result.excerpt;
          }
          output = {
            ok: result.ok,
            url: result.url,
            title: result.title,
            excerpt: result.excerpt,
            screenshot_sent_separately: Boolean(result.screenshotUrl),
            link_sent_separately: Boolean(result.workUrl),
          };
        } else if (toolCall.function.name === "request_vault") {
          const jobId = activeBrowserJobId ?? "";
          const vault = await requestDoeDtcVaultLink({
            user: params.user,
            jobId,
            host: String(args.host ?? ""),
          });
          if (!vault.ok) {
            output = vault;
          } else {
            vaultUrl = vault.vaultUrl;
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "request_live_login") {
          const jobId = activeBrowserJobId ?? "";
          const live = await requestDoeDtcLiveLogin({ user: params.user, jobId });
          if (!live.ok) {
            output = live;
          } else {
            liveViewUrl = live.liveViewUrl;
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "show_session") {
          if (!activeBrowserJobId) {
            output = { ok: false, error: "No active browser task to watch." };
          } else {
            sessionUrl = doeDtcSessionUrl(params.user.care_token);
            output = { ok: true, link_sent_separately: true };
          }
        } else if (toolCall.function.name === "react_to_message") {
          if (!params.inboundMessageId) {
            output = { ok: false, error: "No inbound message to react to." };
          } else {
            const emoji = String(args.emoji ?? "").trim();
            if (!emoji) {
              output = { ok: false, error: "Emoji is required." };
            } else {
              reactionEmoji = emoji.slice(0, 8);
              output = { ok: true, queued: true };
            }
          }
        } else if (toolCall.function.name === "use_thread_reply") {
          if (!params.inboundMessageId) {
            output = { ok: false, error: "No inbound message to reply to." };
          } else {
            replyToInbound = true;
            output = { ok: true, queued: true };
          }
        } else if (toolCall.function.name === "request_commit") {
          const jobId = activeBrowserJobId ?? "";
          const result = await requestDoeDtcBrowserCommit({
            user: params.user,
            jobId,
            pendingAction: {
              selector: String(args.selector ?? ""),
              label: String(args.label ?? ""),
              url: typeof args.url === "string" ? args.url : undefined,
            },
          });
          if (result.workUrl) {
            workUrl = result.workUrl;
          }
          if (result.screenshotUrl) {
            screenshotUrl = result.screenshotUrl;
          }
          if (result.excerpt) {
            browserExcerpt = result.excerpt;
          }
          browserNeedsConfirm = true;
          output = {
            ok: result.ok,
            url: result.url,
            title: result.title,
            excerpt: result.excerpt,
            awaiting_confirm: true,
            link_sent_separately: Boolean(result.workUrl),
          };
        } else if (toolCall.function.name === "start_listen") {
          const appointmentId =
            typeof args.appointment_id === "string" && args.appointment_id.trim()
              ? args.appointment_id.trim()
              : null;
          const session = await createDoeDtcListenSession({
            userId: params.user.id,
            appointmentId,
          });
          listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
          output = { ok: true, session_id: session.id, link_sent_separately: true };
        } else if (toolCall.function.name === "send_profile_link") {
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
          });
          if ("error" in subject) throw new Error(subject.error);
          profileUrl = doeDtcAppUrl(params.user.care_token, {
            tab: typeof args.tab === "string" ? args.tab : undefined,
            artifact: typeof args.artifact === "string" ? args.artifact.trim() : undefined,
            member: subject.subjectUserId !== params.user.id ? subject.subjectUserId : undefined,
          });
          output = { ok: true, subject: subject.subjectMemberName ?? "you", link_sent_separately: true };
        } else if (toolCall.function.name === "propose_scheduled_text") {
          const intent = String(args.intent ?? "").trim();
          const body = String(args.body ?? "").trim();
          const sendAtRaw = String(args.send_at ?? "").trim();
          if (!intent || !body || !sendAtRaw) throw new Error("intent, body, and send_at are required.");
          const timezone = normalizeScheduledTimezone(
            typeof args.timezone === "string" ? args.timezone : undefined,
          );
          const built = await buildScheduledTextPendingArgs({
            user: params.user,
            intent,
            body,
            sendAtRaw,
            timezone,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
          await setAgentPending({
            userId: params.user.id,
            kind: "schedule_text",
            commitTool: "schedule_text",
            args: built.args,
            summary: built.summary,
          });
          preservePendingOffer = true;
          output = {
            ok: true,
            draft: true,
            intent,
            body,
            send_at: built.sendAtIso,
            send_at_label: formatScheduledSendAtLabel(new Date(built.sendAtIso), timezone),
            recipient: built.recipientName,
            next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
          };
        } else if (toolCall.function.name === "schedule_text") {
          const timezone = normalizeScheduledTimezone(
            typeof args.timezone === "string" ? args.timezone : undefined,
          );
          const intent = String(args.intent ?? "").trim();
          const body = String(args.body ?? "").trim();
          const sendAtRaw = String(args.send_at ?? "").trim();
          let rolledForward = false;
          let row;
          const now = new Date();
          let sendAt = parseScheduledSendAt(sendAtRaw, now, timezone);
          try {
            sendAt = ensureFutureSendAt(sendAt, now, timezone);
          } catch {
            sendAt = ensureFutureSendAt(parseScheduledSendAt(sendAtRaw, now, timezone), now, timezone);
            rolledForward = true;
            await addDoeDtcMem0PlaybookNote({
              userId: params.user.id,
              note: "When scheduling reminders, roll past clock times forward one local day instead of treating them as already passed.",
            });
          }

          if (shouldSendScheduledTextInline(sendAt, now)) {
            row = await sendScheduledTextInline({
              creator: params.user,
              intent,
              body,
              sendAt,
              timezone,
              memberId: typeof args.member_id === "string" ? args.member_id : null,
              memberName: typeof args.member_name === "string" ? args.member_name : null,
            });
          } else {
            try {
              row = await createScheduledText({
                creator: params.user,
                intent,
                body,
                sendAtRaw,
                timezone,
                memberId: typeof args.member_id === "string" ? args.member_id : null,
                memberName: typeof args.member_name === "string" ? args.member_name : null,
              });
            } catch {
              row = await createScheduledText({
                creator: params.user,
                intent,
                body,
                sendAtIso: sendAt.toISOString(),
                timezone,
                memberId: typeof args.member_id === "string" ? args.member_id : null,
                memberName: typeof args.member_name === "string" ? args.member_name : null,
              });
              rolledForward = true;
            }
          }
          await clearAgentPending(params.user.id);
          output = {
            ok: true,
            scheduled_text_id: row.id,
            send_at: row.send_at,
            recipient_phone: row.recipient_phone,
            status: row.status,
            sent_inline: row.status === "sent" && shouldSendScheduledTextInline(new Date(row.send_at), now),
            rolled_forward: rolledForward || undefined,
          };
        } else if (toolCall.function.name === "cancel_scheduled_text") {
          const cancelled = await cancelScheduledText({
            userId: params.user.id,
            scheduledTextId:
              typeof args.scheduled_text_id === "string" ? args.scheduled_text_id : undefined,
            intentHint: typeof args.intent_hint === "string" ? args.intent_hint : undefined,
          });
          if (!cancelled) throw new Error("Scheduled text not found.");
          output = { ok: true, scheduled_text_id: cancelled.id, status: cancelled.status };
        } else if (toolCall.function.name === "list_scheduled_texts") {
          const rows = await listScheduledTextsForUser(params.user.id);
          output = {
            ok: true,
            scheduled_texts: rows.filter((row) => row.status === "pending"),
          };
        } else if (toolCall.function.name === "revoke_household_access") {
          const member = snapshot.household.viewerMember;
          if (!member) throw new Error("You are not in a household.");
          const isAdult =
            member.relationship !== "child" || isHouseholdMemberAdult(member.date_of_birth);
          if (isAdult && args.confirmed !== true) {
            throw new Error("Explicit confirmation is required before revoking household access.");
          }
          const result = await revokeDoeDtcHouseholdAccess({ userId: params.user.id });
          await sendDoeDtcHouseholdAccessRevokedNotice({
            memberName: result.memberName,
            household: snapshot.household.household!,
          });
          output = { ok: true, revoked: true, member_name: result.memberName };
        } else if (toolCall.function.name === "propose_accountability") {
          const goal = String(args.goal ?? "").trim();
          if (!goal) throw new Error("goal is required.");
          const subjectName = String(args.subject_name ?? "").trim() || params.user.full_name || "You";
          const mechanics = normalizeAccountabilityMechanics(
            args.mechanics && typeof args.mechanics === "object"
              ? (args.mechanics as Record<string, unknown>)
              : undefined,
          );
          const title = String(args.title ?? goal).trim();
          await setAgentPending({
            userId: params.user.id,
            kind: "start_accountability",
            commitTool: "start_accountability",
            args: {
              title,
              goal,
              subject_name: subjectName,
              involve_partner: Boolean(args.involve_partner),
              partner_name: typeof args.partner_name === "string" ? args.partner_name : undefined,
              partner_phone: typeof args.partner_phone === "string" ? args.partner_phone : undefined,
              member_id: typeof args.member_id === "string" ? args.member_id : undefined,
              member_name: typeof args.member_name === "string" ? args.member_name : undefined,
              mechanics,
            },
            summary: `Start accountability for ${subjectName}: ${goal}`,
          });
          preservePendingOffer = true;
          output = {
            ok: true,
            draft: true,
            title,
            goal,
            subject_name: subjectName,
            involve_partner: Boolean(args.involve_partner ?? args.involve_partner),
            partner_name: typeof args.partner_name === "string" ? args.partner_name : null,
            partner_phone: typeof args.partner_phone === "string" ? args.partner_phone : null,
            mechanics,
            next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
          };
        } else if (toolCall.function.name === "start_accountability") {
          const goal = String(args.goal ?? "").trim();
          if (!goal) throw new Error("goal is required.");
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const subjectName =
            String(args.subject_name ?? "").trim() || subject.subjectMemberName || params.user.full_name || "You";
          const mechanics = normalizeAccountabilityMechanics(
            args.mechanics && typeof args.mechanics === "object"
              ? (args.mechanics as Record<string, unknown>)
              : undefined,
          );
          const view = await startAccountabilityPact({
            owner: params.user,
            title: String(args.title ?? goal).trim(),
            goal,
            mechanics,
            subjectUserId: subject.subjectUserId,
            subjectMemberId: subject.subjectMemberId ?? null,
            subjectName,
            partnerName: typeof args.partner_name === "string" ? args.partner_name : null,
            partnerPhone: typeof args.partner_phone === "string" ? args.partner_phone : null,
            involvePartner: Boolean(args.involve_partner ?? args.involve_partner),
          });
          profileUrl = doeDtcAppUrl(params.user.care_token, { tab: "accountability" });
          await clearAgentPending(params.user.id);
          output = {
            ok: true,
            pact_id: view.pact.id,
            title: view.pact.title,
            status: view.pact.status,
            subject: subjectName,
            link_sent_separately: true,
          };
        } else if (toolCall.function.name === "propose_habit_workflow") {
          const goal = String(args.goal ?? "").trim();
          if (!goal) throw new Error("goal is required.");
          const subjectName = String(args.subject_name ?? "").trim() || params.user.full_name || "You";
          const timezone = normalizeScheduledTimezone(
            typeof args.timezone === "string" ? args.timezone : undefined,
          );
          const config = await buildHabitWorkflowConfig({
            owner: params.user,
            goal,
            subjectName,
            subjectMemberId: typeof args.member_id === "string" ? args.member_id : null,
            checkInHour: typeof args.check_in_hour === "number" ? args.check_in_hour : undefined,
            checkInBody: typeof args.check_in_body === "string" ? args.check_in_body : undefined,
            awaitTimeoutMinutes:
              typeof args.await_timeout_minutes === "number" ? args.await_timeout_minutes : undefined,
            timezone,
          });
          await setAgentPending({
            userId: params.user.id,
            kind: "start_habit_workflow",
            commitTool: "start_habit_workflow",
            args: {
              goal,
              subject_name: subjectName,
              check_in_hour: config.check_in_hour,
              check_in_body: config.check_in_body,
              await_timeout_minutes: config.await_timeout_minutes,
              timezone: config.timezone,
              member_id: typeof args.member_id === "string" ? args.member_id : undefined,
              member_name: typeof args.member_name === "string" ? args.member_name : undefined,
            },
            summary: `Daily habit for ${subjectName}: ${goal}`,
          });
          preservePendingOffer = true;
          output = {
            ok: true,
            draft: true,
            goal,
            subject_name: subjectName,
            check_in_hour: config.check_in_hour,
            await_timeout_minutes: config.await_timeout_minutes,
            next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
          };
        } else if (toolCall.function.name === "start_habit_workflow") {
          const goal = String(args.goal ?? "").trim();
          if (!goal) throw new Error("goal is required.");
          const subject = await resolveAgentHouseholdSubject({
            viewerUserId: params.user.id,
            args,
            requireEdit: true,
          });
          if ("error" in subject) throw new Error(subject.error);
          const subjectName =
            String(args.subject_name ?? "").trim() || subject.subjectMemberName || params.user.full_name || "You";
          const timezone = normalizeScheduledTimezone(
            typeof args.timezone === "string" ? args.timezone : undefined,
          );
          const config = await buildHabitWorkflowConfig({
            owner: params.user,
            goal,
            subjectName,
            subjectMemberId: subject.subjectMemberId ?? null,
            checkInHour: typeof args.check_in_hour === "number" ? args.check_in_hour : undefined,
            checkInBody: typeof args.check_in_body === "string" ? args.check_in_body : undefined,
            awaitTimeoutMinutes:
              typeof args.await_timeout_minutes === "number" ? args.await_timeout_minutes : undefined,
            timezone,
          });
          const workflow = await createHabitWorkflow({
            owner: params.user,
            goal,
            config,
            subjectMemberId: subject.subjectMemberId ?? null,
          });
          await clearAgentPending(params.user.id);
          output = {
            ok: true,
            workflow_id: workflow.id,
            goal: workflow.goal,
            subject: config.subject_name,
            check_in_hour: config.check_in_hour,
            next_run_at: workflow.next_run_at,
          };
        } else if (toolCall.function.name === "cancel_habit_workflow") {
          const cancelled = await cancelWorkflow({
            userId: params.user.id,
            workflowId: typeof args.workflow_id === "string" ? args.workflow_id : undefined,
            goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
          });
          if (!cancelled) throw new Error("Habit workflow not found.");
          output = { ok: true, workflow_id: cancelled.id, status: cancelled.status };
        } else if (toolCall.function.name === "invite_accountability_partner") {
          const pactId = String(args.pact_id ?? "").trim();
          const partnerPhone = String(args.partner_phone ?? "").trim();
          if (!partnerPhone) throw new Error("partner_phone is required.");
          let resolvedPactId = pactId;
          if (!resolvedPactId) {
            const pact = await findAccountabilityPactForUser({ userId: params.user.id });
            if (!pact) throw new Error("Accountability pact not found.");
            resolvedPactId = pact.id;
          }
          await inviteAccountabilityPartner({
            owner: params.user,
            pactId: resolvedPactId,
            partnerName: typeof args.partner_name === "string" ? args.partner_name : undefined,
            partnerPhone,
          });
          output = { ok: true, pact_id: resolvedPactId, invite_sent: true };
        } else if (toolCall.function.name === "log_accountability_checkin") {
          const outcomeRaw = String(args.outcome ?? "").trim();
          if (outcomeRaw !== "yes" && outcomeRaw !== "no" && outcomeRaw !== "skip") {
            throw new Error("outcome must be yes, no, or skip.");
          }
          const pactId = String(args.pact_id ?? "").trim();
          const pact =
            (pactId
              ? await findAccountabilityPactForUser({ userId: params.user.id, pactId })
              : null) ??
            (await findAccountabilityPactForUser({
              userId: params.user.id,
              goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
            }));
          if (!pact) throw new Error("Accountability pact not found.");
          const event = await logAccountabilityCheckIn({
            pactId: pact.id,
            actorUserId: params.user.id,
            outcome: outcomeRaw,
            note: typeof args.note === "string" ? args.note : null,
          });
          output = { ok: true, pact_id: pact.id, outcome: event.outcome, event_id: event.id };
        } else if (toolCall.function.name === "withdraw_accountability") {
          const pactId = String(args.pact_id ?? "").trim();
          const pact =
            (pactId
              ? await findAccountabilityPactForUser({ userId: params.user.id, pactId })
              : null) ??
            (await findAccountabilityPactForUser({
              userId: params.user.id,
              goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
            }));
          if (!pact) throw new Error("Accountability pact not found.");
          const view = await withdrawAccountabilityPact({
            ownerUserId: params.user.id,
            pactId: pact.id,
            reason: typeof args.reason === "string" ? args.reason : null,
          });
          output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
        } else if (toolCall.function.name === "pause_accountability") {
          const pactId = String(args.pact_id ?? "").trim();
          const pact =
            (pactId
              ? await findAccountabilityPactForUser({ userId: params.user.id, pactId })
              : null) ??
            (await findAccountabilityPactForUser({
              userId: params.user.id,
              goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
            }));
          if (!pact) throw new Error("Accountability pact not found.");
          const view = await pauseAccountabilityPact({ ownerUserId: params.user.id, pactId: pact.id });
          output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
        } else if (toolCall.function.name === "resume_accountability") {
          const pactId = String(args.pact_id ?? "").trim();
          const pact =
            (pactId
              ? await findAccountabilityPactForUser({ userId: params.user.id, pactId })
              : null) ??
            (await findAccountabilityPactForUser({
              userId: params.user.id,
              goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
            }));
          if (!pact) throw new Error("Accountability pact not found.");
          const view = await resumeAccountabilityPact({ ownerUserId: params.user.id, pactId: pact.id });
          output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
        } else if (toolCall.function.name === "read_profile") {
          const tab = String(args.tab ?? "") as DoeDtcProfileTab;
          if (!DOEDTC_PROFILE_READ_TABS.includes(tab)) {
            output = { ok: false, error: "Unknown profile tab." };
          } else {
            const subject = await resolveAgentHouseholdSubject({
              viewerUserId: params.user.id,
              args,
            });
            if ("error" in subject) {
              output = { ok: false, error: subject.error };
            } else {
              const read = await readDoeDtcProfileTab({
                userId: subject.subjectUserId,
                tab,
                viewerUserId: params.user.id,
              });
              output = {
                ok: true,
                tab: read.tab,
                content: read.content,
                subject: subject.subjectMemberName ?? "you",
              };
            }
          }
        } else {
          output = { ok: false, error: "Unknown tool" };
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Tool execution failed.";
        output = {
          ok: false,
          error: message,
        };
      }

      if (output.ok === false && typeof output.error === "string") {
        toolErrorsThisRound.push(`${toolCall.function.name}: ${output.error}`);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(output),
      });
    }

    if (toolErrorsThisRound.length > 0 && !reflectionNoteInjected) {
      reflectionNoteInjected = true;
      messages.push({
        role: "system",
        content: `Tool error(s): ${toolErrorsThisRound.join("; ")}. Fix the tool args and commit — do not re-ask the same confirmation. Do not tell the user the time already passed unless they asked for a time that cannot work.`,
      });
    }
  }

  const fulfilled = await fulfillClaimedLinks({
    user: params.user,
    replyText: lastModelContent ?? "",
    inboundText: params.inboundText,
    listenUrl,
    profileUrl,
    sessionUrl,
    activeBrowserJobId,
  });
  listenUrl = fulfilled.listenUrl;
  profileUrl = fulfilled.profileUrl;
  sessionUrl = fulfilled.sessionUrl;

  return {
    replyText: buildReplyFromTurnState({
      modelContent: fulfilled.replyText,
      assessmentSummary,
      browserNeedsConfirm,
      browserExcerpt,
      browserUserMessage,
      workUrl,
      screenshotUrl,
      vaultUrl,
      liveViewUrl,
      sessionUrl,
      listenUrl,
      profileUrl,
      feedbackUrl,
      prepareUrl,
      guideUrl,
      artifactShareUrl,
      preservePendingOffer,
    }),
    careUrl: assessmentRan ? careUrl : undefined,
    listenUrl,
    profileUrl,
    feedbackUrl,
    prepareUrl,
    guideUrl,
    artifactShareUrl,
    workUrl,
    screenshotUrl,
    vaultUrl,
    liveViewUrl,
    sessionUrl,
    reactionEmoji,
    replyToInbound,
    browserNeedsConfirm,
    assessmentRan,
    preservePendingOffer,
  };
}
