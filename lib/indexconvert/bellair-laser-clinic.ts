/**
 * Bellair Laser Clinic, parsed from bellairlaserclinic.ca (home, shop price list, Botox, about, promotions, financing
 * and booking pages, and its own llms.txt). Only what the site states. Prices are the lowest listed price for each
 * item in its online shop, in CAD; laser hair removal and PicoSure prices are packages.
 */
import type { ClinicPack } from "@/lib/indexconvert/clinic-pack";

const WEEK_ROWS = [
  ["Monday – Friday", "9:00 a.m. – 8:00 p.m."],
  ["Saturday", "9:00 a.m. – 6:00 p.m."],
  ["Sunday", "Closed"],
] as const;
const WEEK_24 = { mon: "09:00-20:00", tue: "09:00-20:00", wed: "09:00-20:00", thu: "09:00-20:00", fri: "09:00-20:00", sat: "09:00-18:00", sun: null } as const;

const CLINIC = {
  name: "Bellair Laser Clinic",
  domain: "bellairlaserclinic.ca",
  url: "bellairlaserclinic.ca",
  headline: "The Most Experienced Laser + Skincare Clinic in Toronto",
  kind: "Laser, Skincare & Injectables",
  area: "Yorkville & Yonge-Eglinton, Toronto",
  since: 2004,
  phone: "(416) 972-0337",
  phoneIntl: "+1-416-972-0337",
  consult: "Free",
  consultNote: "30 minutes, in person at either location, booked online.",
  currency: "CAD",
  tax: "Not stated",
  bookingUrl: "https://bellairlaserclinic.ca/book-consultation/",
  bookingResponse: "online_booking",
} as const;

export const BELLAIR_PACK: ClinicPack = {
  short: "Bellair",
  assets: "/indexconvert-2",
  SOURCE_PAGES: [
    { path: "/", label: "Home", shot: "home", found: "Name, specialties, two clinics" },
    { path: "/shop/", label: "Prices", shot: "prices", found: "150 listed prices" },
    { path: "/botox/", label: "Botox & Dysport", shot: "botox", found: "Treatment details, injectors" },
    { path: "/about-us/", label: "About Us", shot: "about", found: "Medical directors, team" },
    { path: "/promotions/", label: "Promotions", shot: "promos", found: "Current offers" },
    { path: "/monthly-financing/", label: "Financing", shot: "financing", found: "Beautifi financing" },
    { path: "/book-consultation/", label: "Book Consultation", shot: "contact", found: "Locations, hours, booking" },
  ],
  CLINIC,
  LOCATIONS: [
    { name: "Bellair Yorkville", detail: "Flagship clinic since 2004 · Bay & Bloor", address: "116 Cumberland St", city: "Toronto, ON M5R 1A6", hoursRows: WEEK_ROWS, hours24: WEEK_24 },
    { name: "Bellair Yonge & Eglinton", detail: "Midtown clinic since 2007", address: "2237 Yonge St", city: "Toronto, ON M4S 2B8", hoursRows: WEEK_ROWS, hours24: WEEK_24 },
  ],
  PROVIDERS: [
    { name: "Dr. Peter Bray", role: "Plastic Surgeon · Medical Director", fact: "FRCSC, board certified. MD and MSc, University of Toronto; assistant professor of surgery there since 2001." },
    { name: "Dr. Greg Pugen", role: "Medical Supervisor · Injector", fact: "MD, University of Toronto. Board certified in anti-aging regenerative medicine; Cutera trainer." },
    { name: "Nurse Injectors", role: "Four nurse-injectors", fact: "Botox and dermal fillers alongside Dr. Pugen. Only nurses and doctors perform treatments." },
  ],
  SERVICES: [
    { group: "Injectables", items: ["Botox / Dysport", "Dermal Filler", "Premium Dermal Filler", "Skin Booster", "Sculptra", "Belkyra", "Pluryal", "Hyperhidrosis Botox"] },
    {
      group: "Skin & Laser",
      items: [
        "Fraxel, full face", "Fractional CO2, full face", "Morpheus8", "Microneedling", "HIFU, full face", "Thermage FLX, face", "XERF, face",
        "IPL Photorejuvenation, face", "Laser Genesis, face", "PicoSure Pigment, face", "Signature HydraFacial", "Vampire Facial", "Glycolic or Salicylic Peel",
        "ThermaFrac Exosome 4D", "Acne Treatments",
      ],
    },
    { group: "Laser Hair Removal", items: ["Upper lip", "Underarm", "Brazilian", "Full face", "Full legs", "Full body"] },
    { group: "Body", items: ["CoolSculpting, small applicator", "CoolSculpting, large applicator", "CoolSculpting, double chin", "Emsculpt NEO", "Thermage FLX, body", "Carboxytherapy Cellulite"] },
    { group: "Hair, Veins & Marks", items: ["Vampire Hair", "Spider Vein Removal, small area", "Tattoo Removal, 1 in. area", "Skin Tag Removal, small", "Penile Enhancement", "Dermamelan Intimate"] },
  ],
  PRICES: [
    {
      group: "Injectables",
      items: [
        { name: "Botox / Dysport", price: "$14.50 / unit" },
        { name: "Dermal Filler", price: "$499" },
        { name: "Premium Dermal Filler", price: "$550" },
        { name: "Skin Booster", price: "$499" },
        { name: "Sculptra", price: "$699" },
        { name: "Belkyra", price: "$699" },
        { name: "Pluryal", price: "$658.90" },
      ],
    },
    {
      group: "Skin & Laser",
      items: [
        { name: "Fraxel, full face", price: "$1,089" },
        { name: "Fractional CO2, full face", price: "$700" },
        { name: "Morpheus8", price: "$1,546.88" },
        { name: "Microneedling", price: "$665.50" },
        { name: "HIFU, full face", price: "$650" },
        { name: "Thermage FLX, face", price: "$1,599" },
        { name: "XERF, face", price: "$2,599" },
        { name: "IPL Photorejuvenation, face", price: "$598.95" },
        { name: "Laser Genesis, face", price: "$433.24" },
        { name: "PicoSure Pigment, face", price: "$726" },
        { name: "Signature HydraFacial", price: "$165" },
        { name: "Vampire Facial", price: "$800" },
        { name: "Glycolic or Salicylic Peel", price: "$212.43" },
        { name: "ThermaFrac Exosome 4D", price: "$4,356" },
      ],
    },
    {
      group: "Laser Hair Removal",
      items: [
        { name: "Upper lip", price: "$167.13" },
        { name: "Underarm", price: "$333.60" },
        { name: "Brazilian", price: "$568.25" },
        { name: "Full face", price: "$734.71" },
        { name: "Full legs", price: "$1,103.06" },
        { name: "Full body", price: "$5,469.75" },
      ],
    },
    {
      group: "Body",
      items: [
        { name: "CoolSculpting, small applicator", price: "$599" },
        { name: "CoolSculpting, large applicator", price: "$899" },
        { name: "CoolSculpting, double chin", price: "$899" },
        { name: "Emsculpt NEO", price: "$900" },
        { name: "Thermage FLX, body", price: "$1,599" },
      ],
    },
    {
      group: "Hair, Veins & Marks",
      items: [
        { name: "Vampire Hair", price: "$950" },
        { name: "Spider Vein Removal, small area", price: "$367.56" },
        { name: "Tattoo Removal, 1 in. area", price: "$217.80" },
        { name: "Skin Tag Removal, small", price: "$220.81" },
      ],
    },
  ],
  OFFERS: [
    { title: "30% Off Laser + Tech", detail: "Fall sale on select laser and technology treatments, for a limited time. Treatments expire 24 months from purchase.", tag: "Sale" },
    { title: "Botox + Filler Bundle", detail: "50 units of Botox or Dysport with one syringe of dermal filler, $998.", tag: "Bundle" },
    { title: "Free Consultation", detail: "A free 30-minute consult at either clinic, booked online.", tag: "Free" },
    { title: "Monthly Financing", detail: "Beautifi: $1,000 to $50,000+, terms of 6 months to 6 years, rates from 7.5%, no credit score impact to apply.", tag: "Financing" },
  ],
  BOOKING: {
    today: [
      "Free 30-minute consult, booked online per location",
      "Phone (416) 972-0337 (Yorkville) or (416) 489-0337 (Yonge & Eglinton)",
      "Treatments bought in the online shop; a deposit for injectables",
    ],
    fields: ["Service of interest", "Preferred location", "Name", "Email", "Phone", "How did you find us"],
    withDoe: ["Agents book consults at the right clinic, any hour", "Treatment, area and package arrive with the booking", "Confirmations and reminders sent for you"],
  },
  contactRows: [
    ["Yorkville", "(416) 972-0337"],
    ["Yonge & Eglinton", "(416) 489-0337"],
  ],
  pageReads: {
    home: [["name", "Bellair Laser Clinic"], ["specialty", "Laser + skincare"], ["since", "2004 · Yorkville"]],
    prices: [["price", "Botox / Dysport · $14.50/unit"], ["price", "Dermal filler · $499"], ["price", "Underarm laser · $333.60"]],
    botox: [["service", "Botox & Dysport"], ["provider", "Dr. Greg Pugen"], ["areas", "Forehead, crow's feet"]],
    about: [["provider", "Dr. Peter Bray, FRCSC"], ["provider", "Dr. Greg Pugen"], ["team", "65 medical professionals"]],
    promos: [["offer", "30% off laser + tech"], ["offer", "0% financing"], ["note", "Expires in 24 months"]],
    financing: [["financing", "Beautifi"], ["range", "$1,000 – $50,000+"], ["terms", "6 months – 6 years"]],
    contact: [["location", "116 Cumberland St"], ["location", "2237 Yonge St"], ["hours", "Mon–Fri 9–8, Sat 9–6"]],
  },
  agentCheck: { detail: "llms.txt found; no MCP card or OpenAPI", subs: ["llms.txt found", "No MCP card", "No OpenAPI"] },
  example: {
    chatAsk: "Find Botox near Yonge & Eglinton under $16 a unit, open Saturday",
    chatReply: "Bellair Laser Clinic at 2237 Yonge St is open Saturday 9 to 6 and lists Botox at $14.50 a unit. Want me to book a free consult?",
    priceJson: [["botox_unit", 14.5], ["consult", 0]],
    partnerQuery: "Laser hair removal in Toronto",
    partnerResult: "Underarm package · from $333.60",
    apiBody: `{"service":"botox_dysport","location":"yonge_eglinton"}`,
  },
};
