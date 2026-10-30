/**
 * Ford Plastic Surgery, parsed from fordplasticsurgery.com (home, pricing & financing, med spa, staff, locations,
 * contact and the facelift page). Only what the site states; prices are CAD starting prices before HST.
 */

export type ParsedPage = { path: string; label: string; shot: string; found: string };

/** The pages the loader reads, in order, with the screenshot shown behind it and what it pulled from each. */
export const SOURCE_PAGES: ParsedPage[] = [
  { path: "/", label: "Home", shot: "home", found: "Name, specialties, 4 surgeons" },
  { path: "/about/pricing-financing/", label: "Pricing & Financing", shot: "pricing", found: "Starting prices, financing" },
  { path: "/medical-spa/", label: "Medical Spa", shot: "medspa", found: "Med spa treatments" },
  { path: "/about/our-staff/", label: "Our Staff", shot: "staff", found: "Injectors, aesthetician, team" },
  { path: "/about/our-locations/", label: "Our Locations", shot: "locations", found: "Suites, surgical centre" },
  { path: "/face/facelift-neck-lift/", label: "Facelift & Neck Lift", shot: "facelift", found: "Procedure details" },
  { path: "/contact/", label: "Contact", shot: "contact", found: "Hours, phone, booking form" },
];

export const CLINIC = {
  name: "Ford Plastic Surgery",
  domain: "fordplasticsurgery.com",
  url: "www.fordplasticsurgery.com",
  headline: "Naturally Rejuvenated Results, Expertly Done",
  kind: "Plastic Surgery & Nonsurgical Aesthetics",
  area: "Bloor-Yorkville, Toronto",
  since: 2004,
  phone: "(416) 925-7337",
  tollFree: "(888) 925-7337",
  consult: "$300 + HST",
  consultNote: "Virtual or in person. Credited toward a procedure booked within 3 months.",
} as const;

export const LOCATIONS = [
  { name: "Ford Plastic Surgery", detail: "Surgical office · overnight stays", address: "7 St Thomas St, Suite 410", city: "Toronto, ON M5S 2B7" },
  { name: "St. Thomas Aesthetics", detail: "Medical spa", address: "7 St Thomas St, Suite 202", city: "Toronto, ON M5S 2B7" },
] as const;

export const HOURS = [
  { day: "Mon", time: "8:30 – 4:30" },
  { day: "Tue", time: "8:30 – 4:30" },
  { day: "Wed", time: "8:30 – 4:30" },
  { day: "Thu", time: "8:30 – 4:30" },
  { day: "Fri", time: "8:30 – 4:30" },
  { day: "Sat", time: null },
  { day: "Sun", time: null },
] as const;

export const PROVIDERS = [
  { name: "Dr. Derek Ford", role: "Plastic Surgeon · Founder", fact: "Royal College certified. First in Canada to offer the endoscopic mid facelift. U of T faculty.", tone: "#F7DCCB" },
  { name: "Dr. Steven Hanna", role: "Plastic Surgeon", fact: "Royal College certified. Aesthetic fellowship, Manhattan Eye, Ear & Throat. Rhinoplasty and facelift.", tone: "#DCE5D0" },
  { name: "Dr. Laura Snell", role: "Plastic Surgeon", fact: "FRCSC. Breast enhancement and body contouring.", tone: "#E9DCC7" },
  { name: "Dr. Meghan McGrattan", role: "Gynecologic Surgeon", fact: "Royal College certified, fellowship trained. Labiaplasty and aesthetic gynecology.", tone: "#FCCFB8" },
  { name: "Isabel Middleman, PA-C", role: "Physician Assistant", fact: "BOTOX and dermal fillers, OR assist, post-op care.", tone: "#E3E9D9" },
  { name: "Caroline Watson", role: "Aesthetician", fact: "20+ years. The Custom CW Facial, microneedling, virtual skincare consults.", tone: "#EEEADF" },
] as const;

export const SERVICES: { group: string; items: string[] }[] = [
  {
    group: "Face",
    items: [
      "Facelift & Neck Lift", "Deep Plane Facelift", "Endoscopic Mid Facelift", "Deep Neck Lift", "Rhinoplasty", "Brow Lift",
      "Upper Eyelid Surgery", "Lower Eyelid Surgery", "Double Eyelid Surgery", "Chin Augmentation", "Cheek Augmentation",
      "Ear Surgery", "Earlobe Repair", "Upper Lip Lift", "Facial Fat Grafting", "Buccal Fat Removal", "Male Facial Surgery",
    ],
  },
  {
    group: "Breast",
    items: ["Breast Augmentation", "Breast Lift", "Breast Lift + Augmentation", "Breast Reduction", "Complex Breast Revision", "Gynecomastia Surgery", "Inverted Nipple Repair"],
  },
  {
    group: "Body",
    items: ["Tummy Tuck", "Mini Tummy Tuck", "Mommy Makeover", "Liposuction", "Fat Transfer", "Arm Lift", "Thigh Lift", "Lower Body Lift", "Labiaplasty", "Aesthetic Gynecology", "Renuvion Skin Tightening"],
  },
  {
    group: "Med Spa",
    items: [
      "BOTOX Cosmetic", "JUVÉDERM", "Restylane", "Lip Flip", "Hyaluronidase", "BBL Laser", "HALO Laser", "MOXI", "ProFractional",
      "Morpheus8", "Microneedling", "Chemical Peels", "OxyGeneo Facial", "The Custom CW Facial", "Sculptural Face Lifting", "Lymphatic Drainage + LED",
    ],
  },
];

/** Starting prices in CAD before HST, as listed on /about/pricing-financing/. */
export const PRICES: { group: string; items: { name: string; price: string }[] }[] = [
  {
    group: "Face",
    items: [
      { name: "Deep Plane Facelift", price: "$22,500" },
      { name: "Endoscopic Mid Facelift", price: "$15,500" },
      { name: "Deep Neck Lift", price: "$13,800" },
      { name: "Rhinoplasty", price: "$17,100" },
      { name: "Endoscopic Brow Lift", price: "$11,300" },
      { name: "Temporal Brow Lift", price: "$9,400" },
      { name: "Upper Eyelid", price: "$8,000" },
      { name: "Upper Double Fold", price: "$9,000" },
      { name: "Chin Augmentation", price: "$11,200" },
      { name: "Ear Surgery", price: "$9,600" },
      { name: "Facial Fat Grafting", price: "$7,700" },
      { name: "Upper Lip Lift", price: "$7,500" },
      { name: "Earlobe Repair", price: "$935" },
    ],
  },
  {
    group: "Breast",
    items: [
      { name: "Breast Augmentation", price: "$12,500" },
      { name: "Breast Lift", price: "$14,200" },
      { name: "Breast Lift + Augmentation", price: "$16,200" },
      { name: "Breast Reduction", price: "$14,200" },
      { name: "Male Breast Reduction", price: "$13,800" },
      { name: "Inverted Nipple Repair", price: "$3,100" },
    ],
  },
  {
    group: "Body",
    items: [
      { name: "Tummy Tuck", price: "$17,700" },
      { name: "Mini Tummy Tuck", price: "$13,000" },
      { name: "Tummy Tuck + Augmentation", price: "$29,800" },
      { name: "Liposuction, first area", price: "$7,700" },
      { name: "Arm Lift", price: "$16,100" },
      { name: "Lower Body Lift", price: "$32,400" },
      { name: "Labiaplasty", price: "$8,100" },
    ],
  },
  {
    group: "Med Spa",
    items: [
      { name: "BOTOX Cosmetic", price: "$13 / unit" },
      { name: "JUVÉDERM or Restylane", price: "$800 / cc" },
      { name: "Lip Flip", price: "$200" },
      { name: "Morpheus8, face", price: "$950" },
      { name: "HALO, face", price: "$1,500" },
      { name: "BBL, face", price: "$550" },
      { name: "MOXI, face", price: "$850" },
      { name: "Microneedling, face", price: "$500" },
      { name: "Chemical Peel, face", price: "$250" },
      { name: "The Custom CW Facial", price: "$325" },
    ],
  },
];

export const OFFERS = [
  { title: "Consult Credit", detail: "The $300 consult fee comes off any procedure booked within 3 months." },
  { title: "3-Session Packages", detail: "BBL, HALO, Morpheus8, MOXI, peels and facials. Morpheus8 face: $2,700 for 3." },
  { title: "Facelift Aftercare Included", detail: "Every deep plane facelift includes 3 lymphatic drainage sessions." },
  { title: "Financing", detail: "Medicard (no down payment, up to $50,000) and Beautifi, with 0% specials at times." },
] as const;

export const BOOKING = {
  today: [
    "Request-a-consultation form, answered by a callback",
    `Phone ${CLINIC.phone} or text, weekdays 8:30 – 4:30`,
    "Quote calculator at calculator.fordplasticsurgery.com",
  ],
  fields: ["Procedure", "Preferred provider", "Best time to call", "Contact by phone, email or text"],
} as const;

/** Things the parse found that an agent would trip on; each is fixed in a sentence once the page is claimed. */
export const ISSUES = [
  { title: "Two BOTOX Prices", detail: "$11/unit in the pricing intro, $13/unit in the table." },
  { title: "Two JUVÉDERM Prices", detail: "$775/cc in the intro, $800/cc in the table." },
  { title: "Suite 202 Has Two Names", detail: "Ford Plastic Surgery at the top of the home page, St. Thomas Aesthetics in the footer." },
  { title: "No Weekend or Holiday Hours", detail: "Agents can't tell patients whether you're open." },
  { title: "No Online Booking", detail: "Agents can only send patients to a form and wait for a callback." },
] as const;

export const SERVICE_COUNT = SERVICES.reduce((n, g) => n + g.items.length, 0);
export const PRICE_COUNT = PRICES.reduce((n, g) => n + g.items.length, 0);
/** Every structured value on the page: listed fields, each service, price, provider, location, hours row and offer. */
export const FIELD_COUNT =
  12 + SERVICE_COUNT + PRICE_COUNT * 2 + PROVIDERS.length * 3 + LOCATIONS.length * 4 + HOURS.length + OFFERS.length * 2 + BOOKING.fields.length;
