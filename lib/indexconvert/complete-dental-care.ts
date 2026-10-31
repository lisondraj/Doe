/**
 * Complete Dental Care Paradise Valley (Phoenix, AZ), parsed from completedentalcareaz.com (home, special offers,
 * in-house savings plan, Dr. Sandhu's page, services, for patients and contact). Only what the site states. It lists
 * three prices, in USD; every other treatment is quoted after an exam.
 */
import type { ClinicPack } from "@/lib/indexconvert/clinic-pack";

const WEEK_ROWS = [
  ["Monday – Friday", "8:00 a.m. – 5:00 p.m."],
  ["Saturday – Sunday", "Not listed"],
] as const;
const WEEK_24 = { mon: "08:00-17:00", tue: "08:00-17:00", wed: "08:00-17:00", thu: "08:00-17:00", fri: "08:00-17:00", sat: null, sun: null } as const;

export const COMPLETE_DENTAL_PACK: ClinicPack = {
  short: "Complete Dental",
  assets: "/indexconvert-3",
  SOURCE_PAGES: [
    { path: "/", label: "Home", shot: "home", found: "Name, dentists, booking" },
    { path: "/special-offers", label: "Special Offers", shot: "offers", found: "New patient specials" },
    { path: "/in-house-savings-plan", label: "Savings Plan", shot: "plan", found: "$349 yearly plan" },
    { path: "/meet-dr-sandhu", label: "Meet Dr. Sandhu", shot: "sandhu", found: "Training, memberships" },
    { path: "/our-services", label: "Our Services", shot: "services", found: "26 services" },
    { path: "/for-patients", label: "For Patients", shot: "patients", found: "Insurance, financing, forms" },
    { path: "/contact", label: "Contact", shot: "contact", found: "Address, hours, phone" },
  ],
  CLINIC: {
    name: "Complete Dental Care",
    domain: "completedentalcareaz.com",
    url: "completedentalcareaz.com",
    headline: "Exceptional dental care with the personal attention you deserve",
    kind: "Family, Cosmetic & Restorative Dentistry",
    area: "Paradise Valley, Phoenix, AZ",
    phone: "(480) 530-0492",
    phoneIntl: "+1-480-530-0492",
    consult: "$39",
    consultNote: "Complete exam with an X-ray, or a second opinion.",
    currency: "USD",
    tax: "Not stated",
    bookingUrl: "https://book.allinone.dental/complete-dental-care",
    bookingResponse: "online_booking",
  },
  LOCATIONS: [
    { name: "Complete Dental Care", detail: "Dental office · becoming Belmont Dentistry", address: "15255 N 40th St, Ste 141", city: "Phoenix, AZ 85032", hoursRows: WEEK_ROWS, hours24: WEEK_24 },
  ],
  PROVIDERS: [
    { name: "Dr. Puneet Sandhu, DDS", role: "Family & Cosmetic Dentist", fact: "UCLA School of Dentistry. Spear Education faculty; focuses on full mouth reconstruction. Fellowship International Dental Implant Association." },
    { name: "Dr. Mohan, DDS", role: "Restorative & Comprehensive Care", fact: "BDS, advanced training at New York University. Serving Phoenix patients since 2015." },
  ],
  SERVICES: [
    { group: "Checkups & Cleanings", items: ["New Patient Exam, X-Rays & Cleaning", "Complete Exam", "Dental Checkups & Cleanings", "Oral Cancer Screening", "Dental Sealants", "Athletic Mouthguards", "Nightguards for Bruxism"] },
    { group: "Gum Disease", items: ["Scaling & Root Planing", "Laser Periodontal Therapy"] },
    { group: "Restorative", items: ["Dental Crowns", "Tooth-Colored Fillings", "Root Canal Therapy", "Tooth Extractions", "Wisdom Tooth Extractions", "Full Mouth Reconstruction"] },
    { group: "Missing Teeth", items: ["Dental Implants", "Implant Dentures", "Dental Bridges", "Dentures"] },
    { group: "Cosmetic", items: ["Veneers", "Teeth Whitening", "Smile Makeovers", "Metal-Free Restorations", "Gum Recontouring"] },
    { group: "Comfort & Emergencies", items: ["Same-Day Emergency Visits", "Oral Conscious Sedation", "Nitrous Oxide Sedation"] },
    { group: "Memberships", items: ["In-House Savings Plan"] },
  ],
  PRICES: [
    {
      group: "Checkups & Cleanings",
      items: [
        { name: "New Patient Exam, X-Rays & Cleaning", price: "$99" },
        { name: "Complete Exam", price: "$39" },
      ],
    },
    { group: "Memberships", items: [{ name: "In-House Savings Plan", price: "$349 / year" }] },
  ],
  OFFERS: [
    { title: "$99 New Patient Special", detail: "Complete exam, full-mouth X-rays and a preventive cleaning, for new patients without gum disease. Limited time.", tag: "New Patients" },
    { title: "$39 Complete Exam", detail: "A complete exam with an X-ray, or a second opinion.", tag: "Exam" },
    { title: "In-House Savings Plan", detail: "$349 a year: 2 check-ups, 1 emergency exam, 2 cleanings and all X-rays, 50% off cone beam CT scans and 20% off all services.", tag: "Membership" },
    { title: "Insurance & CareCredit", detail: "In-network with many PPO dental plans; CareCredit financing available.", tag: "Financing" },
  ],
  BOOKING: {
    today: ["Book online through the practice's scheduler", "Phone (480) 530-0492, weekdays 8 to 5", "Contact form, answered within 24–48 hours"],
    fields: ["Full name", "Phone", "Email", "Preferred contact method", "Dental insurance", "Interested in"],
    withDoe: ["Agents book exams and cleanings, any hour", "Insurance, visit reason and forms arrive with the booking", "Confirmations and reminders sent for you"],
  },
  contactRows: [
    ["Phone", "(480) 530-0492"],
    ["Email", "info@completedentalcareaz.com"],
  ],
  pageReads: {
    home: [["name", "Complete Dental Care"], ["specialty", "Family & cosmetic dentistry"], ["area", "Paradise Valley, Phoenix"]],
    offers: [["price", "New patient special · $99"], ["price", "Complete exam · $39"], ["note", "Includes X-rays"]],
    plan: [["plan", "Savings plan · $349/yr"], ["includes", "2 cleanings, all X-rays"], ["discount", "20% off all services"]],
    sandhu: [["provider", "Dr. Puneet Sandhu, DDS"], ["training", "UCLA dentistry"], ["focus", "Full mouth reconstruction"]],
    services: [["service", "Dental implants"], ["service", "Invisible fillings, crowns"], ["comfort", "Nitrous & oral sedation"]],
    patients: [["insurance", "In-network PPO"], ["financing", "CareCredit"], ["forms", "Online patient forms"]],
    contact: [["location", "15255 N 40th St, Ste 141"], ["hours", "Mon–Fri 8–5"], ["phone", "(480) 530-0492"]],
  },
  agentCheck: { detail: "No llms.txt, MCP card or OpenAPI", subs: ["No llms.txt", "No MCP card", "No OpenAPI"] },
  example: {
    chatAsk: "Find a dentist near Paradise Valley with a new patient cleaning under $120 this week",
    chatReply: "Complete Dental Care on N 40th St has a $99 new patient exam, X-rays and cleaning, weekdays 8 to 5. Want me to book it?",
    priceJson: [["new_patient", 99], ["exam", 39]],
    partnerQuery: "Dentist in Phoenix, new patient",
    partnerResult: "Exam, X-rays & cleaning · $99",
    apiBody: `{"service":"new_patient_exam_x_rays_cleaning","provider":"puneet-sandhu"}`,
  },
};
