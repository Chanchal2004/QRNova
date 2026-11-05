
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChartColumn,
  Download,
  Link2,
  Lock,
  Palette,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SECTIONS = [
  ["overview", "QRNova overview"],
  ["getting-started", "Getting started"],
  ["static", "Static QR codes"],
  ["dynamic", "Dynamic QR codes"],
  ["design", "Design and customization"],
  ["downloads", "Downloading QR codes"],
  ["analytics", "Scan analytics"],
  ["plans", "Free and Pro plans"],
  ["privacy", "Privacy and safe use"],
  ["faq", "Frequently asked questions"],
];

function GuideSection({ id, kicker, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-zinc-200 py-10 last:border-0 dark:border-zinc-800"
    >
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember-600 dark:text-ember-400">
          {kicker}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {children}
      </p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember-500/10 text-sm font-bold text-ember-700 dark:text-ember-300">
        {number}
      </span>
      <div>
        <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  );
}

export default function Docs() {
  useDocumentTitle("QRNova Guide");

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_75%_at_50%_0%,rgb(255_106_43/0.12),transparent)]" />

        <div className="relative mx-auto max-w-[1160px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-ember-500/20 bg-ember-500/5 px-3 py-1.5 text-xs font-semibold text-ember-700 dark:text-ember-300">
            <BookOpen className="h-4 w-4" />
            QRNova Help Center
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Learn what you can do with QRNova.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Learn how to create QR codes, choose between static and dynamic
            links, customize designs, download files and understand your QRNova
            plan.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ember-500/20 transition hover:-translate-y-0.5 hover:bg-ember-600"
            >
              Open QR Studio
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#getting-started"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={QrCode} title="Static QR">
            Best for information that stays fixed, such as a website URL or text.
          </FeatureCard>
          <FeatureCard icon={Link2} title="Dynamic QR">
            Best when you may need to change the destination after printing.
          </FeatureCard>
          <FeatureCard icon={Palette} title="Custom designs">
            Use the design controls available in QR Studio to style your QR code.
          </FeatureCard>
          <FeatureCard icon={ChartColumn} title="Scan insights">
            Review scan activity for dynamic codes using the analytics available in your account.
          </FeatureCard>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1160px] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
        <aside className="h-fit lg:sticky lg:top-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            Explore this guide
          </p>

          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {SECTIONS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="shrink-0 rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-600 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <GuideSection
            id="overview"
            kicker="The platform"
            title="What is QRNova?"
          >
            <p>
              QRNova is a QR code platform for creating, designing and
              managing QR experiences. It brings static QR generation,
              dynamic QR links and account-based QR management into one
              workspace.
            </p>
            <p>
              Use the Studio to create a QR code. Use your account workspace
              to manage dynamic codes and review the tools available to your
              plan.
            </p>
          </GuideSection>

          <GuideSection
            id="getting-started"
            kicker="Start here"
            title="Create your first QR code"
          >
            <div className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Step number="1" title="Open QR Studio">
                Choose Open QR Studio or Create QR Code on the website.
              </Step>
              <Step number="2" title="Choose the QR type">
                Select a static QR for fixed information or a dynamic QR
                when you need a changeable destination.
              </Step>
              <Step number="3" title="Enter your content">
                Enter the URL, text or other information requested by the
                selected QR type.
              </Step>
              <Step number="4" title="Customize and preview">
                Choose from the available design controls and check the
                preview before exporting.
              </Step>
              <Step number="5" title="Download or save">
                Download the generated file. Dynamic codes can also be
                managed in your account.
              </Step>
            </div>
          </GuideSection>

          <GuideSection
            id="static"
            kicker="Fixed information"
            title="Static QR codes"
          >
            <p>
              A static QR code stores its information directly in the QR
              pattern. When scanned, the phone reads that encoded information.
              The content cannot be changed after the QR code has been
              generated.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use static QR codes for URLs or information that will remain the same.</li>
              <li>They are suitable for posters, packaging, menus, labels and business cards.</li>
              <li>Once downloaded, the QR image can be printed or shared.</li>
            </ul>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-950 dark:text-zinc-50">
                Remember:
              </strong>{" "}
              If the encoded destination changes, create a new static QR code
              and replace the old one.
            </div>
          </GuideSection>

          <GuideSection
            id="dynamic"
            kicker="Changeable destinations"
            title="Dynamic QR codes"
          >
            <p>
              A dynamic QR code points to a QRNova redirect link. QRNova
              sends the scan to the destination currently saved for that
              code. This lets you update the destination without changing
              the printed QR pattern.
            </p>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 p-4 text-xs font-semibold dark:border-zinc-800 sm:text-sm">
              <span className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                Scan QR
              </span>
              <ArrowRight className="h-4 w-4 text-ember-500" />
              <span className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                QRNova short link
              </span>
              <ArrowRight className="h-4 w-4 text-ember-500" />
              <span className="rounded-lg bg-ember-500/10 px-3 py-2 text-ember-700 dark:text-ember-300">
                Current destination
              </span>
            </div>

            <ul className="list-disc space-y-2 pl-5">
              <li>Create a dynamic code with a destination URL.</li>
              <li>Find the code in your account to manage its details.</li>
              <li>Update its destination when your content or campaign changes.</li>
              <li>Use only the management and protection options that appear in your account.</li>
            </ul>
            <p>
              A dynamic QR code depends on the QRNova server and its redirect
              link being available.
            </p>
          </GuideSection>

          <GuideSection
            id="design"
            kicker="Make it your own"
            title="Design and customization"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard icon={Palette} title="Style your code">
                Use the available QR Studio options to adjust the appearance
                and choose a design that suits your brand.
              </FeatureCard>
              <FeatureCard icon={Sparkles} title="Keep it scannable">
                Use good contrast, leave clear space around the QR pattern
                and avoid covering important code areas.
              </FeatureCard>
            </div>
            <p>
              Always test a customized QR code with a phone camera before
              printing or sharing it widely.
            </p>
          </GuideSection>

          <GuideSection
            id="downloads"
            kicker="Export and share"
            title="Download your QR codes"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard icon={Download} title="PNG">
                Useful for websites, presentations and everyday digital sharing.
              </FeatureCard>
              <FeatureCard icon={QrCode} title="SVG">
                A scalable vector format suitable for design and print workflows.
              </FeatureCard>
              <FeatureCard icon={BookOpen} title="PDF">
                Useful for sharing and placing QR codes in documents.
              </FeatureCard>
            </div>
            <p>
              Check the export options shown in the Studio for the selected
              QR type, then scan a test copy before bulk printing.
            </p>
          </GuideSection>

          <GuideSection
            id="analytics"
            kicker="Measure activity"
            title="Scan analytics"
          >
            <p>
              QRNova provides scan activity tools for dynamic QR codes.
              Open Analytics in your account to see the metrics available
              to your account and plan.
            </p>
            <p>
              Scan counts are activity measurements; they do not necessarily
              represent unique people or identify an individual scanner.
            </p>
          </GuideSection>

          <GuideSection
            id="plans"
            kicker="Choose what fits"
            title="Free and Pro plans"
          >
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="p-4 font-semibold">Feature</th>
                    <th className="p-4 font-semibold">Free</th>
                    <th className="p-4 font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-4">Dynamic QR codes</td>
                    <td className="p-4">2</td>
                    <td className="p-4">100</td>
                  </tr>
                  <tr>
                    <td className="p-4">Static QR codes</td>
                    <td className="p-4">25</td>
                    <td className="p-4">1,000</td>
                  </tr>
                  <tr>
                    <td className="p-4">Basic customization</td>
                    <td className="p-4">Included</td>
                    <td className="p-4">Included</td>
                  </tr>
                  <tr>
                    <td className="p-4">Downloads</td>
                    <td className="p-4">Available formats</td>
                    <td className="p-4">Available formats</td>
                  </tr>
                  <tr>
                    <td className="p-4">Advanced tools</td>
                    <td className="p-4">—</td>
                    <td className="p-4">Plan features</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The current website displays Pro at ₹199 one-time. Confirm
              the limits and entitlements in the backend before publishing
              these as guaranteed plan benefits.
            </p>
          </GuideSection>

          <GuideSection
            id="privacy"
            kicker="Use QRNova responsibly"
            title="Privacy and safe use"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard icon={Lock} title="Protect sensitive information">
                Do not encode passwords, payment card details or private
                personal information into a QR code.
              </FeatureCard>
              <FeatureCard icon={ShieldCheck} title="Check every destination">
                Scan and verify the destination before printing or sharing
                a QR code with customers.
              </FeatureCard>
            </div>
          </GuideSection>

          <GuideSection
            id="faq"
            kicker="Quick answers"
            title="Frequently asked questions"
          >
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Can I edit a static QR code?
                </h3>
                <p className="mt-1">
                  No. Its information is encoded in the pattern. Create a new
                  code if the information changes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Can I change a dynamic QR destination?
                </h3>
                <p className="mt-1">
                  Yes. Open the dynamic code in your QRNova account and update
                  its destination if editing is available for that code.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Do dynamic QR codes need the QRNova server?
                </h3>
                <p className="mt-1">
                  Yes. The server handles the redirect from the QRNova short
                  link to the saved destination.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Does payment automatically activate Pro?
                </h3>
                <p className="mt-1">
                  Only when the backend verifies the payment and updates the
                  user's plan. Opening a payment link alone does not activate Pro.
                </p>
              </div>
            </div>
          </GuideSection>

          <section className="mt-10 overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500/15 text-ember-300">
              <QrCode className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
              Ready to create your QR code?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
              Open QR Studio, choose the code type and start building your
              QR experience.
            </p>

            <Link
              to="/studio"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ember-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember-600"
            >
              Open QR Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
