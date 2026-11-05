
import React from "react";

const RAZORPAY_LINK = "YOUR_RAZORPAY_PAYMENT_LINK";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "Forever",
    description: "For individuals and beginners getting started with QR codes.",
    button: "Current Free Plan",
    popular: false,
    features: [
      ["2 Dynamic QR Codes", "Edit destination anytime without changing the QR."],
      ["100 Static QR Codes", "Create permanent QR codes for your content."],
      ["Basic QR Customization", "Customize basic QR appearance."],
      ["QR Code Download", "Download and share your QR codes."],
      ["Basic Dashboard", "Manage your created QR codes in one place."],
      ["Basic Scan Tracking", "Access available basic scan information."]
    ]
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/ month",
    description: "For businesses, marketers and growing brands.",
    button: "Upgrade to Pro",
    popular: true,
    features: [
      ["100 Dynamic QR Codes", "Edit destination anytime without reprinting."],
      ["1,000 Static QR Codes", "Create QR codes for unlimited use within your plan."],
      ["Advanced QR Customization", "Add logos, colors, frames and custom designs."],
      ["Advanced Analytics", "Understand scans, engagement and QR performance."],
      ["Campaign Management", "Organize QR codes into marketing campaigns."],
      ["Custom QR Slugs", "Use memorable, branded QR links."],
      ["Expiry & Password Protection", "Control access and QR code availability."],
      ["Priority Support", "Get assistance when you need it."]
    ]
  }
];

export default function Pricing() {
  const upgrade = () => {
    if (!RAZORPAY_LINK.startsWith("https://")) {
      alert("Please add your Razorpay Payment Link.");
      return;
    }
    window.open(RAZORPAY_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <main style={s.page}>
      <header style={s.header}>
        <span style={s.tag}>QRNOVA PRICING</span>
        <h1>Simple Plans. Powerful QR Solutions.</h1>
        <p>
          Start for free. Upgrade when your business needs more power.
          No confusion, just the features you need.
        </p>
      </header>

      <section style={s.cards}>
        {plans.map((plan) => (
          <article key={plan.name}
            style={{ ...s.card, ...(plan.popular ? s.pro : {}) }}>

            {plan.popular && <div style={s.badge}>MOST POPULAR</div>}

            <h2>{plan.name}</h2>
            <p style={s.description}>{plan.description}</p>

            <div style={s.price}>
              {plan.price}
              <small>{plan.period}</small>
            </div>

            <button
              onClick={plan.popular ? upgrade : undefined}
              disabled={!plan.popular}
              style={{
                ...s.button,
                ...(plan.popular ? s.proButton : s.freeButton)
              }}>
              {plan.button}
            </button>

            <div style={s.divider}></div>

            <h3>What's included</h3>

            {plan.features.map(([name, detail]) => (
              <div key={name} style={s.feature}>
                <span style={s.check}>✓</span>
                <div>
                  <strong>{name}</strong>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </article>
        ))}
      </section>

      <section style={s.bottom}>
        <h2>Why choose QRNova?</h2>
        <p>
          Create, manage and track your QR codes from one simple dashboard.
          Upgrade to Pro when you need advanced tools for your business.
        </p>
      </section>
    </main>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    padding: "55px 20px",
    background: "#f8fafc",
    color: "#172033",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    textAlign: "center",
    maxWidth: 700,
    margin: "0 auto 55px"
  },
  tag: {
    color: "#635bff",
    fontWeight: 700,
    letterSpacing: 2,
    fontSize: 12
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 28,
    flexWrap: "wrap"
  },
  card: {
    width: 370,
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: 30,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    position: "relative"
  },
  pro: {
    border: "2px solid #635bff",
    boxShadow: "0 12px 35px rgba(99,91,255,0.12)"
  },
  badge: {
    position: "absolute",
    top: -13,
    right: 22,
    padding: "6px 13px",
    borderRadius: 20,
    background: "#635bff",
    color: "white",
    fontSize: 11,
    fontWeight: 700
  },
  description: {
    color: "#64748b",
    minHeight: 45,
    lineHeight: 1.5
  },
  price: {
    fontSize: 38,
    fontWeight: 800,
    margin: "24px 0"
  },
  divider: {
    borderTop: "1px solid #e2e8f0",
    margin: "25px 0"
  },
  button: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14
  },
  proButton: {
    background: "#635bff",
    color: "#fff",
    cursor: "pointer"
  },
  freeButton: {
    background: "#e2e8f0",
    color: "#475569",
    cursor: "default"
  },
  feature: {
    display: "flex",
    gap: 12,
    marginTop: 20,
    alignItems: "flex-start"
  },
  check: {
    color: "#16a34a",
    fontWeight: 800,
    fontSize: 18
  },
  bottom: {
    textAlign: "center",
    maxWidth: 650,
    margin: "65px auto 20px",
    color: "#475569",
    lineHeight: 1.7
  }
};
