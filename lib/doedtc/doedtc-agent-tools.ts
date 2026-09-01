import { DOEDTC_PROFILE_READ_TABS } from "@/lib/doedtc/doedtc-profile-read";

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
      name: "update_symptom",
      description: "Update a logged symptom entry when the user corrects it.",
      parameters: {
        type: "object",
        properties: {
          symptom_id: { type: "string", description: "Symptom row id from the symptom log." },
          raw_text: { type: "string" },
          summary: { type: "string" },
          severity: { type: "string", enum: ["mild", "moderate", "severe", "unknown"] },
          onset: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_symptom",
      description: "Remove a logged symptom when the user asks to delete it.",
      parameters: {
        type: "object",
        properties: {
          symptom_id: { type: "string", description: "Symptom row id from the symptom log." },
        },
        required: ["symptom_id"],
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
      name: "update_appointment",
      description: "Reschedule or edit an existing appointment.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: { type: "string", description: "Appointment id from the appointments log." },
          title: { type: "string" },
          timing_precision: { type: "string", enum: ["exact", "day", "approximate"] },
          starts_at: { type: "string" },
          timing_note: { type: "string" },
          location: { type: "string" },
          notes: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["appointment_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "cancel_appointment",
      description: "Cancel/remove an appointment the user no longer has.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: { type: "string", description: "Appointment id from the appointments log." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["appointment_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "log_family_member",
      description:
        "Add a household member. If they already exist, use update_family_member instead — never create a duplicate.",
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
      name: "update_family_member",
      description:
        "Update an existing household member — name, phone, date of birth, gender, or relationship. Use when the user corrects family info.",
      parameters: {
        type: "object",
        properties: {
          member_id: { type: "string", description: "Household member id." },
          member_name: { type: "string", description: "Family member name if id is unknown." },
          full_name: { type: "string" },
          relationship: {
            type: "string",
            enum: ["grandmother", "grandfather", "mother", "father", "child", "sibling", "partner", "other"],
          },
          phone: { type: "string", description: "Phone number including area code or country code." },
          date_of_birth: { type: "string" },
          gender: { type: "string", enum: ["female", "male", "non_binary", "prefer_not_to_say"] },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_family_member",
      description: "Remove a household member from the family chart. Admin only.",
      parameters: {
        type: "object",
        properties: {
          member_id: { type: "string" },
          member_name: { type: "string" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_family_invite",
      description:
        "Text a join link to a household member with a phone who has not joined Doe yet. A direct ask to send invites counts as yes.",
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
      description:
        "Remove a medical condition from the profile when they stopped having it. Not for correcting a name — use update_condition. Name from read_profile conditions tab.",
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
      name: "log_result",
      description:
        "Log a lab, imaging, or test result they report (e.g. A1C 6.1). Not for symptoms — use log_symptoms. Read read_profile results tab first if checking what's logged.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Result name, e.g. A1C, Chest X-ray." },
          resulted_at: {
            type: "string",
            description: "ISO date or datetime when result came back.",
          },
          source: { type: "string", description: "Lab or facility if known." },
          summary: { type: "string", description: "Values or notes, e.g. 6.1%." },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["title", "resulted_at"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "remove_result",
      description:
        "Delete a logged lab/imaging result. result_id from read_profile results tab — do not ask the user for an id you can read.",
      parameters: {
        type: "object",
        properties: {
          result_id: { type: "string", description: "Result row id from read_profile results tab." },
        },
        required: ["result_id"],
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
        "Rename a tracker, change fields/layout, or archive:true to delete. artifact_id from read_profile trackers tab. Not for logging an entry — use log_artifact_entry.",
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
      description:
        "Append one entry to an existing tracker. values keys must match field keys from read_profile trackers tab. artifact_id from same tab. Not create_profile_artifact.",
      parameters: {
        type: "object",
        properties: {
          artifact_id: { type: "string", description: "Tracker id from read_profile trackers tab." },
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
      description:
        "Revoke a tracker's public share link. artifact_id from read_profile trackers tab. Not unshare for guides.",
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
      description:
        "Fix an existing tracker entry's values or timestamp. entry_id from read_profile trackers tab. Not log_artifact_entry.",
      parameters: {
        type: "object",
        properties: {
          entry_id: { type: "string", description: "Entry id from read_profile trackers tab." },
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
      description:
        "Delete one tracker entry. entry_id from read_profile trackers tab.",
      parameters: {
        type: "object",
        properties: {
          entry_id: { type: "string", description: "Entry id from read_profile trackers tab." },
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
      description:
        "Save a guide to profile Guides tab after they confirm yes. guide_id from create_guide output or list_guides. Not needed on create — link sends immediately.",
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
        "Edit guide blocks/title, or archive:true to delete, or unsave:true to remove from profile (keeps link). guide_id or title_hint from list_guides. Not create_guide.",
      parameters: {
        type: "object",
        properties: {
          guide_id: { type: "string", description: "Guide id from list_guides." },
          title_hint: { type: "string", description: "Title substring if id unknown." },
          title: { type: "string" },
          topic: { type: "string" },
          layout: {
            type: "string",
            enum: ["howto", "schedule", "checklist", "explainer", "comparison"],
          },
          blocks: { type: "array", items: { type: "object" } },
          replace_blocks: { type: "boolean", description: "If true, replace all blocks. If false, append/patch." },
          archive: { type: "boolean", description: "Set true to permanently archive/delete the guide." },
          unsave: { type: "boolean", description: "Set true to remove from profile Guides tab without deleting." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_guides",
      description:
        "List recent guides with ids (saved and unsaved). Call before update_guide, send_guide_link, or archive/unsave.",
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
      name: "forget_fact",
      description: "Remove a stored preference when the user asks you to forget something.",
      parameters: {
        type: "object",
        properties: {
          memory_id: { type: "string", description: "Memory row id if known." },
          fact: { type: "string", description: "Text to match against stored memories." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_listen",
      description:
        "Create a Listen session before saying a recording link is coming. Optional appointment_id from Appointments log. Not read_listen_session.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: {
            type: "string",
            description: "Appointment id from Appointments log to link this recording.",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "read_listen_session",
      description:
        "Read completed visit transcript and summary. Use when they ask what the doctor said. session_id optional — defaults to most recent completed. Not start_listen.",
      parameters: {
        type: "object",
        properties: {
          session_id: {
            type: "string",
            description: "Listen session id if known; omit for most recent completed.",
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
      description:
        "Navigate the active browser job to a URL or site nickname (google, mayo). Requires start_browser_task first — no active job means call start_browser_task instead.",
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
      name: "browser_computer",
      description:
        "Kernel computer SDK: click at x/y, type, press keys, scroll, or screenshot when CSS selectors fail or a page is an interstitial. Prefer browser_act with a selector when one exists.",
      parameters: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["click_mouse", "type_text", "press_key", "scroll", "screenshot"],
          },
          x: { type: "number" },
          y: { type: "number" },
          text: { type: "string" },
          keys: { type: "array", items: { type: "string" } },
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
      description:
        "Send secure vault sign-in link for a patient portal (host required). Never ask for passwords in chat. Not request_live_login — vault is async secure handoff.",
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
      description:
        "Send Live View link so they sign in while watching the browser. Not request_vault — use when they will type credentials themselves.",
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
      description:
        "List pending one-shot scheduled texts with scheduled_text_id before cancel_scheduled_text.",
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
      name: "propose_workflow",
      description:
        "Draft a composed workflow graph when who/when is ambiguous or it texts someone else without a clear ask. Graph uses closed nodes: recur_daily, send_message, wait_for_reply, wait_until, done.",
      parameters: {
        type: "object",
        properties: {
          goal: { type: "string", description: "Plain-language workflow goal." },
          graph: { type: "object", description: "Workflow graph (version 1, entry, nodes)." },
          subject_name: { type: "string" },
          timezone: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "graph"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "start_workflow",
      description:
        "Commit a composed workflow graph (send/wait/branch/escalate/recur). Use when they already asked with enough detail. Max 12 nodes.",
      parameters: {
        type: "object",
        properties: {
          goal: { type: "string" },
          graph: { type: "object", description: "Workflow graph (version 1, entry, nodes)." },
          subject_name: { type: "string" },
          timezone: { type: "string" },
          member_id: HOUSEHOLD_MEMBER_PARAMS.member_id,
          member_name: HOUSEHOLD_MEMBER_PARAMS.member_name,
        },
        required: ["goal", "graph"],
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
      description:
        "End an accountability pact after explicit owner confirmation. Stops check-ins. Not pause_accountability.",
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
      description:
        "Pause recurring pact check-ins without deleting history. Owner only. pact_id from Accountability pacts log.",
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
      description:
        "Resume a paused accountability pact. Owner only. pact_id from Accountability pacts log.",
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
        "Skip almost always. Do not react on short or routine turns. Lifecycle 👍/✅ are added automatically only when a task is taking longer.",
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
