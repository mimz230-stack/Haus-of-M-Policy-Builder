import React, { useMemo, useState } from "react";

export default function BeautyBusinessPolicyBuilder() {
  const brandName = "Haus of M";
  const brandTagline = "Professional Beauty Business Tools";
  const [currency, setCurrency] = useState("NZD");
  const [activeTab, setActiveTab] = useState("builder");

  const [settings, setSettings] = useState({
    businessName: "Your Beauty Business",
    bookingFeeType: "deposit",
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
    tone: "clear",
  });

  const [included, setIncluded] = useState({
    bookingFee: true,
    cancellation: true,
    noShow: true,
    lateArrival: true,
    rescheduling: true,
    refunds: true,
    sickness: true,
    childrenGuests: true,
    patchTesting: true,
    correctionWork: true,
    payment: true,
  });

  const money = (value) => {
    try {
      return new Intl.NumberFormat("en-NZ", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
    } catch {
      return `$${Math.round(Number(value) || 0)}`;
    }
  };

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const updateIncluded = (key, value) => setIncluded((prev) => ({ ...prev, [key]: value }));

  const toneIntro = useMemo(() => {
    if (settings.tone === "soft") {
      return `To keep appointments running smoothly and fairly for everyone, please read through the policies below before booking with ${settings.businessName}.`;
    }
    if (settings.tone === "firm") {
      return `By booking with ${settings.businessName}, you agree to the policies below. These policies protect appointment time, business costs, and the quality of service provided.`;
    }
    if (settings.tone === "premium") {
      return `At ${settings.businessName}, every appointment is reserved with care. These policies help protect the time, preparation, and professional standard behind each service.`;
    }
    return `Please read the policies below before booking with ${settings.businessName}. These help keep appointments clear, fair, and respectful of everyone’s time.`;
  }, [settings.businessName, settings.tone]);

  const policySections = useMemo(() => {
    const sections = [];

    if (included.bookingFee) {
      const feeName = settings.bookingFeeType === "deposit" ? "booking fee/deposit" : "booking fee";
      sections.push({
        title: "Booking Fee",
        text: `A ${feeName} of ${money(settings.bookingFeeAmount)} is required to secure your appointment. Your booking is not confirmed until this has been paid. This amount is applied toward your appointment unless stated otherwise in the cancellation or no-show policy.`,
        short: `A ${money(settings.bookingFeeAmount)} booking fee is required to secure your appointment.`,
      });
    }

    if (included.cancellation) {
      sections.push({
        title: "Cancellations",
        text: `Please give at least ${settings.cancellationNotice} hours’ notice if you need to cancel your appointment. Cancellations made with less than ${settings.cancellationNotice} hours’ notice may result in your booking fee being kept or a new booking fee being required before rebooking.`,
        short: `Please give at least ${settings.cancellationNotice} hours’ notice for cancellations. Late cancellations may lose their booking fee.`,
      });
    }

    if (included.noShow) {
      const noShowText = settings.noShowRule === "bookingFeeKept"
        ? "If you do not show up to your appointment, your booking fee will be kept. A new booking fee will be required to book again."
        : "If you do not show up to your appointment, you may be required to pay for the missed appointment before booking again.";
      sections.push({ title: "No-Shows", text: noShowText, short: noShowText });
    }

    if (included.lateArrival) {
      sections.push({
        title: "Late Arrivals",
        text: `Please arrive on time for your appointment. If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be shortened, rescheduled, or cancelled. The full appointment cost may still apply if the service cannot be completed due to lateness.`,
        short: `If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be shortened, rescheduled, or cancelled.`,
      });
    }

    if (included.rescheduling) {
      sections.push({
        title: "Rescheduling",
        text: `Appointments may be rescheduled up to ${settings.rescheduleLimit} time${Number(settings.rescheduleLimit) === 1 ? "" : "s"}, provided enough notice is given. Further changes may require a new booking fee.`,
        short: `Appointments may be rescheduled up to ${settings.rescheduleLimit} time${Number(settings.rescheduleLimit) === 1 ? "" : "s"} with enough notice.`,
      });
    }

    if (included.refunds) {
      const refundText = settings.refundPolicy === "serviceBased"
        ? "Refunds are not offered for change of mind. If you have a genuine concern with your service, please make contact as soon as possible so it can be assessed fairly."
        : "All sales and services are final. Concerns must be raised as soon as possible so they can be reviewed on a case-by-case basis.";
      sections.push({ title: "Refunds", text: refundText, short: refundText });
    }

    if (included.sickness) {
      sections.push({
        title: "Sickness",
        text: `If you are unwell, please reschedule your appointment with as much notice as possible, ideally at least ${settings.sicknessNotice} hours before your appointment. This helps protect the health of the business, other clients, and everyone in the space.`,
        short: `If you are unwell, please reschedule with as much notice as possible.`,
      });
    }

    if (included.childrenGuests) {
      const childrenText = settings.childrenPolicy === "noChildren"
        ? "Children are not able to attend appointments unless agreed prior. This is for safety, focus, and insurance reasons."
        : "Please check before bringing children to your appointment, as not all services or appointment spaces are suitable.";
      const guestsText = settings.extraGuestsPolicy === "noGuests"
        ? "Please attend your appointment alone unless otherwise arranged."
        : "Extra guests may be allowed by prior arrangement only.";
      sections.push({
        title: "Children & Extra Guests",
        text: `${childrenText} ${guestsText}`,
        short: `${childrenText} ${guestsText}`,
      });
    }

    if (included.patchTesting && settings.patchTestRequired) {
      sections.push({
        title: "Patch Testing",
        text: "Patch testing may be required for selected services or products. If a patch test is required and has not been completed within the correct timeframe, your appointment may need to be rescheduled.",
        short: "Patch testing may be required for selected services. If required and not completed, your appointment may need to be rescheduled.",
      });
    }

    if (included.correctionWork) {
      sections.push({
        title: "Concerns & Correction Work",
        text: `If you have a concern with your service, please contact the business within ${settings.correctionWindow} hours so it can be assessed. Concerns raised outside this timeframe may be treated as a new appointment or maintenance service.`,
        short: `Please raise service concerns within ${settings.correctionWindow} hours so they can be assessed fairly.`,
      });
    }

    if (included.payment) {
      const paymentText = settings.paymentTiming === "appointmentEnd"
        ? "Payment is due at the end of your appointment before leaving."
        : "Payment is required before or at the time of service as agreed when booking.";
      sections.push({ title: "Payment", text: paymentText, short: paymentText });
    }

    return sections;
  }, [settings, included, currency]);

  const fullPolicy = useMemo(() => {
    return [toneIntro, ...policySections.map((section) => `${section.title}\n${section.text}`)].join("\n\n");
  }, [toneIntro, policySections]);

  const instagramPolicy = useMemo(() => {
    return policySections.map((section) => `${section.title}: ${section.short}`).join("\n\n");
  }, [policySections]);

  const confirmationMessage = useMemo(() => {
    const cancellation = included.cancellation ? `Please give at least ${settings.cancellationNotice} hours’ notice for cancellations or changes.` : "";
    const late = included.lateArrival ? `If you are more than ${settings.lateMinutes} minutes late, your appointment may need to be changed or cancelled.` : "";
    const sickness = included.sickness ? "If you are unwell, please reschedule before attending." : "";
    return `Your appointment with ${settings.businessName} is booked.\n\n${cancellation}\n${late}\n${sickness}\n\nThank you for respecting the time and preparation that goes into your appointment.`;
  }, [settings, included]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch {
      alert("Copy failed. Highlight the text and copy it manually.");
    }
  };

  return (
    <div style={styles.app}>
      <style>{css}</style>
      <div className="monogramWatermark">M</div>
      <main className="wrap">
        <header className="logoHeader">
          <div className="hausLogo">
            <div className="hausTop">HAUS</div>
            <div className="hausMiddle"><span></span><em>OF</em><span></span></div>
            <div className="hausBottom">M</div>
          </div>
        </header>

        <section className="hero gridTwo">
          <div className="panel heroPanel">
            <div className="brandRow">
              <div className="brandMark">
                <div className="brandName">{brandName}</div>
                <div className="brandTagline">{brandTagline}</div>
              </div>
            </div>
            <h1>Policy Builder</h1>
            <p className="lead">Build clear beauty business policies for booking fees, cancellations, no-shows, lateness, refunds, sickness, guests, patch testing, payments, and client boundaries.</p>
            <div className="fieldGrid two">
              <TextField label="Business name" value={settings.businessName} onChange={(v) => updateSetting("businessName", v)} />
              <SelectField label="Currency" value={currency} onChange={setCurrency} options={["NZD", "AUD", "USD", "GBP"]} />
            </div>
          </div>

          <div className="panel resultHero">
            <p className="overline">Quick result</p>
            <h2>Policies selected</h2>
            <p className="giant">{Object.values(included).filter(Boolean).length}</p>
            <p className="muted">Choose the policies you want, adjust the details, then copy the version you need.</p>
            <p className="disclaimer">This is a business education tool and does not replace personalised legal advice.</p>
          </div>
        </section>

        <nav className="tabs">
          {[
            ["builder", "Builder"],
            ["policies", "Full Policy"],
            ["instagram", "Instagram"],
            ["confirmation", "Client Message"],
          ].map(([id, label]) => (
            <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </nav>

        {activeTab === "builder" && (
          <section className="gridTwo">
            <div className="panel">
              <h2>Select policies</h2>
              <p className="sectionHint">Tick the policies you want included. You can keep it simple or build a full policy set.</p>
              <div className="checks">
                {Object.entries({
                  bookingFee: "Booking fee / deposit",
                  cancellation: "Cancellation policy",
                  noShow: "No-show policy",
                  lateArrival: "Late arrival policy",
                  rescheduling: "Rescheduling policy",
                  refunds: "Refund policy",
                  sickness: "Sickness policy",
                  childrenGuests: "Children & extra guests",
                  patchTesting: "Patch testing",
                  correctionWork: "Concerns & correction work",
                  payment: "Payment policy",
                }).map(([key, label]) => (
                  <Check key={key} label={label} checked={included[key]} onChange={(v) => updateIncluded(key, v)} />
                ))}
              </div>
            </div>

            <div className="panel">
              <h2>Policy details</h2>
              <div className="fieldGrid two">
                <SelectField label="Tone" value={settings.tone} onChange={(v) => updateSetting("tone", v)} options={["soft", "clear", "firm", "premium"]} />
                <NumberField label="Booking fee amount" value={settings.bookingFeeAmount} onChange={(v) => updateSetting("bookingFeeAmount", v)} note="The amount required to secure an appointment." />
                <NumberField label="Cancellation notice" value={settings.cancellationNotice} onChange={(v) => updateSetting("cancellationNotice", v)} note="How many hours’ notice clients need to give." />
                <NumberField label="Late arrival limit" value={settings.lateMinutes} onChange={(v) => updateSetting("lateMinutes", v)} note="How many minutes late before the appointment may be changed." />
                <NumberField label="Reschedule limit" value={settings.rescheduleLimit} onChange={(v) => updateSetting("rescheduleLimit", v)} note="How many times a client can reschedule before a new fee may apply." />
                <NumberField label="Concern window" value={settings.correctionWindow} onChange={(v) => updateSetting("correctionWindow", v)} note="How many hours clients have to raise a service concern." />
                <SelectField label="No-show rule" value={settings.noShowRule} onChange={(v) => updateSetting("noShowRule", v)} options={["bookingFeeKept", "payBeforeRebook"]} />
                <SelectField label="Refund style" value={settings.refundPolicy} onChange={(v) => updateSetting("refundPolicy", v)} options={["serviceBased", "finalSale"]} />
                <SelectField label="Children policy" value={settings.childrenPolicy} onChange={(v) => updateSetting("childrenPolicy", v)} options={["noChildren", "askFirst"]} />
                <SelectField label="Extra guests" value={settings.extraGuestsPolicy} onChange={(v) => updateSetting("extraGuestsPolicy", v)} options={["noGuests", "askFirst"]} />
              </div>
            </div>
          </section>
        )}

        {activeTab === "policies" && <OutputPanel title="Full Website / Booking Policy" text={fullPolicy} copyText={copyText} />}
        {activeTab === "instagram" && <OutputPanel title="Instagram Highlight Policy" text={instagramPolicy} copyText={copyText} />}
        {activeTab === "confirmation" && <OutputPanel title="Client Booking Message" text={confirmationMessage} copyText={copyText} />}

        <footer className="footerBrand">
          <strong>{brandName}</strong> © 2026. Licensed for personal business use only. Not for resale, redistribution, copying, or teaching as your own.
        </footer>
      </main>
    </div>
  );
}

function OutputPanel({ title, text, copyText }) {
  return (
    <section className="gridTwo">
      <div className="panel">
        <h2>{title}</h2>
        <p className="sectionHint">Review the wording and adjust anything that needs to match your business, booking system, or local requirements.</p>
      </div>
      <div className="panel dark">
        <div className="split"><h2>Copy/Paste Output</h2><button className="copyBtn" onClick={() => copyText(text)}>Copy</button></div>
        <pre>{text}</pre>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange, note }) {
  return (
    <label className="field">
      <span>{label}</span>
      {note ? <small>{note}</small> : null}
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </label>
  );
}

function TextField({ label, value, onChange, placeholder = "", type = "text", note }) {
  return (
    <label className="field">
      <span>{label}</span>
      {note ? <small>{note}</small> : null}
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, labels = {} }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{labels[option] || labelOption(option)}</option>)}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function labelOption(value) {
  const labels = {
    NZD: "NZD",
    AUD: "AUD",
    USD: "USD",
    GBP: "GBP",
    soft: "Soft",
    clear: "Clear",
    firm: "Firm",
    premium: "Premium",
    bookingFeeKept: "Booking fee kept",
    payBeforeRebook: "Pay before rebooking",
    serviceBased: "Review concerns case-by-case",
    finalSale: "Final sale / no refunds",
    noChildren: "No children at appointments",
    askFirst: "Ask first / prior arrangement",
    noGuests: "No extra guests",
  };
  return labels[value] || value;
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#020202",
    color: "white",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
};

const css = `
* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; background: #020202; }
body { overflow-x: hidden; }
.wrap { width: min(980px, calc(100% - 36px)); margin: 0 auto; padding: 16px 0 24px; position: relative; z-index: 1; }
.logoHeader { display: flex; justify-content: center; align-items: center; padding: 6px 0 18px; }
.hausLogo { text-align: center; color: #f8f8f8; text-shadow: 0 0 28px rgba(255,255,255,.16); line-height: 1; user-select: none; }
.hausTop { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(24px, 3.2vw, 42px); letter-spacing: .24em; margin-left: .24em; }
.hausMiddle { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 4px 0 0; }
.hausMiddle span { display: block; width: 46px; height: 1px; background: rgba(255,255,255,.62); }
.hausMiddle em { font-family: Georgia, 'Times New Roman', serif; font-style: normal; font-size: 11px; letter-spacing: .22em; }
.hausBottom { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(38px, 4.8vw, 62px); letter-spacing: .03em; margin-top: 2px; }
.monogramWatermark { position: fixed; top: 260px; right: 5vw; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(180px, 28vw, 420px); line-height: .8; color: rgba(255,255,255,.028); font-weight: 700; pointer-events: none; z-index: 0; user-select: none; }
.gridTwo { display: grid; grid-template-columns: 1.02fr .98fr; gap: 14px; align-items: start; }
.hero { margin-bottom: 14px; }
.panel { border: 1px solid rgba(255,255,255,.12); background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.02)); backdrop-filter: blur(18px); border-radius: 18px; padding: 18px; box-shadow: 0 18px 70px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04); }
.heroPanel { padding: 24px; min-height: 292px; }
.resultHero, .resultPanel { background: radial-gradient(circle at top left, rgba(255,255,255,.09), transparent 34%), linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); }
.dark { background: rgba(0,0,0,.42); }
.brandRow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.brandMark { border: 1px solid rgba(255,255,255,.16); border-radius: 14px; padding: 10px 13px; background: rgba(0,0,0,.24); box-shadow: 0 0 28px rgba(255,255,255,.035); }
.brandName { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 600; letter-spacing: .14em; color: #f7f7f7; text-transform: uppercase; }
.brandTagline { margin-top: 5px; font-size: 8px; text-transform: uppercase; letter-spacing: .2em; color: rgba(255,255,255,.52); }
h1 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: clamp(32px, 4.6vw, 52px); line-height: .98; margin: 0; letter-spacing: -0.05em; color: #f7f7f7; }
h2 { font-size: 15px; margin: 0 0 12px; letter-spacing: .12em; text-transform: uppercase; color: #f4f4f4; font-weight: 500; }
p { line-height: 1.65; }
.lead { color: rgba(255,255,255,.68); font-size: 14px; max-width: 620px; margin: 16px 0 0; }
.muted { color: rgba(255,255,255,.64); }
.overline { text-transform: uppercase; letter-spacing: .28em; color: rgba(255,255,255,.66); font-size: 10px; margin: 0 0 10px; }
.giant { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(42px, 5.2vw, 68px); font-weight: 400; margin: 12px 0; line-height: .92; letter-spacing: -0.055em; color: #ffffff; }
.disclaimer, .sectionHint { border-radius: 14px; padding: 12px; background: rgba(0,0,0,.34); color: rgba(255,255,255,.64); font-size: 12px; border: 1px solid rgba(255,255,255,.08); }
.sectionHint { margin: 0 0 18px; }
.tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; background: rgba(0,0,0,.36); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; overflow: hidden; margin-bottom: 14px; }
.tabs button, .copyBtn { border: 0; border-right: 1px solid rgba(255,255,255,.08); border-radius: 0; padding: 13px 10px; background: transparent; color: rgba(255,255,255,.64); font-weight: 500; cursor: pointer; letter-spacing: .12em; text-transform: uppercase; font-size: 11px; }
.tabs button:last-child { border-right: 0; }
.tabs button.active { background: rgba(255,255,255,.08); color: #ffffff; box-shadow: inset 0 -2px 0 rgba(255,255,255,.92); }
.copyBtn { border: 1px solid rgba(255,255,255,.18); border-radius: 999px; padding: 11px 16px; background: #f5f5f5; color: #080808; }
.fieldGrid { display: grid; gap: 14px; margin-top: 16px; }
.fieldGrid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.field { display: grid; gap: 8px; margin-bottom: 16px; }
.field span { font-size: 12px; color: rgba(255,255,255,.78); font-weight: 500; text-transform: uppercase; letter-spacing: .12em; }
.field small { margin-top: -4px; color: rgba(255,255,255,.48); font-size: 12px; line-height: 1.45; }
input, select { width: 100%; border: 1px solid rgba(255,255,255,.13); border-radius: 10px; padding: 11px 12px; background: rgba(0,0,0,.42); color: white; outline: none; font-size: 14px; }
select option { color: #111; }
input:focus, select:focus { border-color: rgba(255,255,255,.54); box-shadow: 0 0 0 3px rgba(255,255,255,.08); }
.checks { display: grid; gap: 10px; }
.check { display: flex; align-items: flex-start; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.08); padding: 10px 0; color: rgba(255,255,255,.74); font-size: 13px; }
.check input { width: 16px; height: 16px; margin-top: 2px; accent-color: #fff; }
.split { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
pre { white-space: pre-wrap; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); border-radius: 14px; padding: 16px; color: rgba(255,255,255,.82); line-height: 1.65; font-family: inherit; font-size: 13px; }
.footerBrand { margin-top: 24px; padding: 18px; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(0,0,0,.34); color: rgba(255,255,255,.58); font-size: 12px; text-align: center; letter-spacing: .04em; }
@media (max-width: 880px) { .wrap { width: min(100% - 24px, 980px); } .gridTwo { grid-template-columns: 1fr; } .tabs { grid-template-columns: repeat(2, 1fr); } .tabs button { border-bottom: 1px solid rgba(255,255,255,.08); } .fieldGrid.two { grid-template-columns: 1fr; } .heroPanel { padding: 26px; min-height: auto; } .hausMiddle span { width: 48px; } }
`;

