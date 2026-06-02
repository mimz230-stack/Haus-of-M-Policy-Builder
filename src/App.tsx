import React, { useEffect, useMemo, useState } from "react";
 
// ─── DATA ────────────────────────────────────────────────────────────────────
 
const DEFAULT_SETTINGS = {
  businessName: "Your Beauty Business",
  bookingFeeAmount: 30,
  cancellationNotice: 24,
  noShowRule: "bookingFeeKept",
  lateMinutes: 10,
  sicknessNotice: 24,
  childrenPolicy: "noChildren",
  extraGuestsPolicy: "noGuests",
  refundPolicy: "serviceBased",
  rescheduleLimit: 1,
  paymentTiming: "appointmentEnd",
  patchTestRequired: true,
  correctionWindow: 48,
  parkingGraceMinutes: 10,
  parkingType: "onsite",
  touchUpWindow: 8,
  trainingDepositAmount: 200,
  trainingRescheduleNotice: 7,
  trainingPaymentDueDays: 7,
  trainingCancellationNotice: 14,
  tone: "clear",
};
 
const DEFAULT_INCLUDED = {
  bookingFee: false, cancellation: false, noShow: false, lateArrival: false,
  rescheduling: false, refunds: false, sickness: false, childrenGuests: false,
  patchTesting: false, correctionWork: false, parkingPolicy: false,
  healingPolicy: false, touchUpPolicy: false, trainingDeposit: false,
  trainingPayment: false, trainingRefunds: false, trainingCancellation: false,
  trainingRescheduling: false, certificationPolicy: false, medicalDisclosure: false,
  foreignFill: false, retentionPolicy: false, phoneUse: false,
  silentAppointments: false, photoConsent: false, runningLatePreviousClient: false,
  depositTransfer: false, hennaLongevity: false, pmuColourRetention: false,
  touchUpPricing: false, modelBookings: false, studentCaseStudies: false, payment: false,
};
 
const DEFAULT_EDUCATOR_INCLUDED = {
  ...Object.fromEntries(Object.keys(DEFAULT_INCLUDED).map(k => [k, false])),
};
 
const BUSINESS_POLICIES = {
  beautyLashArtist: {
    label: "Beauty / Lash Artist",
    recommended: ["bookingFee","cancellation","noShow","lateArrival","rescheduling","refunds","sickness","childrenGuests","payment","correctionWork"],
    groups: [
      { title: "Core Appointment Policies", keys: ["bookingFee","cancellation","noShow","lateArrival","rescheduling","refunds","sickness","payment"] },
      { title: "Client Experience", keys: ["childrenGuests","parkingPolicy","foreignFill","retentionPolicy","phoneUse","silentAppointments","photoConsent","runningLatePreviousClient","depositTransfer","correctionWork"] },
      { title: "PMU & Advanced Services", keys: ["patchTesting","medicalDisclosure","healingPolicy","touchUpPolicy","hennaLongevity","pmuColourRetention","touchUpPricing"] },
    ],
  },
  pmuArtist: {
    label: "PMU Artist",
    recommended: ["bookingFee","cancellation","noShow","lateArrival","rescheduling","refunds","sickness","patchTesting","correctionWork","healingPolicy","medicalDisclosure","touchUpPolicy","pmuColourRetention","touchUpPricing","payment"],
    groups: [
      { title: "Core Appointment Policies", keys: ["bookingFee","cancellation","noShow","lateArrival","rescheduling","refunds","sickness","payment"] },
      { title: "Client Experience", keys: ["childrenGuests","parkingPolicy","phoneUse","silentAppointments","photoConsent","runningLatePreviousClient","depositTransfer","correctionWork"] },
      { title: "PMU & Advanced Services", keys: ["patchTesting","medicalDisclosure","healingPolicy","touchUpPolicy","hennaLongevity","pmuColourRetention","touchUpPricing"] },
    ],
  },
};
 
const EDUCATOR_POLICIES = {
  groups: [
    { title: "Payments & Deposits", keys: ["trainingDeposit","trainingPayment","trainingRefunds"] },
    { title: "Cancellation & Rescheduling", keys: ["trainingCancellation","trainingRescheduling"] },
    { title: "Students & Certification", keys: ["certificationPolicy","studentCaseStudies","modelBookings"] },
  ],
  recommended: ["trainingDeposit","trainingPayment","trainingRefunds","trainingCancellation","trainingRescheduling","certificationPolicy","studentCaseStudies","modelBookings"],
};
 
const POLICY_LABELS = {
  bookingFee: "Booking fee / deposit",
  cancellation: "Cancellation policy",
  noShow: "No-show policy",
  lateArrival: "Late arrival policy",
  rescheduling: "Rescheduling policy",
  refunds: "Refund policy",
  sickness: "Sickness policy",
  payment: "Payment policy",
  childrenGuests: "Children & extra guests",
  parkingPolicy: "Parking policy",
  foreignFill: "Foreign fill policy",
  retentionPolicy: "Retention policy",
  phoneUse: "Phone use during appointments",
  silentAppointments: "Silent appointments",
  photoConsent: "Photography & content consent",
  runningLatePreviousClient: "Running late due to previous client",
  depositTransfer: "Deposit transfer policy",
  correctionWork: "Concerns & correction work",
  patchTesting: "Patch testing",
  medicalDisclosure: "Medical & contraindications disclosure",
  healingPolicy: "Healing policy",
  touchUpPolicy: "Touch-up policy",
  hennaLongevity: "Henna & hybrid stain longevity",
  pmuColourRetention: "PMU colour retention",
  touchUpPricing: "Touch-up pricing",
  trainingDeposit: "Training deposit policy",
  trainingPayment: "Training payment policy",
  trainingRefunds: "Training refund policy",
  trainingCancellation: "Training cancellation policy",
  trainingRescheduling: "Training rescheduling policy",
  certificationPolicy: "Certification policy",
  modelBookings: "Model booking policy",
  studentCaseStudies: "Student case study policy",
};
 
const POLICY_NOTES = {
  bookingFee: "Protects your time, preparation cost, and appointment commitment",
  cancellation: "Protects schedule consistency and lost income from late changes",
  noShow: "Protects against lost appointment time with no warning",
  lateArrival: "Protects your workflow and other clients' appointment times",
  rescheduling: "Prevents excessive changes that disrupt your schedule",
  refunds: "Sets clear expectations around service outcomes and change of mind",
  sickness: "Protects your health, other clients, and your appointment space",
  payment: "Clarifies when and how payment is expected",
  childrenGuests: "Protects focus, safety, and insurance during appointments",
  parkingPolicy: "Reduces confusion and late arrivals caused by parking",
  foreignFill: "Protects your standards when taking on work from other artists",
  retentionPolicy: "Manages unrealistic retention expectations before they become complaints",
  phoneUse: "Protects appointment timing, focus, and service quality",
  silentAppointments: "Creates space for clients who prefer a quieter experience",
  photoConsent: "Clarifies your right to photograph completed work for your portfolio",
  runningLatePreviousClient: "Manages client expectations if you are running behind",
  depositTransfer: "Prevents deposit misuse outside of your rescheduling terms",
  correctionWork: "Protects against complaints raised weeks after the appointment",
  patchTesting: "Reduces allergy risk and protects against contraindication liability",
  medicalDisclosure: "Protects against undisclosed conditions affecting safety or results",
  healingPolicy: "Manages healed result expectations before they become disputes",
  touchUpPolicy: "Clarifies healing timelines and touch-up appointment structure",
  hennaLongevity: "Sets realistic expectations for henna and hybrid stain longevity",
  pmuColourRetention: "Manages colour retention expectations after healing",
  touchUpPricing: "Prevents pricing confusion based on timing or previous artist work",
  trainingDeposit: "Protects your preparation time and secures the student's place",
  trainingPayment: "Ensures payment before resources, kits, or access are provided",
  trainingRefunds: "Protects against refund requests after materials have been issued",
  trainingCancellation: "Protects against last-minute student cancellations",
  trainingRescheduling: "Prevents last-minute date changes that affect course preparation",
  certificationPolicy: "Clarifies assessment requirements before certification is issued",
  modelBookings: "Sets expectations around model appointment pricing and outcomes",
  studentCaseStudies: "Clarifies case study and submission requirements for completion",
};
 
// Which policies have inline settings fields
const POLICY_SETTINGS = {
  bookingFee: [{ key: "bookingFeeAmount", label: "Booking fee amount", type: "number" }],
  cancellation: [{ key: "cancellationNotice", label: "Hours' notice required", type: "number" }],
  noShow: [{ key: "noShowRule", label: "No-show rule", type: "select", options: [["bookingFeeKept","Booking fee kept"],["payBeforeRebook","Pay before rebooking"]] }],
  lateArrival: [{ key: "lateMinutes", label: "Minutes before late policy applies", type: "number" }],
  rescheduling: [{ key: "rescheduleLimit", label: "Reschedule limit", type: "number" }],
  refunds: [{ key: "refundPolicy", label: "Refund style", type: "select", options: [["serviceBased","Review case-by-case"],["finalSale","Final sale / no refunds"]] }],
  sickness: [{ key: "sicknessNotice", label: "Ideal hours' notice", type: "number" }],
  payment: [{ key: "paymentTiming", label: "Payment timing", type: "select", options: [["appointmentEnd","Due at end of appointment"],["beforeService","Due before service"]] }],
  childrenGuests: [
    { key: "childrenPolicy", label: "Children", type: "select", options: [["noChildren","No children"],["askFirst","Ask first"]] },
    { key: "extraGuestsPolicy", label: "Extra guests", type: "select", options: [["noGuests","No extra guests"],["askFirst","Ask first"]] },
  ],
  parkingPolicy: [
    { key: "parkingType", label: "Parking available", type: "select", options: [["onsite","Onsite parking"],["noOnsite","No onsite parking"]] },
    { key: "parkingGraceMinutes", label: "Late grace minutes", type: "number" },
  ],
  correctionWork: [{ key: "correctionWindow", label: "Hours to raise a concern", type: "number" }],
  touchUpPolicy: [{ key: "touchUpWindow", label: "Recommended touch-up window (weeks)", type: "number" }],
  trainingDeposit: [{ key: "trainingDepositAmount", label: "Training deposit amount", type: "number" }],
  trainingPayment: [{ key: "trainingPaymentDueDays", label: "Days before course payment is due", type: "number" }],
  trainingCancellation: [{ key: "trainingCancellationNotice", label: "Days' notice for cancellation", type: "number" }],
  trainingRescheduling: [{ key: "trainingRescheduleNotice", label: "Days' notice for rescheduling", type: "number" }],
};
 
const POLICY_WEIGHTS = {
  bookingFee: { income: 10, workflow: 5, communication: 6, professionalism: 7 },
  cancellation: { income: 10, workflow: 8, communication: 8, professionalism: 8 },
  noShow: { income: 10, workflow: 7, communication: 7, professionalism: 8 },
  lateArrival: { workflow: 10, communication: 7, professionalism: 7 },
  rescheduling: { workflow: 8, communication: 7, professionalism: 6 },
  refunds: { communication: 9, professionalism: 8, income: 5 },
  sickness: { workflow: 5, communication: 6, professionalism: 6 },
  childrenGuests: { workflow: 6, communication: 6, professionalism: 6 },
  parkingPolicy: { workflow: 5, communication: 5 },
  payment: { income: 9, professionalism: 6, communication: 6 },
  patchTesting: { pmuSafety: 8, communication: 6, professionalism: 7 },
  correctionWork: { communication: 8, professionalism: 7 },
  healingPolicy: { pmuSafety: 10, communication: 9, professionalism: 8 },
  medicalDisclosure: { pmuSafety: 10, communication: 8, professionalism: 8 },
  touchUpPolicy: { pmuSafety: 8, communication: 8, professionalism: 7 },
  pmuColourRetention: { pmuSafety: 8, communication: 8, professionalism: 7 },
  touchUpPricing: { pmuSafety: 5, communication: 7, professionalism: 6 },
  trainingDeposit: { trainingProtection: 8, income: 7, professionalism: 7 },
  trainingPayment: { trainingProtection: 10, income: 9, professionalism: 8 },
  trainingRefunds: { trainingProtection: 8, income: 7, communication: 7 },
  trainingCancellation: { trainingProtection: 8, workflow: 6, communication: 7 },
  trainingRescheduling: { trainingProtection: 7, workflow: 6, communication: 7 },
  certificationPolicy: { trainingProtection: 10, communication: 8, professionalism: 8 },
  studentCaseStudies: { trainingProtection: 7, communication: 7, professionalism: 6 },
  modelBookings: { trainingProtection: 5, communication: 6, professionalism: 5 },
  foreignFill: { communication: 6, professionalism: 6 },
  retentionPolicy: { communication: 7, professionalism: 6 },
  phoneUse: { workflow: 4, communication: 4 },
  silentAppointments: { communication: 4, professionalism: 4 },
  photoConsent: { communication: 5, professionalism: 5 },
  runningLatePreviousClient: { workflow: 4, communication: 5 },
  depositTransfer: { income: 5, communication: 6 },
  hennaLongevity: { communication: 6, professionalism: 5 },
};
 
const CATEGORY_LABELS = {
  income: "Income", workflow: "Workflow",
  communication: "Communication", professionalism: "Professionalism",
  pmuSafety: "PMU Safety", trainingProtection: "Training Protection",
};
 
const BUSINESS_CATEGORY_FOCUS = {
  beautyLashArtist: ["income","workflow","communication","professionalism"],
  pmuArtist: ["income","workflow","communication","professionalism","pmuSafety"],
  educator: ["income","workflow","communication","professionalism","trainingProtection"],
};
 
const TONE_PROFILES = {
  soft:    { label: "Soft",    desc: "Warm & approachable" },
  clear:   { label: "Clear",   desc: "Professional & balanced" },
  firm:    { label: "Firm",    desc: "Boundary focused" },
  premium: { label: "Premium", desc: "Luxury & elevated" },
};
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function money(value, currency) {
  try {
    return new Intl.NumberFormat("en-NZ", { style: "currency", currency, maximumFractionDigits: 0 })
      .format(Number.isFinite(Number(value)) ? Number(value) : 0);
  } catch { return `$${Math.round(Number(value) || 0)}`; }
}
 
function copyTextToClipboard(text) {
  const t = String(text || "");
  const fallback = () => {
    const el = document.createElement("textarea");
    el.value = t; el.style.position = "fixed"; el.style.left = "-9999px";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  };
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t).catch(fallback);
  fallback(); return Promise.resolve();
}
 
// ─── POLICY CONTENT ──────────────────────────────────────────────────────────
 
function createToneContent(settings, currency) {
  const amt = money(settings.bookingFeeAmount, currency);
  return {
    soft:    { intro: `Hey lovely. Before booking with ${settings.businessName}, please take a moment to read through the policies below.`, booking: `A ${amt} booking fee helps secure your appointment time and preparation.`, cancellation: `If you need to make changes, please try to give at least ${settings.cancellationNotice} hours' notice where possible.`, refund: "If you have any concerns after your appointment, please reach out kindly so we can review things together." },
    clear:   { intro: `Please read the policies below before booking with ${settings.businessName}. These help keep appointments clear, fair, and respectful of everyone's time.`, booking: `A booking fee of ${amt} is required to secure your appointment. Bookings are not confirmed until payment has been received.`, cancellation: `Cancellations with less than ${settings.cancellationNotice} hours' notice may result in the booking fee being retained.`, refund: "Refunds are not offered for change of mind. Service concerns must be raised within the required timeframe." },
    firm:    { intro: `By booking with ${settings.businessName}, you agree to the policies below. These policies protect appointment time, business costs, and professional standards.`, booking: "Appointments without a paid booking fee will not be held or confirmed.", cancellation: "Late cancellations and no-shows may result in loss of booking fees and restricted future bookings.", refund: "All services are final. Concerns raised outside the required timeframe may be treated as a new appointment." },
    premium: { intro: `At ${settings.businessName}, each appointment is reserved intentionally to allow time, preparation, and a high standard of service.`, booking: `A reservation fee of ${amt} is required to reserve your appointment time.`, cancellation: `Changes made within ${settings.cancellationNotice} hours may result in the reservation fee being retained.`, refund: "Due to the customised nature of services, refunds are not offered for change of mind. Any concerns should be raised promptly so they can be professionally reviewed." },
  }[settings.tone] || {};
}
 
function createPolicySections(settings, included, currency) {
  const sections = [];
  const tc = createToneContent(settings, currency);
  const tone = settings.tone;
  const amt = money(settings.bookingFeeAmount, currency);
  const reschedTimes = `${settings.rescheduleLimit} time${Number(settings.rescheduleLimit) === 1 ? "" : "s"}`;
 
  if (included.bookingFee) {
    sections.push({ title: "Booking Fee",
      text: `${tc.booking} This amount is applied toward your appointment unless stated otherwise in the cancellation or no-show policy.`,
      short: { soft: `A ${amt} booking fee helps secure your appointment time.`, clear: `A ${amt} booking fee is required to confirm your appointment.`, firm: `A ${amt} booking fee must be paid before your appointment is confirmed.`, premium: `A ${amt} reservation fee is required to reserve your appointment time.` }[tone] });
  }
  if (included.cancellation) {
    sections.push({ title: "Cancellations",
      text: `${tc.cancellation} A new booking fee may be required before rebooking.`,
      short: { soft: `Please give at least ${settings.cancellationNotice} hours' notice if you need to cancel or make changes.`, clear: `${settings.cancellationNotice} hours' notice is required for cancellations or changes.`, firm: `Cancellations require ${settings.cancellationNotice} hours' notice. Late cancellations may result in loss of the booking fee.`, premium: `Changes or cancellations within ${settings.cancellationNotice} hours may result in the reservation fee being retained.` }[tone] });
  }
  if (included.noShow) {
    const base = settings.noShowRule === "bookingFeeKept" ? "your booking fee will be kept and a new fee will be required to rebook." : "you may be required to pay for the missed appointment before rebooking.";
    const text = settings.noShowRule === "bookingFeeKept" ? "If you do not show up to your appointment, your booking fee will be kept. A new booking fee will be required to book again." : "If you do not show up to your appointment, you may be required to pay for the missed appointment before booking again.";
    sections.push({ title: "No-Shows", text, short: { soft: `If you are unable to make your appointment, please let us know. If you do not show up, ${base}`, clear: `If you do not attend your appointment, ${base}`, firm: `No-shows will result in ${base} Future bookings may be restricted.`, premium: `Missed appointments without notice will result in ${base}` }[tone] });
  }
  if (included.lateArrival) {
    sections.push({ title: "Late Arrivals",
      text: `Please arrive on time for your appointment. If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be shortened, rescheduled, or cancelled. The full appointment cost may still apply if the service cannot be completed due to lateness.`,
      short: { soft: `If you are running late, please let us know. Arrivals more than ${settings.lateMinutes} minutes late may need to be rescheduled.`, clear: `If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be shortened or rescheduled.`, firm: `Arrivals more than ${settings.lateMinutes} minutes late may result in a shortened, rescheduled, or cancelled appointment. The full fee may still apply.`, premium: `Late arrivals beyond ${settings.lateMinutes} minutes may affect the reserved appointment time and service availability.` }[tone] });
  }
  if (included.rescheduling) {
    sections.push({ title: "Rescheduling",
      text: `Appointments may be rescheduled up to ${reschedTimes}, provided enough notice is given. Further changes may require a new booking fee.`,
      short: { soft: `Appointments can be rescheduled up to ${reschedTimes} with enough notice — just get in touch as soon as you can.`, clear: `Appointments may be rescheduled up to ${reschedTimes} with enough notice.`, firm: `Appointments may only be rescheduled up to ${reschedTimes}. Further changes may require a new booking fee.`, premium: `Appointments may be rescheduled up to ${reschedTimes} with appropriate notice. Additional changes may require a new reservation fee.` }[tone] });
  }
  if (included.refunds) {
    const text = settings.refundPolicy === "serviceBased" ? tc.refund : { premium: "Due to the customised nature of services and appointment preparation, all sales are considered final.", firm: "All sales and services are final." }[tone] || "All sales are final unless otherwise stated by the business.";
    const short = { soft: settings.refundPolicy === "serviceBased" ? "If you have any concerns, please reach out and we will review them together." : "All sales are final. Please get in touch if you have any concerns.", clear: settings.refundPolicy === "serviceBased" ? "Refunds are not offered for change of mind. Concerns must be raised within the required timeframe." : "All sales are final.", firm: settings.refundPolicy === "serviceBased" ? "Refunds are not offered. Concerns raised outside the required timeframe may be treated as a new appointment." : "All sales and services are final. No refunds will be issued.", premium: settings.refundPolicy === "serviceBased" ? "Due to the customised nature of services, refunds are not offered for change of mind." : "Due to the customised nature of services, all sales are considered final." }[tone];
    sections.push({ title: "Refunds", text, short });
  }
  if (included.sickness) {
    sections.push({ title: "Sickness",
      text: `If you are unwell, please reschedule your appointment with as much notice as possible, ideally at least ${settings.sicknessNotice} hours before your appointment. This helps protect the health of the business, other clients, and everyone in the space.`,
      short: { soft: "If you are feeling unwell, please reach out to reschedule. We appreciate as much notice as possible.", clear: "If you are unwell, please reschedule before attending your appointment.", firm: "Do not attend your appointment if you are unwell. Please reschedule with as much notice as possible.", premium: "If you are unwell, please reschedule your appointment prior to attending." }[tone] });
  }
  if (included.childrenGuests) {
    const children = settings.childrenPolicy === "noChildren" ? "Children are not able to attend appointments unless agreed prior. This is for safety, focus, and insurance reasons." : "Please check before bringing children to your appointment, as not all services or appointment spaces are suitable.";
    const guests = settings.extraGuestsPolicy === "noGuests" ? "Please attend your appointment alone unless otherwise arranged." : "Extra guests may be allowed by prior arrangement only.";
    sections.push({ title: "Children & Extra Guests", text: `${children} ${guests}`, short: `${children} ${guests}` });
  }
  if (included.patchTesting && settings.patchTestRequired) {
    sections.push({ title: "Patch Testing",
      text: "Patch testing may be required for selected services or products. If a patch test is required and has not been completed within the correct timeframe, your appointment may need to be rescheduled.",
      short: { soft: "Patch testing may be needed for some services — please check before booking if you are unsure.", clear: "Patch testing may be required for selected services.", firm: "Patch testing is required for applicable services. Failure to complete a patch test may result in your appointment being rescheduled.", premium: "Patch testing may be required prior to selected services. Please confirm at the time of booking." }[tone] });
  }
  if (included.correctionWork) {
    sections.push({ title: "Concerns & Correction Work",
      text: `If you have a concern with your service, please contact the business within ${settings.correctionWindow} hours so it can be assessed. Concerns raised outside this timeframe may be treated as a new appointment or maintenance service.`,
      short: { soft: `If you have any concerns after your appointment, please reach out within ${settings.correctionWindow} hours so we can look into it together.`, clear: `Please raise any service concerns within ${settings.correctionWindow} hours of your appointment.`, firm: `Concerns must be raised within ${settings.correctionWindow} hours. Issues raised after this time may be treated as a new appointment.`, premium: `Any concerns regarding your service should be raised within ${settings.correctionWindow} hours so they can be professionally reviewed.` }[tone] });
  }
  if (included.parkingPolicy) {
    const parking = settings.parkingType === "onsite" ? "Onsite parking is available for clients. Please allow enough time to park before your appointment, as late arrival due to parking may still fall under the late arrival policy." : "Please note there is no onsite parking available. Clients are responsible for allowing enough time to find parking before their appointment. Late arrival due to parking may still fall under the late arrival policy.";
    sections.push({ title: "Parking",
      text: `${parking} If you are more than ${settings.parkingGraceMinutes} minutes late, your appointment may need to be shortened, rescheduled, or cancelled.`,
      short: { soft: `${parking} Please allow extra time for parking so we can get started on time.`, clear: parking, firm: `${parking} Late arrival due to parking is still subject to the late arrival policy.`, premium: `${parking} Clients are responsible for allowing sufficient time to park prior to their appointment.` }[tone] });
  }
 
  const micro = [
    ["foreignFill","Foreign Fills","Foreign fills are assessed on a case-by-case basis. Existing work completed by another artist may need to be removed before a new set or refill can be completed if the current work does not meet the business standards required for safe application or maintenance.","Foreign fills are assessed case-by-case and may require removal before booking."],
    ["retentionPolicy","Retention Results","Retention varies between individuals based on lifestyle, aftercare, skin type, natural lash cycle, products used at home, medications, and ongoing maintenance. Individual retention results cannot be guaranteed.","Retention varies between individuals and cannot be guaranteed."],
    ["phoneUse","Phone Use During Appointments","To help maintain timing, focus, and service quality, phone calls may need to be limited during appointments unless urgent.","Phone calls may need to be limited during appointments unless urgent."],
    ["silentAppointments","Silent Appointments","Silent appointments may be available for clients who prefer a quieter appointment experience. Please advise when booking if this is something you would prefer.","Silent appointments may be available upon request."],
    ["photoConsent","Photography & Content Consent","Photos or videos of completed work may occasionally be taken for portfolio, education, marketing, or social media purposes unless otherwise requested by the client prior to the service.","Photos of completed work may be taken unless otherwise requested."],
    ["runningLatePreviousClient","Running Late Due To Previous Appointments","Occasionally appointments may run behind due to service adjustments, client needs, or unforeseen circumstances. If delays occur, the business will communicate this as soon as possible.","Occasionally appointments may run behind due to previous services."],
    ["depositTransfer","Deposit Transfers","Booking fees or deposits are generally non-transferable outside the allowed rescheduling timeframe unless otherwise approved by the business.","Deposits are generally non-transferable outside approved rescheduling timeframes."],
    ["hennaLongevity","Henna & Hybrid Stain Longevity","Skin stain longevity varies between individuals based on skin type, skincare products, lifestyle, aftercare, oil production, and daily activities. Stain longevity cannot be guaranteed.","Henna and hybrid stain longevity varies between individuals."],
    ["pmuColourRetention","PMU Colour Retention","PMU colour retention varies between individuals based on skin type, undertones, lifestyle, aftercare, medications, sun exposure, healing response, and long-term skin changes. Colour retention cannot be guaranteed.","PMU colour retention varies between individuals and cannot be guaranteed."],
    ["touchUpPricing","Touch-Up Pricing","Touch-up pricing may vary depending on the timeframe since the previous appointment, the amount of work required, retention, and whether the previous work was completed by another artist.","Touch-up pricing may vary depending on timing and work required."],
    ["modelBookings","Model Appointments","Model appointments may be discounted training, portfolio, timing, or educational appointments and may take longer than standard bookings. Specific styling, timing, or outcomes may be limited during model appointments.","Model appointments may differ from standard appointments and may take longer."],
    ["studentCaseStudies","Student Case Studies","Students may be required to complete case studies, submit photos, complete assessments, or provide additional work before certification or course completion requirements are met.","Case studies and assessments may be required before certification is issued."],
  ];
  micro.forEach(([key,title,text,short]) => { if (included[key]) sections.push({ title, text, short }); });
 
  if (included.medicalDisclosure) sections.push({ title: "Medical & Contraindications Disclosure", text: "Clients are responsible for disclosing any medical conditions, medications, allergies, skin sensitivities, recent cosmetic procedures, pregnancy, breastfeeding, or contraindications that may affect the safety, suitability, healing, or outcome of the service. Failure to disclose relevant information may affect results and may prevent the service from being performed.", short: "Please disclose medical conditions, medications, allergies, or contraindications before your appointment." });
  if (included.healingPolicy) sections.push({ title: "Healing Results", text: "Healed results vary between individuals based on skin type, lifestyle, aftercare, healing response, retention, and how the area is cared for during healing. Final healed results cannot be guaranteed. Following aftercare instructions is essential to support the best possible healed outcome.", short: "Healed results vary between individuals and cannot be guaranteed." });
  if (included.touchUpPolicy) sections.push({ title: "Touch-Up Appointments", text: `Touch-up appointments may be required once healing has taken place. Recommended touch-ups should be booked within ${settings.touchUpWindow} weeks unless otherwise advised. Touch-ups booked outside the recommended timeframe may be treated as a new appointment or priced differently.`, short: `Touch-ups should be booked within ${settings.touchUpWindow} weeks unless otherwise advised.` });
  if (included.trainingDeposit) sections.push({ title: "Training Deposits", text: `A non-refundable training deposit of ${money(settings.trainingDepositAmount, currency)} is required to secure your place. Your training place is not confirmed until this has been paid. Preparation, resources, scheduling, and student support begin once your place is booked.`, short: `A non-refundable ${money(settings.trainingDepositAmount, currency)} training deposit is required to secure your place.` });
  if (included.trainingPayment) sections.push({ title: "Training Payments", text: `Training must be paid in full at least ${settings.trainingPaymentDueDays} days before the course date unless otherwise agreed. Full payment must be completed before onboarding, training manuals, course resources, student support access, login details, kits, or training materials are provided.`, short: "Training must be paid in full before onboarding, resources, or training materials are provided." });
  if (included.trainingRefunds) sections.push({ title: "Training Refunds", text: "Due to the preparation, resources, scheduling, digital access, kits, manuals, and educator time involved, training payments are non-refundable. If you are unable to attend, please make contact as soon as possible to discuss available options.", short: "Training payments are non-refundable due to preparation and resources involved." });
  if (included.trainingCancellation) sections.push({ title: "Training Cancellations", text: `Training cancellations require at least ${settings.trainingCancellationNotice} days' notice. Cancellations made within this timeframe may result in loss of deposits, payments made, access to resources, or eligibility to transfer to another training date.`, short: `Training cancellations require at least ${settings.trainingCancellationNotice} days' notice.` });
  if (included.trainingRescheduling) sections.push({ title: "Training Rescheduling", text: `Training dates may only be rescheduled with at least ${settings.trainingRescheduleNotice} days' notice. Last-minute changes may result in loss of the deposit or require a new booking fee before transferring to another date. Training places are limited and dates are prepared in advance.`, short: `Training rescheduling requires at least ${settings.trainingRescheduleNotice} days' notice.` });
  if (included.certificationPolicy) sections.push({ title: "Certification", text: "Certificates are issued upon successful completion of the training requirements set by the educator. Certification confirms course completion only and does not replace licensing, qualification requirements, insurance requirements, local regulations, or ongoing competency expectations where applicable.", short: "Certification confirms course completion only and is issued once training requirements are successfully completed." });
  if (included.payment) { const text = settings.paymentTiming === "appointmentEnd" ? "Payment is due at the end of your appointment before leaving." : "Payment is required before or at the time of service as agreed when booking."; sections.push({ title: "Payment", text, short: text }); }
 
  return sections;
}
 
function formatFullPolicy(intro, sections, businessName, businessType) {
  const showIntro = businessType !== "educator";
  return [businessName, "Policies & Client Information", "────────────────────────────", ...(showIntro ? [intro] : []), ...sections.map(s => `${s.title}\n${s.text}`), "────────────────────────────", "Thank you for respecting the time, preparation, and care that goes into every appointment."].join("\n\n");
}
 
function calculateHealth(settings, included, isEducator) {
  const businessType = isEducator ? "educator" : settings.businessType || "beautyLashArtist";
  const selectedPolicies = Object.entries(included).filter(([,v]) => v).map(([k]) => k);
  const focus = BUSINESS_CATEGORY_FOCUS[businessType] || BUSINESS_CATEGORY_FOCUS.beautyLashArtist;
  const categoryScores = focus.map(cat => {
    const possible = Object.values(POLICY_WEIGHTS).reduce((t, w) => t + (w[cat] || 0), 0);
    const selected = selectedPolicies.reduce((t, p) => t + (POLICY_WEIGHTS[p]?.[cat] || 0), 0);
    return { key: cat, label: CATEGORY_LABELS[cat], score: possible ? Math.round((selected / possible) * 100) : 0 };
  });
  const score = Math.round(categoryScores.reduce((t, c) => t + c.score, 0) / categoryScores.length);
  return { score, categoryScores };
}
 
// ─── COMPONENTS ──────────────────────────────────────────────────────────────
 
function PolicyCheck({ policyKey, included, settings, updateIncluded, updateSetting, currency }) {
  const checked = !!included[policyKey];
  const fields = POLICY_SETTINGS[policyKey] || [];
  return (
    <div className={`policyItem ${checked ? "policyItem--on" : ""}`}>
      <label className="policyCheck">
        <input type="checkbox" checked={checked} onChange={e => updateIncluded(policyKey, e.target.checked)} />
        <span className="policyCheckBox" />
        <div className="policyLabelGroup">
          <span className="policyLabel">{POLICY_LABELS[policyKey]}</span>
          {POLICY_NOTES[policyKey] && <span className="policyNote">{POLICY_NOTES[policyKey]}</span>}
        </div>
      </label>
      {checked && fields.length > 0 && (
        <div className="policyInlineFields">
          {fields.map(f => f.type === "select" ? (
            <label key={f.key} className="inlineField">
              <span>{f.label}</span>
              <select value={settings[f.key]} onChange={e => updateSetting(f.key, e.target.value)}>
                {f.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </select>
            </label>
          ) : (
            <label key={f.key} className="inlineField">
              <span>{f.label}</span>
              <input type="number" value={settings[f.key]} onChange={e => updateSetting(f.key, Number(e.target.value) || 0)} />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
 
function HealthIndicator({ score }) {
  const color = score >= 80 ? "#7ee7d8" : score >= 50 ? "#f5c842" : "#ff7c7c";
  return (
    <div className="healthIndicator">
      <div className="healthIndicatorBar">
        <div className="healthIndicatorFill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="healthIndicatorScore" style={{ color }}>{score}%</span>
      <span className="healthIndicatorLabel">health</span>
    </div>
  );
}
 
function FormattedOutput({ text, format }) {
  if (format === "message") {
    return <div className="messagePreview"><p>{text}</p></div>;
  }
  return (
    <div className={`formattedOutput ${format === "instagram" ? "instagramStyle" : ""}`}>
      {text.split("\n\n").map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const first = lines[0] || "";
        const rest = lines.slice(1).join("\n");
        const isDivider = first.includes("────");
        const isTitle = first === first.toUpperCase() && first.length < 60 && !isDivider;
        if (isDivider) return <div key={i} className="outputDivider" />;
        return (
          <div key={i} className={isTitle ? "outputBlock titleBlock" : "outputBlock"}>
            {isTitle ? <h3>{first}</h3> : <strong>{first}</strong>}
            {rest ? <p>{rest}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
 
// ─── MAIN ────────────────────────────────────────────────────────────────────
 
export default function BeautyBusinessPolicyBuilder() {
  const [currency, setCurrency] = useState("NZD");
  const [isEducator, setIsEducator] = useState(false);
  const [businessType, setBusinessType] = useState("beautyLashArtist");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [included, setIncluded] = useState(DEFAULT_INCLUDED);
  const [outputFormat, setOutputFormat] = useState("full");
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [presetName, setPresetName] = useState("My Policy Setup");
  const [savedPresets, setSavedPresets] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [mobileTab, setMobileTab] = useState("build");
 
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hausOfMPolicyPresets_v2");
      if (stored) setSavedPresets(JSON.parse(stored));
    } catch { setSavedPresets([]); }
  }, []);
 
  const updateSetting = (key, value) => setSettings(p => ({ ...p, [key]: value }));
  const updateIncluded = (key, value) => setIncluded(p => ({ ...p, [key]: value }));
 
  const switchMode = (edu) => {
    setIsEducator(edu);
    setIncluded(edu ? DEFAULT_EDUCATOR_INCLUDED : DEFAULT_INCLUDED);
    if (!edu) setBusinessType("beautyLashArtist");
  };
 
  const applyRecommended = () => {
    const keys = isEducator ? EDUCATOR_POLICIES.recommended : (BUSINESS_POLICIES[businessType]?.recommended || []);
    setIncluded(prev => { const u = { ...prev }; keys.forEach(k => { u[k] = true; }); return u; });
  };
 
  const savePresetsToStorage = (presets) => {
    setSavedPresets(presets);
    try { localStorage.setItem("hausOfMPolicyPresets_v2", JSON.stringify(presets)); } catch {}
  };
  const savePreset = () => {
    const name = presetName.trim() || "My Setup";
    const preset = { id: Date.now().toString(), name, settings, included, isEducator, businessType, createdAt: new Date().toLocaleDateString("en-NZ") };
    savePresetsToStorage([preset, ...savedPresets]);
    setCopyStatus("Preset saved");
  };
  const loadPreset = p => { setSettings({ ...DEFAULT_SETTINGS, ...p.settings }); setIncluded({ ...DEFAULT_INCLUDED, ...p.included }); if (p.isEducator !== undefined) setIsEducator(p.isEducator); if (p.businessType) setBusinessType(p.businessType); };
  const deletePreset = id => savePresetsToStorage(savedPresets.filter(p => p.id !== id));
 
  const settingsWithType = useMemo(() => ({ ...settings, businessType: isEducator ? "educator" : businessType }), [settings, isEducator, businessType]);
  const toneContent = useMemo(() => createToneContent(settingsWithType, currency), [settingsWithType, currency]);
  const policySections = useMemo(() => createPolicySections(settingsWithType, included, currency), [settingsWithType, included, currency]);
  const fullPolicy = useMemo(() => formatFullPolicy(toneContent.intro, policySections, settings.businessName, isEducator ? "educator" : businessType), [toneContent.intro, policySections, settings.businessName, isEducator, businessType]);
  const instagramPolicy = useMemo(() => policySections.map(s => `${s.title}\n${s.short}`).join("\n\n"), [policySections]);
  const confirmationMessage = useMemo(() => {
    const tone = settings.tone;
    const start = { soft: `Hi lovely, your appointment with ${settings.businessName} is officially booked.`, clear: `Your appointment with ${settings.businessName} is confirmed.`, firm: `Your appointment with ${settings.businessName} is confirmed. Please read the booking terms below.`, premium: `Your appointment with ${settings.businessName} has been reserved.` }[tone];
    const msgs = [];
    if (included.bookingFee) msgs.push(tone === "premium" ? `Your ${money(settings.bookingFeeAmount, currency)} reservation fee has been received.` : `Your ${money(settings.bookingFeeAmount, currency)} booking fee has been received.`);
    if (included.cancellation) msgs.push(tone === "soft" ? `Please give at least ${settings.cancellationNotice} hours' notice if you need to make any changes.` : `A ${settings.cancellationNotice}-hour cancellation policy applies for changes or cancellations.`);
    if (included.lateArrival) msgs.push(tone === "premium" ? `Arriving late may affect the reserved appointment time.` : `If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be shortened or rescheduled.`);
    if (included.noShow) msgs.push(tone === "firm" ? `Missed appointments may require payment before another booking is accepted.` : `Missed appointments may require payment before rebooking.`);
    if (included.sickness) msgs.push(tone === "soft" ? `If you are unwell, please get in touch to reschedule before attending.` : `If you are unwell, please reschedule before attending your appointment.`);
    const closing = { soft: `Thank you, and I look forward to seeing you soon.`, clear: `Thank you for respecting the time and preparation that goes into your appointment.`, firm: `Thank you for respecting the booking policy and appointment time.`, premium: `Thank you for respecting the time, preparation, and care reserved for your appointment.` }[tone];
    return `${start}\n${msgs.join("\n")}\n${closing}`;
  }, [settings, included, currency]);
 
  const { score, categoryScores } = useMemo(() => calculateHealth(settingsWithType, included, isEducator), [settingsWithType, included, isEducator]);
  const selectedCount = Object.values(included).filter(Boolean).length;
  const activeGroups = isEducator ? EDUCATOR_POLICIES.groups : (BUSINESS_POLICIES[businessType]?.groups || []);
 
  const outputText = outputFormat === "full" ? fullPolicy : outputFormat === "instagram" ? instagramPolicy : confirmationMessage;
 
  const handleCopy = async () => {
    setCopyStatus("");
    try { await copyTextToClipboard(outputText); setCopyStatus("Copied!"); setTimeout(() => setCopyStatus(""), 2000); }
    catch { setCopyStatus("Please select and copy manually."); }
  };
 
  return (
    <div className="app">
      <style>{css}</style>
      <div className="monogram">M</div>
 
      {/* TOP BAR */}
      <header className="topBar">
        <div className="topBarRow topBarRow--identity">
          <div className="topBarLogo">
            <span className="logoHaus">HAUS</span><span className="logoOf">OF</span><span className="logoM">M</span>
          </div>
          <div className="topBarIdentity">
            <div className="modeToggle">
              <button className={!isEducator ? "active" : ""} onClick={() => switchMode(false)}>Artist</button>
              <button className={isEducator ? "active" : ""} onClick={() => switchMode(true)}>Educator</button>
            </div>
            {!isEducator && (
              <select className="topBarSelect" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                {Object.entries(BUSINESS_POLICIES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="topBarRow topBarRow--name">
          <input className="topBarInput" value={settings.businessName} onChange={e => updateSetting("businessName", e.target.value)} placeholder="Business name" />
          <select className="topBarSelect topBarCurrency" value={currency} onChange={e => setCurrency(e.target.value)}>
            {["NZD","AUD","USD","GBP"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="topBarRow topBarRow--tone">
          <div className="toneGroupLabelWrap">
            <span className="toneGroupLabel">Business Tone</span>
            <span className="toneGroupHint">Controls the language style of all generated policy output</span>
          </div>
          <div className="toneToggle">
            {Object.entries(TONE_PROFILES).map(([k,v]) => (
              <button key={k} className={settings.tone === k ? "active" : ""} onClick={() => updateSetting("tone", k)} title={v.desc}>{v.label}</button>
            ))}
          </div>
        </div>
      </header>
 
      {/* MAIN SPLIT */}
      <div className={`mainSplit ${mobileTab === "output" ? "mainSplit--output" : ""}`}>
 
        {/* LEFT: BUILDER */}
        <aside className="builderPanel">
          <div className="builderHeader">
            <span className="builderCount">{selectedCount} policies selected</span>
            <div className="applyBtnWrap">
              <button className="applyBtn" onClick={applyRecommended}>Apply recommended</button>
              <span className="applyBtnHint">
                {(isEducator ? EDUCATOR_POLICIES.recommended : (BUSINESS_POLICIES[businessType]?.recommended || [])).map(k => POLICY_LABELS[k]).join(" · ")}
              </span>
            </div>
          </div>
 
          <div className="policyGroups">
            {activeGroups.map(group => (
              <div key={group.title} className="policyGroup">
                <h3>{group.title}</h3>
                {group.keys.map(key => (
                  <PolicyCheck key={key} policyKey={key} included={included} settings={settings} updateIncluded={updateIncluded} updateSetting={updateSetting} currency={currency} />
                ))}
              </div>
            ))}
          </div>
 
          {/* POLICY SETS */}
          <div className="presetsSection">
            <button className="presetsToggle" onClick={() => setPresetsOpen(o => !o)}>
              <span>Policy sets {savedPresets.length > 0 ? <span className="presetCount">{savedPresets.length}</span> : null}</span>
              <span>{presetsOpen ? "▲" : "▼"}</span>
            </button>
            {presetsOpen && (
              <div className="presetsBody">
                <p className="presetIntro">Save your current policy selection as a named set — useful for different seasons, service types, or booking periods.</p>
                <div className="presetSave">
                  <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="e.g. Busy season, PMU only, General..." />
                  <button onClick={savePreset}>Save current</button>
                </div>
                {savedPresets.length === 0 && <p className="presetEmpty">No saved policy sets yet. Build a selection above and save it here.</p>}
                {savedPresets.map(p => (
                  <div key={p.id} className="presetItem">
                    <div className="presetItemInfo">
                      <strong>{p.name}</strong>
                      <span>{Object.values(p.included || {}).filter(Boolean).length} policies · {p.isEducator ? "Educator" : (BUSINESS_POLICIES[p.businessType]?.label || "Artist")} · {p.createdAt}</span>
                    </div>
                    <div className="presetActions">
                      <button onClick={() => loadPreset(p)}>Load</button>
                      <button className="presetDelete" onClick={() => deletePreset(p.id)}>✕</button>
                    </div>
                  </div>
                ))}
                <small className="presetNote">Saved to this browser only. Clearing browser data will remove saved sets.</small>
              </div>
            )}
          </div>
        </aside>
 
        {/* RIGHT: OUTPUT */}
        <section className="outputPanel">
          <div className="outputHeader">
            <div className="outputFormatToggle">
              {[["full","Full Policy"],["instagram","Instagram"],["message","Client Message"]].map(([k,l]) => (
                <button key={k} className={outputFormat === k ? "active" : ""} onClick={() => setOutputFormat(k)}>{l}</button>
              ))}
            </div>
            <div className="outputHeaderRight">
              <HealthIndicator score={score} />
              <button className="copyBtn" onClick={handleCopy}>{copyStatus || "Copy"}</button>
            </div>
          </div>
 
          {/* Health category bars */}
          <div className="healthBars">
            {categoryScores.map(c => (
              <div key={c.key} className="healthBar">
                <span>{c.label}</span>
                <div className="healthBarTrack"><div className="healthBarFill" style={{ width: `${c.score}%` }} /></div>
                <span className="healthBarScore">{c.score}%</span>
              </div>
            ))}
          </div>
 
          <div className="outputContent">
            <FormattedOutput text={outputText} format={outputFormat} />
          </div>
 
          <p className="outputDisclaimer">This is a business education tool and does not replace personalised legal advice.</p>
        </section>
      </div>
 
      {/* MOBILE BOTTOM NAV */}
      <nav className="mobileNav">
        <button className={mobileTab === "build" ? "active" : ""} onClick={() => setMobileTab("build")}>
          <span className="mobileNavIcon">☰</span>
          <span>Build</span>
        </button>
        <button className={mobileTab === "output" ? "active" : ""} onClick={() => setMobileTab("output")}>
          <span className="mobileNavIcon">◎</span>
          <span>Output{selectedCount > 0 ? ` (${selectedCount})` : ""}</span>
        </button>
      </nav>
 
      <footer className="footer">
        <strong>Haus of M</strong> © 2026. Licensed for personal business use only. Not for resale, redistribution, or teaching as your own.
      </footer>
    </div>
  );
}
 
// ─── CSS ─────────────────────────────────────────────────────────────────────
 
const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { min-height: 100%; background: #080808; }
body { overflow-x: hidden; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #f0f0f0; }
 
.app { min-height: 100vh; display: flex; flex-direction: column; position: relative; }
.monogram { position: fixed; top: 50%; right: -2vw; transform: translateY(-50%); font-family: Georgia, serif; font-size: clamp(160px, 22vw, 360px); line-height: 1; color: rgba(255,255,255,.022); font-weight: 700; pointer-events: none; user-select: none; z-index: 0; }
 
/* TOP BAR */
.topBar { display: flex; flex-direction: column; gap: 8px; padding: 10px 18px; border-bottom: 1px solid rgba(255,255,255,.08); background: rgba(0,0,0,.5); backdrop-filter: blur(18px); position: sticky; top: 0; z-index: 10; }
.topBarRow { display: flex; align-items: center; gap: 8px; }
.topBarRow--identity { justify-content: space-between; }
.topBarRow--name { gap: 8px; }
.topBarRow--tone { gap: 10px; align-items: center; }
.topBarIdentity { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.topBarLogo { font-family: Georgia, serif; letter-spacing: .18em; font-size: 13px; white-space: nowrap; flex-shrink: 0; }
.logoHaus { opacity: .7; } .logoOf { opacity: .4; font-size: 9px; margin: 0 3px; } .logoM { font-size: 16px; }
.topBarInput { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 7px 10px; color: #fff; font-size: 13px; flex: 1; outline: none; min-width: 0; }
.topBarInput:focus { border-color: rgba(255,255,255,.3); }
.topBarSelect { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 7px 10px; color: #fff; font-size: 12px; outline: none; cursor: pointer; flex-shrink: 0; }
.topBarCurrency { min-width: 72px; }
.topBarSelect option { color: #111; }
 
.toneGroup { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
.toneGroupLabelWrap { display: flex; flex-direction: column; gap: 2px; }
.toneGroupLabel { font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: rgba(255,255,255,.38); white-space: nowrap; }
.toneGroupHint { font-size: 9px; color: rgba(255,255,255,.22); max-width: 130px; line-height: 1.4; }
.modeToggle, .toneToggle { display: flex; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.modeToggle button, .toneToggle button { background: transparent; border: none; color: rgba(255,255,255,.5); padding: 7px 11px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; border-right: 1px solid rgba(255,255,255,.08); white-space: nowrap; }
.modeToggle button:last-child, .toneToggle button:last-child { border-right: none; }
.modeToggle button.active, .toneToggle button.active { background: rgba(255,255,255,.1); color: #fff; }
 
/* MAIN SPLIT */
.mainSplit { display: grid; grid-template-columns: 380px 1fr; flex: 1; min-height: 0; position: relative; z-index: 1; }
 
/* BUILDER PANEL */
.builderPanel { border-right: 1px solid rgba(255,255,255,.07); overflow-y: auto; display: flex; flex-direction: column; max-height: calc(100vh - 57px); position: sticky; top: 57px; }
.builderHeader { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; border-bottom: 1px solid rgba(255,255,255,.06); flex-shrink: 0; }
.builderCount { font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: rgba(255,255,255,.5); }
.applyBtn { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 999px; color: rgba(255,255,255,.8); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; padding: 6px 12px; cursor: pointer; }
.applyBtn:hover { background: rgba(255,255,255,.12); }
.applyBtnWrap { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.applyBtnHint { font-size: 9.5px; color: rgba(255,255,255,.28); line-height: 1.5; text-align: right; max-width: 200px; }
 
.policyGroups { padding: 12px 14px; display: grid; gap: 20px; flex: 1; }
.policyGroup h3 { font-size: 10px; text-transform: uppercase; letter-spacing: .18em; color: rgba(255,255,255,.38); margin-bottom: 8px; font-weight: 600; }
 
.policyItem { border: 1px solid rgba(255,255,255,.06); border-radius: 10px; background: rgba(255,255,255,.02); margin-bottom: 6px; overflow: hidden; transition: border-color .15s; }
.policyItem--on { border-color: rgba(255,255,255,.18); background: rgba(255,255,255,.04); }
.policyCheck { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; }
.policyCheckBox { width: 16px; height: 16px; border: 1px solid rgba(255,255,255,.3); border-radius: 4px; flex-shrink: 0; display: grid; place-content: center; transition: border-color .15s, background .15s; }
.policyItem--on .policyCheckBox { background: rgba(255,255,255,.9); border-color: #fff; }
.policyItem--on .policyCheckBox::after { content: ""; display: block; width: 8px; height: 8px; background: #111; border-radius: 2px; }
.policyCheck input { display: none; }
.policyLabelGroup { display: flex; flex-direction: column; gap: 2px; }
.policyLabel { font-size: 12.5px; color: rgba(255,255,255,.72); line-height: 1.4; }
.policyNote { font-size: 11px; color: rgba(255,255,255,.32); line-height: 1.4; }
.policyItem--on .policyNote { color: rgba(255,255,255,.48); }
.policyItem--on .policyLabel { color: #fff; }
 
.policyInlineFields { padding: 0 12px 12px 38px; display: grid; gap: 8px; }
.inlineField { display: grid; gap: 4px; }
.inlineField span { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.42); }
.inlineField input, .inlineField select { background: rgba(0,0,0,.4); border: 1px solid rgba(255,255,255,.12); border-radius: 7px; padding: 7px 10px; color: #fff; font-size: 12px; outline: none; width: 100%; }
.inlineField select option { color: #111; }
.inlineField input:focus, .inlineField select:focus { border-color: rgba(255,255,255,.3); }
 
/* PRESETS */
.presetsSection { border-top: 1px solid rgba(255,255,255,.06); flex-shrink: 0; }
.presetsToggle { width: 100%; background: none; border: none; color: rgba(255,255,255,.4); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; padding: 12px 16px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; }
.presetsToggle:hover { color: rgba(255,255,255,.7); }
.presetCount { display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,.1); border-radius: 999px; width: 18px; height: 18px; font-size: 10px; margin-left: 6px; color: rgba(255,255,255,.7); }
.presetsBody { padding: 0 14px 16px; display: grid; gap: 10px; }
.presetIntro { font-size: 11px; color: rgba(255,255,255,.32); line-height: 1.55; }
.presetSave { display: flex; gap: 8px; }
.presetSave input { flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 10px; color: #fff; font-size: 12px; outline: none; min-width: 0; }
.presetSave input:focus { border-color: rgba(255,255,255,.28); }
.presetSave button { background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.14); border-radius: 8px; color: #fff; font-size: 11px; padding: 8px 12px; cursor: pointer; white-space: nowrap; }
.presetSave button:hover { background: rgba(255,255,255,.15); }
.presetItem { display: flex; justify-content: space-between; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,.07); border-radius: 10px; padding: 10px 12px; background: rgba(255,255,255,.02); }
.presetItem:hover { border-color: rgba(255,255,255,.12); background: rgba(255,255,255,.04); }
.presetItemInfo { flex: 1; min-width: 0; }
.presetItemInfo strong { display: block; font-size: 12.5px; margin-bottom: 3px; color: #f0f0f0; }
.presetItemInfo span { display: block; font-size: 10px; color: rgba(255,255,255,.36); }
.presetActions { display: flex; gap: 6px; flex-shrink: 0; }
.presetActions button { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; color: rgba(255,255,255,.6); font-size: 11px; padding: 5px 10px; cursor: pointer; }
.presetActions button:hover { background: rgba(255,255,255,.1); color: #fff; }
.presetDelete { color: rgba(255,100,100,.6) !important; }
.presetDelete:hover { color: rgba(255,100,100,.9) !important; background: rgba(255,60,60,.08) !important; }
.presetEmpty { font-size: 11.5px; color: rgba(255,255,255,.28); line-height: 1.55; }
.presetNote { font-size: 10px; color: rgba(255,255,255,.22); }
 
/* OUTPUT PANEL */
.outputPanel { display: flex; flex-direction: column; overflow-y: auto; max-height: calc(100vh - 57px); position: sticky; top: 57px; }
.outputHeader { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,.07); flex-shrink: 0; flex-wrap: wrap; }
.outputFormatToggle { display: flex; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; overflow: hidden; }
.outputFormatToggle button { background: transparent; border: none; border-right: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.5); padding: 7px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; }
.outputFormatToggle button:last-child { border-right: none; }
.outputFormatToggle button.active { background: rgba(255,255,255,.1); color: #fff; }
.outputHeaderRight { display: flex; align-items: center; gap: 12px; }
 
/* HEALTH INDICATOR */
.healthIndicator { display: flex; align-items: center; gap: 7px; }
.healthIndicatorBar { width: 80px; height: 5px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; }
.healthIndicatorFill { height: 100%; border-radius: 999px; transition: width .4s ease, background .4s ease; }
.healthIndicatorScore { font-size: 12px; font-weight: 600; }
.healthIndicatorLabel { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.38); }
 
/* HEALTH BARS */
.healthBars { display: flex; gap: 10px; padding: 10px 18px; border-bottom: 1px solid rgba(255,255,255,.06); flex-wrap: wrap; flex-shrink: 0; }
.healthBar { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 120px; }
.healthBar span { font-size: 10px; color: rgba(255,255,255,.42); white-space: nowrap; }
.healthBarTrack { flex: 1; height: 4px; background: rgba(255,255,255,.07); border-radius: 999px; overflow: hidden; }
.healthBarFill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #fff, #7ee7d8); transition: width .4s ease; }
.healthBarScore { font-size: 10px; color: rgba(255,255,255,.5); white-space: nowrap; }
 
.copyBtn { background: #f0f0f0; border: none; border-radius: 999px; color: #111; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; padding: 8px 16px; cursor: pointer; font-weight: 600; white-space: nowrap; transition: background .15s; }
.copyBtn:hover { background: #fff; }
 
.outputContent { flex: 1; padding: 16px 18px; overflow-y: auto; }
.outputDisclaimer { padding: 10px 18px 14px; font-size: 11px; color: rgba(255,255,255,.28); flex-shrink: 0; }
 
/* FORMATTED OUTPUT */
.formattedOutput { display: grid; gap: 7px; }
.outputBlock { border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); border-radius: 12px; padding: 13px 15px; }
.outputBlock strong { display: block; margin-bottom: 5px; font-size: 12.5px; font-weight: 600; color: #f0f0f0; }
.outputBlock p { margin: 0; white-space: pre-wrap; color: rgba(255,255,255,.68); line-height: 1.7; font-size: 12.5px; }
.titleBlock { background: rgba(255,255,255,.03); }
.titleBlock h3 { margin: 0; font-size: 12.5px; font-weight: 600; color: #f8f8f8; }
.outputDivider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent); margin: 3px 0; }
.instagramStyle .outputBlock { background: rgba(255,255,255,.025); }
 
.messagePreview { border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.025); border-radius: 14px; padding: 18px; }
.messagePreview p { white-space: pre-wrap; color: rgba(255,255,255,.76); line-height: 1.75; font-size: 13px; }
 
/* FOOTER */
.footer { border-top: 1px solid rgba(255,255,255,.07); padding: 14px 20px; font-size: 11px; color: rgba(255,255,255,.3); text-align: center; letter-spacing: .04em; flex-shrink: 0; position: relative; z-index: 1; }
 
/* RESPONSIVE */
/* ── MOBILE ── */
.mobileNav { display: none; }
 
@media (max-width: 760px) {
  /* Top bar */
  .topBar { padding: 10px 14px; gap: 10px; }
  .topBarRow--identity { flex-wrap: wrap; }
  .topBarLogo { font-size: 12px; }
  .topBarInput { font-size: 16px; } /* 16px prevents iOS zoom */
  .topBarSelect { font-size: 16px; padding: 9px 10px; }
  .topBarCurrency { flex-shrink: 0; }
  .modeToggle button { padding: 9px 10px; font-size: 11px; }
  .toneGroupLabelWrap { flex-shrink: 0; }
  .toneToggle { flex: 1; }
  .toneToggle button { flex: 1; text-align: center; padding: 9px 6px; font-size: 11px; }
 
  /* Split layout: single column, show/hide panels via mobileTab */
  .mainSplit { grid-template-columns: 1fr; padding-bottom: 64px; }
  .builderPanel { max-height: none; position: static; border-right: none; border-bottom: 1px solid rgba(255,255,255,.07); }
  .outputPanel { max-height: none; position: static; }
 
  /* Mobile tab switching */
  .mainSplit--output .builderPanel { display: none; }
  .mainSplit:not(.mainSplit--output) .outputPanel { display: none; }
 
  /* Builder panel touch targets */
  .policyCheck { padding: 13px 12px; }
  .policyCheckBox { width: 20px; height: 20px; flex-shrink: 0; }
  .policyLabel { font-size: 13.5px; }
  .policyNote { font-size: 11.5px; }
  .policyInlineFields { padding: 0 12px 14px 44px; }
  .inlineField input, .inlineField select { font-size: 16px; padding: 10px 12px; } /* 16px = no iOS zoom */
  .builderHeader { padding: 14px 14px 10px; position: sticky; top: 0; background: rgba(8,8,8,.95); backdrop-filter: blur(12px); z-index: 5; }
  .applyBtnWrap { align-items: flex-end; }
  .applyBtnHint { max-width: 160px; }
  .applyBtn { padding: 8px 14px; font-size: 11px; }
  .policyGroup h3 { font-size: 11px; }
  .policyGroups { padding: 10px 12px; gap: 18px; }
 
  /* Output panel */
  .outputHeader { padding: 10px 14px; flex-wrap: wrap; gap: 8px; }
  .outputFormatToggle button { padding: 8px 10px; font-size: 11px; }
  .outputHeaderRight { gap: 8px; }
  .copyBtn { padding: 9px 16px; font-size: 12px; }
  .healthBars { padding: 8px 14px; gap: 8px; }
  .healthBar span { font-size: 9.5px; }
  .outputContent { padding: 12px 14px; }
  .outputBlock { padding: 12px 13px; }
  .outputBlock strong { font-size: 13px; }
  .outputBlock p { font-size: 13px; }
  .messagePreview { padding: 14px; }
  .messagePreview p { font-size: 13.5px; }
 
  /* Presets */
  .presetsToggle { padding: 14px 14px; font-size: 12px; }
  .presetsBody { padding: 0 12px 16px; }
  .presetSave input { font-size: 16px; padding: 10px 12px; }
  .presetSave button { padding: 10px 14px; }
  .presetItemInfo strong { font-size: 13px; }
  .presetItemInfo span { font-size: 11px; }
  .presetActions button { padding: 7px 12px; font-size: 12px; }
 
  /* Bottom nav */
  .mobileNav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10,10,10,.96); backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,.1); z-index: 20; safe-area-inset-bottom: env(safe-area-inset-bottom); }
  .mobileNav button { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 8px calc(10px + env(safe-area-inset-bottom)); background: none; border: none; color: rgba(255,255,255,.42); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; }
  .mobileNav button.active { color: #fff; }
  .mobileNav button.active .mobileNavIcon { opacity: 1; }
  .mobileNavIcon { font-size: 18px; opacity: .4; display: block; }
  .mobileNav button.active .mobileNavIcon { opacity: 1; }
 
  /* Footer hidden on mobile (nav replaces it) */
  .footer { display: none; }
 
  /* Monogram hidden on mobile */
  .monogram { display: none; }
}
 
@media (max-width: 400px) {
  .toneToggle button { font-size: 10px; padding: 8px 5px; }
  .modeToggle button { padding: 9px 8px; }
  .outputFormatToggle button { font-size: 10px; padding: 8px 8px; }
}
`;


