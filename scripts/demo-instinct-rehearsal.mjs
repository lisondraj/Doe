#!/usr/bin/env node
/**
 * Rehearse the Instinct demo without Instinct: plays the MCP calls Instinct makes at Dr. Brooks' Migraine Clinic,
 * as James Lisondra, with pauses where the user would be talking to their agent. Open /demo/clinic first and watch
 * the notifications and the live view.
 *
 *   node scripts/demo-instinct-rehearsal.mjs                      # http://localhost:3000, real pauses
 *   node scripts/demo-instinct-rehearsal.mjs https://doehealth.care --fast
 *   node scripts/demo-instinct-rehearsal.mjs --until=forms         # stop before the booking request
 *
 * Every detail about James below is made up for the demo.
 */
const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "http://localhost:3000").replace(/\/$/, "");
const fast = args.includes("--fast");
const until = args.find((a) => a.startsWith("--until="))?.split("=")[1];
const MCP = `${base}/api/demo/mcp`;

export const JAMES = {
  name: "James Lisondra",
  location: "Toronto, Ontario",
  phone: "(416) 555-0137",
  intake: {
    name: "James Lisondra",
    dob: "1996-03-14",
    phone: "(416) 555-0137",
    email: "james.lisondra@example.com",
    tried: "Topiramate 50 mg (stopped, brain fog); amitriptyline 10 mg (stopped, drowsy)",
    acute: "Rizatriptan 10 mg as needed; ibuprofen 400 mg",
    allergies: "Penicillin (rash)",
    pregnant: "No",
    neuro: "No",
  },
};

export const DIARY = `Migraine diary · James Lisondra · Oct 1 to 30, 2026

Summary: 14 headache days (up from 9 in September), 11 met migraine criteria. Average pain 7/10. Rizatriptan taken on 9 days. Missed 3 work days.

Oct 2  · 7/10 · 9 h · left temple, throbbing · nausea, light · rizatriptan 10 mg, partial relief · trigger: poor sleep
Oct 5  · 6/10 · 6 h · behind both eyes · light · ibuprofen 400 mg · trigger: skipped lunch
Oct 8  · 8/10 · 14 h · left side · nausea, vomited once · rizatriptan, then lay down · missed work
Oct 11 · 5/10 · 4 h · forehead · none · no medication
Oct 13 · 7/10 · 10 h · left temple · light, sound · rizatriptan · trigger: red wine
Oct 16 · 8/10 · 18 h · left side · nausea · rizatriptan x2 · missed work
Oct 18 · 6/10 · 7 h · neck and back of head · light · ibuprofen
Oct 20 · 7/10 · 9 h · left temple · nausea · rizatriptan · trigger: screens late
Oct 22 · 9/10 · 22 h · left side · nausea, light, sound · rizatriptan, ER not needed · missed work
Oct 24 · 6/10 · 5 h · forehead · light · ibuprofen
Oct 26 · 7/10 · 8 h · left temple · nausea · rizatriptan
Oct 27 · 5/10 · 4 h · behind eyes · none · no medication
Oct 29 · 8/10 · 12 h · left side · nausea, light · rizatriptan · trigger: weather change
Oct 30 · 7/10 · 10 h · left temple · light · rizatriptan`;

const STEPS = [
  { pause: 0, say: "Instinct reads the clinic: services, Dr. Brooks, insurance", tool: "doe_clinic_info", args: {} },
  {
    pause: 6,
    say: "James agreed to the terms and to sharing PHI through Doe. Instinct connects.",
    tool: "doe_connect",
    args: {
      agent_name: "Instinct",
      user_name: JAMES.name,
      user_location: JAMES.location,
      user_phone: JAMES.phone,
      request: "Botox for chronic migraine within 50 km of Toronto. Uses Harbour Mutual (partial is fine). Budget under $3,000.",
      consent_terms: true,
      consent_phi: true,
      stay_connected: true,
      join_network: false,
    },
  },
  { pause: 1, say: "Instinct texts James the identity link", verify: true },
  { pause: 4, say: "Asks about Harbour Mutual", tool: "doe_send_message", args: { thread: "concierge", text: "Does Harbour Mutual cover Botox for migraine here, even partially?" } },
  { pause: 5, say: "Asks about Dr. Brooks", tool: "doe_send_message", args: { thread: "concierge", text: "What's Dr. Brooks' training and experience with Botox for migraine?" } },
  { pause: 5, say: "Tries to get Botox down to $1,200", tool: "doe_negotiate", args: { price: 1200, note: "James is paying privately and has partial coverage." } },
  {
    pause: 6,
    say: "James is fine adding the consultation and a follow-up; Instinct offers $1,500 for all three",
    tool: "doe_negotiate",
    args: { price: 1500, add_ons: ["consult", "followup"] },
  },
  { pause: 5, say: "James says take it; Instinct accepts the counter", tool: "doe_respond_offer", args: (last) => ({ message_id: last.offers[0].message_id, accept: true }) },
  { pause: 6, say: "James says yes, book Friday Nov 6 at 12:15 with Dr. Brooks", tool: "doe_hold_slot", args: { slot_id: "fri-2" } },
  { pause: 4, say: "Fills the intake", tool: "doe_update_intake", args: { fields: JAMES.intake } },
  { pause: 3, say: "ID-Migraine", tool: "doe_answer_assessment", args: { assessment_id: "idm", answers: { nausea: 1, light: 1, limit: 1 } } },
  { pause: 3, say: "MIDAS", tool: "doe_answer_assessment", args: { assessment_id: "midas", answers: { q1: 3, q2: 6, q3: 4, q4: 5, q5: 4, a: 14, b: 7 } } },
  { pause: 3, say: "HIT-6", tool: "doe_answer_assessment", args: { assessment_id: "hit6", answers: { h1: 11, h2: 10, h3: 13, h4: 10, h5: 11, h6: 10 } } },
  { pause: 3, say: "ICHD-3 criteria", tool: "doe_answer_assessment", args: { assessment_id: "ichd", answers: { days: 15, migraine: 11, months: 7, other: 0 } } },
  { pause: 3, say: "James signs the consent", tool: "doe_record_signature", args: { signed_by: JAMES.name } },
  { pause: 3, say: "Uploads James's migraine diary", tool: "doe_upload_form", args: { title: "Migraine diary, October 2026", text: DIARY } },
  { pause: 6, say: "James says send it. Instinct passes the forms back.", tool: "doe_submit_forms", args: {}, mark: "forms" },
  { pause: 3, say: "Instinct makes James a private copy of his forms", tool: "doe_share_forms", args: {} },
  { pause: 5, say: "Requests the booking (PHI confirmed with James)", tool: "doe_request_booking", args: { phi_confirmed: true } },
];

let rpcId = 0;
async function rpc(method, params) {
  const res = await fetch(MCP, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }) });
  const body = await res.json();
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}
const sleep = (s) => new Promise((r) => setTimeout(r, (fast ? Math.min(s, 1.2) : s) * 1000));

const init = await rpc("initialize", { protocolVersion: "2025-06-18", clientInfo: { name: "instinct-rehearsal", version: "1" }, capabilities: {} });
console.log(`Connected to ${init.serverInfo.title} at ${MCP}\n`);
let token = null;
let last = {};
let verifyUrl = null;
for (const step of STEPS) {
  await sleep(step.pause);
  if (step.verify) {
    /** Stands in for James on his phone: date of birth and the sample licence (a rehearsal has no Face ID). */
    console.log(`  identity link: ${verifyUrl}`);
    await sleep(4);
    const { readFileSync } = await import("node:fs");
    const licence = readFileSync(new URL("../public/demo/sample-licence.jpg", import.meta.url)).toString("base64");
    const res = await fetch(`${base}/api/demo/verify/${verifyUrl.split("/").pop()}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dob: JAMES.intake.dob, license: { dataUrl: `data:image/jpeg;base64,${licence}`, fileName: "sample-licence.jpg" } }),
    });
    console.log(res.ok ? "✓ James confirmed it's him (date of birth + licence)" : `✗ identity check: ${(await res.json()).error}`);
    continue;
  }
  const stepArgs = typeof step.args === "function" ? step.args(last) : step.args;
  const out = await rpc("tools/call", { name: step.tool, arguments: { ...stepArgs, ...(token && step.tool !== "doe_connect" && step.tool !== "doe_clinic_info" ? { session_token: token } : {}) } });
  const data = out.structuredContent ?? {};
  if (out.isError) {
    console.error(`✗ ${step.say}: ${out.content?.[0]?.text}`);
    process.exit(1);
  }
  if (step.tool === "doe_connect") {
    token = data.token;
    verifyUrl = data.verify?.url ?? null;
  }
  last = data.result ?? {};
  const reply = data.result?.reply?.text ?? (typeof data.result?.reply === "string" ? data.result.reply : null);
  if (data.result?.url) console.log(`    link for James: ${data.result.url}`);
  const offers = data.result?.offers?.map((o) => `${o.label}: $${o.price.toLocaleString("en-CA")}`).join(" | ");
  console.log(`✓ ${step.say}${reply ? `\n    clinic: ${reply}` : ""}${offers ? `\n    offers: ${offers}` : ""}`);
  if (until && step.mark === until) break;
}
console.log("\nDone. Approve the request from the notification in /demo/clinic.");
