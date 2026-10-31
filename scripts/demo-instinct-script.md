# Instinct demo script: Dr. Brooks' Migraine Clinic

How the demo conversation goes between James and Instinct, and what the clinic sees at `/demo/clinic` at each beat.
James's details, the clinic, Dr. Brooks and Harbour Mutual are all fictional.

**Before you start**
- Add the MCP server to Instinct: `https://doehealth.care/api/demo/mcp` (Streamable HTTP, no auth).
- Open `https://doehealth.care/demo/clinic` on the screen you're presenting from.
- To rehearse without Instinct: `node scripts/demo-instinct-rehearsal.mjs https://doehealth.care` plays the same MCP calls (add `--fast` to speed it up).

---

**James:** My migraines have been getting worse. Can you pull up my migraine diary?

**Instinct** (text message):
> Here's October. You had 14 headache days, up from 9 in September; 11 were full migraines. Average pain 7/10, and you took rizatriptan on 9 days. You missed work on Oct 8, 16 and 22. The longest was Oct 22: 22 hours, 9/10, with nausea, light and sound sensitivity. Triggers you logged: poor sleep, red wine, late screens and a weather change.

(The full diary is the `DIARY` text in `demo-instinct-rehearsal.mjs`.)

**James:** I've been reading into Botox for migraines. Do you know anyone near me who could do it?

**Instinct:**
> I can look. How far should I search? Want me to check that they take your Harbour Mutual, even partially? And what price range works?

**James:** Within 50 km, yes to Harbour Mutual, and under $3k.

**Instinct:** Okay, I'll have a look.

*About 10 seconds later*

**Instinct:**
> I found a clinic: Dr. Brooks' Migraine Clinic, 480 University Avenue, Suite 1200, Toronto, Ontario. They have a Doe integration, so I can connect to them directly and handle this with them.

**Instinct** (separate message): doehealth.care/demo

*Instinct opens it and follows the prompts. It confirms with James that he agrees to Doe's Terms and Privacy Policy and is voluntarily providing his PHI by booking through Doe, then connects as Instinct, for James Lisondra, Toronto, Ontario, (416) 555-0137.*

> **Clinic sees:** a card pops up: "Instinct connected via Model Context Protocol", with James's name, city, phone and request. Watch Live opens the live view: the log on the left, and on the right "What they want you to do" being typed, the consents ticked, then the clinic being read.

**Instinct:**
> They have availability Friday, November 6 at 12:15 pm with Dr. Sarah Brooks. She's a neurologist (FRCPC) trained at the University of Toronto, with a headache medicine fellowship at the Jefferson Headache Center. She has 15 years in practice and more than 4,000 Botox sessions for migraine. Patients rate her 4.9 from 312 verified reviews; one wrote, "Went from 20 headache days a month to 6 after my second round." Harbour Mutual covers 60% of Botox for chronic migraine, up to $2,000 a year. The session is $1,377 through Doe, so about $551 after Harbour Mutual. Want me to book?

(Instinct gets all of this from `doe_clinic_info`: `provider_profiles` and `insurance_plans`.)

**James:** Yes, but see if you can get the price down.

*Instinct negotiates over MCP with `doe_negotiate`: $1,200 for Botox alone.*

> **Clinic sees:** "Instinct is negotiating · asked $1,200 for Botox for chronic migraine", and under it the clinic agent's two counters: $1,335 for Botox alone, or $1,540 for Botox + consultation + follow-up (list $1,975). The live view shows the offers as cards, with the savings.

**Instinct:**
> They won't go below $1,335 for Botox alone. But your first Botox needs a $350 consultation anyway, so it's really $1,800. If you add the consultation and a follow-up, they'll do all three for $1,540 (list $1,975). Want me to try $1,500 for the three?

**James:** Yes.

*Instinct proposes $1,500 for the package. The clinic agent meets in the middle at $1,520 ($455 off list), and Instinct accepts with `doe_respond_offer`.*

> **Clinic sees:** a new counter of $1,520, then "Instinct took the deal: $1,520 for Botox + consultation + follow-up, $455 off list".

**Instinct:**
> Done: $1,520 for Botox, the consultation and a follow-up, instead of $1,975. I'm holding Friday Nov 6 at 12:15 with Dr. Brooks.

> **Clinic sees:** the calendar opens in the live view and the 12:15 pm Friday slot is held.

**Instinct:**
> There's an intake form and 4 short assessments (ID-Migraine, MIDAS, HIT-6 and the ICHD-3 criteria), plus a consent to sign. I've filled them in from what I know and your diary, and I'll attach the diary too:
> - **Intake:** James Lisondra, born Mar 14, 1996, (416) 555-0137, james.lisondra@example.com. Tried topiramate (brain fog) and amitriptyline (drowsy). Takes rizatriptan 10 mg and ibuprofen. Allergic to penicillin. No neuromuscular disorder.
> - **ID-Migraine:** nausea yes, light sensitivity yes, limited a day yes (3/3).
> - **MIDAS:** 22 days lost over 3 months, Grade IV (severe).
> - **HIT-6:** 65, severe impact.
> - **ICHD-3:** 15 headache days a month, 11 migraine days, for 7 months; meets chronic migraine.
>
> Want me to send them?

**James:** Yes.

> **Clinic sees:** "Forms uploaded" with all 5 forms and their scores, then "Migraine diary uploaded". Both are under Forms and Uploads.

*Instinct requests the booking, confirming with James again that he's providing his PHI through Doe.*

> **Clinic sees:** "Appointment requested": Fri Nov 6, 12:15 pm with Dr. Sarah Brooks, Botox + consultation + follow-up, $1,520. Approve right on the card (or in the live view). Instinct sees the confirmation on its next check.
