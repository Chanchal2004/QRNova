
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Lock,
  Palette,
  ChartColumn,
  Zap,
  Link2,
  FileDown,
  HandCoins,
  UserX,
  EyeOff,
  Crown,
  QrCode,
  Check,
  BookOpen,
} from "lucide-react";
import { QRCode } from "@qrforge/react";
import { presets } from "@qrforge/core";
import { ButtonLink } from "../components/ui/Button.jsx";
import { cx } from "../lib/cx.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

const RAZORPAY_PAYMENT_LINK = "https://rzp.io/rzp/NDMhrFi4";

const SPECIMENS = presets.filter((p) => p.id !== "dark");

function Specimen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % SPECIMENS.length),
      2800
    );

    return () => clearInterval(timer);
  }, []);

  const preset = SPECIMENS[index];

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-ember-500/10 blur-3xl dark:bg-ember-500/[0.07]" />

      <div className="rounded-[22px] border border-zinc-200 bg-white/70 p-3 shadow-2xl shadow-zinc-950/[0.06] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
        <div
          className="relative aspect-square overflow-hidden rounded-2xl"
          style={{ background: preset.options.background }}
        >
          {SPECIMENS.map((item, i) => (
            <div
              key={item.id}
              className={cx(
                "absolute inset-0 p-5 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={i !== index}
            >
              <QRCode
                value="https://QRNova.dev"
                size={600}
                margin={1}
                {...item.options}
                frame={null}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2 pt-3 pb-1 text-xs">
          <span className="font-medium">{preset.name}</span>

          <span className="muted flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            generated in your browser
          </span>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: QrCode,
    title: "Static QR codes",
    text: "Create QR codes for links and information that stay the same.",
  },
  {
    icon: Link2,
    title: "Dynamic QR codes",
    text: "Update destinations even after a QR code has been printed.",
  },
  {
    icon: Palette,
    title: "Custom QR designs",
    text: "Match your QR codes to your brand with colors and design options.",
  },
  {
    icon: ChartColumn,
    title: "Scan analytics",
    text: "Understand how people interact with your dynamic QR codes.",
  },
  {
    icon: FileDown,
    title: "Easy downloads",
    text: "Export your QR codes in PNG, SVG and PDF formats.",
  },
  {
    icon: Lock,
    title: "Privacy-conscious",
    text: "Generate static QR codes directly in your browser.",
  },
  {
    icon: Zap,
    title: "Flexible destinations",
    text: "Keep printed materials useful when your links or pages change.",
  },
  {
    icon: Crown,
    title: "Pro tools",
    text: "Unlock higher limits and advanced QR management features.",
  },
  {
    icon: UserX,
    title: "Simple to get started",
    text: "Create static QR codes without needing an account.",
  },
  {
    icon: HandCoins,
    title: "Free plan",
    text: "Try QRNova with free QR creation before upgrading.",
  },
];

function Flow({ steps }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900">
            {step}
          </span>

          {i < steps.length - 1 && (
            <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
          )}
        </span>
      ))}
    </div>
  );
}

function Pricing() {
  const upgrade = () => {
    window.open(
      RAZORPAY_PAYMENT_LINK,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "Forever",
      description: "Everything you need to start creating QR codes.",
      features: [
        "2 Dynamic QR Codes",
        "25 Static QR Codes",
        "Basic QR customization",
        "PNG, SVG and PDF downloads",
        "Basic QR management",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "₹199",
      period: "one-time",
      description:
        "Unlock more QR capacity and advanced tools for your projects or business.",
      features: [
        "100 Dynamic QR Codes",
        "1,000 Static QR Codes",
        "Advanced QR customization",
        "Advanced scan analytics",
        "Campaign management",
        "Custom QR slugs",
        "Expiry and password protection",
        "Priority support",
      ],
      popular: true,
    },
  ];

  return (
    <section
      id="pricing"
      className="border-t border-zinc-200 dark:border-zinc-800/60"
    >
      <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-ember-600 uppercase dark:text-ember-400">
            Simple Pricing
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Choose the right plan for you.
          </h2>

          <p className="muted mt-4 leading-relaxed">
            Start for free. Upgrade to Pro when you need more QR codes
            and advanced features.
          </p>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cx(
                "relative rounded-2xl border bg-white p-7 dark:bg-zinc-950 sm:p-9",
                plan.popular
                  ? "border-2 border-ember-500 shadow-xl shadow-ember-500/10"
                  : "border-zinc-200 dark:border-zinc-800"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-7 rounded-full bg-ember-500 px-4 py-1 text-[11px] font-bold text-white">
                  MOST POPULAR
                </span>
              )}

              <div className="flex items-center gap-3">
                {plan.popular ? (
                  <Crown className="h-6 w-6 text-ember-500" />
                ) : (
                  <QrCode className="h-6 w-6 text-zinc-500" />
                )}

                <h3 className="text-xl font-semibold">
                  {plan.name} Plan
                </h3>
              </div>

              <p className="muted mt-3 min-h-10 text-sm">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>

                <span className="muted text-sm">
                  {plan.period}
                </span>
              </div>

              {plan.current ? (
                <ButtonLink
                  to="/studio"
                  variant="secondary"
                  size="lg"
                  className="mt-7 w-full justify-center"
                >
                  Start Creating QR Codes
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <button
                  type="button"
                  onClick={upgrade}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-ember-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember-600"
                >
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <div className="my-7 border-t border-zinc-200 dark:border-zinc-800" />

              <h4 className="mb-5 text-sm font-semibold">
                What's included
              </h4>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="muted mt-8 text-center text-xs">
          Static QR codes are generated directly in your browser.
          Dynamic QR codes use your QRNova account.
        </p>
      </div>
    </section>
  );
}

export default function Landing() {
  useDocumentTitle(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_106_43/0.10),transparent)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_106_43/0.08),transparent)]"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24 lg:pb-28">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-ember-500/20 bg-ember-500/5 px-3 py-1.5 text-xs font-medium text-ember-700 dark:text-ember-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Smarter QR experiences for everyday business
            </div>

            <h1 className="mt-6 text-[44px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
              Create. Connect.
              <br />
              Grow with QRNova.
            </h1>

            <p className="muted mt-6 max-w-xl text-lg leading-relaxed text-pretty">
              QRNova makes it easy to create beautiful, trackable QR codes
              for your business. Design branded codes, update destinations
              whenever you need, and understand how people engage with your
              links — all from one simple workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/studio" variant="accent" size="lg">
                Create QR Code
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>

              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Discover QRNova
                <ArrowRight className="h-4 w-4" />
              </a>

              <ButtonLink to="/docs" variant="secondary" size="lg">
                <BookOpen className="h-4 w-4" />
                Read the Docs
              </ButtonLink>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-zinc-600 dark:text-zinc-400">
              {[
                [Lock, "Generated locally"],
                [UserX, "No account needed"],
                [EyeOff, "No ads or trackers"],
                [FileDown, "PNG, SVG & PDF"],
              ].map(([Icon, label]) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-ember-500" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <Specimen />
          </div>
        </div>
      </section>

      {/* Static versus Dynamic */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-ember-600 uppercase dark:text-ember-400">
              Two kinds of codes
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Static when you can. Dynamic when you need it.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="surface p-6">
              <h3 className="font-semibold">
                Static QR codes
              </h3>

              <p className="muted mt-2 text-sm leading-relaxed">
                The content is encoded directly in the pattern. They work
                without a server and are generated entirely in your browser.
                Perfect for Wi-Fi, contacts and links that won't change.
              </p>

              <div className="mt-5">
                <Flow steps={["QR code", "https://example.com"]} />
              </div>
            </div>

            <div className="surface p-6">
              <h3 className="font-semibold">
                Dynamic QR codes
              </h3>

              <p className="muted mt-2 text-sm leading-relaxed">
                The code points at a short link on your QRNova server.
                Change the destination after printing, pause it, add an
                expiry or password, and see anonymous scan analytics.
              </p>

              <div className="mt-5">
                <Flow
                  steps={[
                    "QR code",
                    "/r/abc123",
                    "current destination",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-ember-600 uppercase dark:text-ember-400">
              Everything included
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A QR platform, not just a generator.
            </h2>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-5 dark:border-zinc-800 dark:bg-zinc-800">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white p-5 dark:bg-zinc-950"
              >
                <Icon className="h-4 w-4 text-ember-500" />

                <h3 className="mt-3 text-sm font-semibold">
                  {title}
                </h3>

                <p className="muted mt-1 text-[13px] leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* About QRNova */}
      <section
        id="about"
        className="border-t border-zinc-200 dark:border-zinc-800/60"
      >
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs font-semibold tracking-widest text-ember-600 uppercase dark:text-ember-400">
              Meet QRNova
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              One simple platform. More powerful connections.
            </h2>

            <p className="muted mt-5 leading-relaxed">
              QRNova is a modern QR code platform built to help creators,
              professionals and businesses connect the physical world with
              digital experiences. Create custom QR codes for websites,
              products, menus, campaigns and more — without complicated tools.
            </p>

            <p className="muted mt-4 leading-relaxed">
              Start with static QR codes for information that stays the same,
              or use dynamic QR codes when you need the freedom to change a
              destination after printing. With design tools and scan insights
              in one place, QRNova helps you create, manage and improve every
              connection.
            </p>

            <div className="mt-7">
              <ButtonLink to="/studio" variant="accent" size="lg">
                Start creating
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface rounded-2xl p-6">
              <Link2 className="h-6 w-6 text-ember-500" />
              <h3 className="mt-4 font-semibold">
                Flexible links
              </h3>
              <p className="muted mt-2 text-sm leading-relaxed">
                Update dynamic QR destinations whenever your content changes.
              </p>
            </div>

            <div className="surface rounded-2xl p-6">
              <Palette className="h-6 w-6 text-ember-500" />
              <h3 className="mt-4 font-semibold">
                Your brand, your style
              </h3>
              <p className="muted mt-2 text-sm leading-relaxed">
                Customize QR designs to match your brand and purpose.
              </p>
            </div>

            <div className="surface rounded-2xl p-6">
              <ChartColumn className="h-6 w-6 text-ember-500" />
              <h3 className="mt-4 font-semibold">
                Useful insights
              </h3>
              <p className="muted mt-2 text-sm leading-relaxed">
                Review scan activity and understand engagement with your codes.
              </p>
            </div>

            <div className="surface rounded-2xl p-6">
              <Lock className="h-6 w-6 text-ember-500" />
              <h3 className="mt-4 font-semibold">
                Built with privacy in mind
              </h3>
              <p className="muted mt-2 text-sm leading-relaxed">
                Create and manage QR experiences with a privacy-conscious approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to make every scan count?
            </h2>

            <p className="muted mt-2">
              Create your first QR code with QRNova today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/studio" variant="accent" size="lg">
              Open the Studio
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              View plans
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="muted">
            © {new Date().getFullYear()} QRNova. Create. Connect. Grow.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/docs"
              className="muted inline-flex items-center gap-2 hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
