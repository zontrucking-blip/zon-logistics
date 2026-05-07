"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

// ── Calculator ──────────────────────────────────────────────────────────────

function formatDollar(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function BrokerCalculator() {
  const [carrierRate, setCarrierRate] = useState("");
  const [margin, setMargin] = useState(22);
  const [loadsPerWeek, setLoadsPerWeek] = useState(5);

  const carrier = parseFloat(carrierRate.replace(/[^0-9.]/g, "")) || 0;
  const hasValue = carrier > 0;

  const shipperPaid = hasValue ? carrier / (1 - margin / 100) : 0;
  const brokerKept = shipperPaid - carrier;
  const annualLoss = brokerKept * loadsPerWeek * 52;

  return (
    <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-xl">
      <p className="text-[#EF9F27] text-xs font-bold tracking-widest uppercase mb-5">
        Broker Rate Exposure Calculator
      </p>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            What the broker paid you
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="2,200"
              value={carrierRate}
              onChange={(e) => setCarrierRate(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/15 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27]/60 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Freight type
          </label>
          <select
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full bg-white/[0.08] border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27]/60 text-sm cursor-pointer appearance-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23EF9F27' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            <option value={18} className="bg-[#0A1628]">Dry van (~18% margin)</option>
            <option value={22} className="bg-[#0A1628]">Reefer (~22% margin)</option>
            <option value={28} className="bg-[#0A1628]">Flatbed (~28% margin)</option>
            <option value={35} className="bg-[#0A1628]">Hazmat / specialized (~35% margin)</option>
            <option value={44} className="bg-[#0A1628]">Spot market peak (~44% margin)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-300">
              Loads per week
            </label>
            <span className="text-sm font-bold text-[#EF9F27]">{loadsPerWeek}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={loadsPerWeek}
            onChange={(e) => setLoadsPerWeek(Number(e.target.value))}
            className="w-full accent-[#EF9F27] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>20</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className={`rounded-xl border transition-opacity duration-300 ${
          hasValue
            ? "border-[#EF9F27]/30 bg-[#EF9F27]/[0.08] opacity-100"
            : "border-white/10 bg-white/[0.04] opacity-50"
        }`}
      >
        <div className="divide-y divide-white/10">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-slate-300">Shipper paid</span>
            <span className="font-bold text-white text-base">
              {hasValue ? formatDollar(shipperPaid) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-slate-300">Broker kept</span>
            <span className="font-bold text-[#EF9F27] text-base">
              {hasValue ? formatDollar(brokerKept) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-semibold text-white">
              You left on the table this year
            </span>
            <span className="font-black text-[#EF9F27] text-xl">
              {hasValue ? formatDollar(annualLoss) : "—"}
            </span>
          </div>
        </div>
      </div>

      {!hasValue && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Enter your carrier rate above to see the numbers.
        </p>
      )}
    </div>
  );
}

// ── Bundle Card ─────────────────────────────────────────────────────────────

interface BundleItem {
  number: string;
  title: string;
  description: string;
  value: string;
}

function BundleCard({ item }: { item: BundleItem }) {
  return (
    <div className="bg-[#0F1E35] border border-white/10 rounded-2xl p-7 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[#EF9F27] font-black text-3xl leading-none">{item.number}</span>
        <span className="bg-[#EF9F27]/15 text-[#EF9F27] text-xs font-bold px-3 py-1 rounded-full border border-[#EF9F27]/20 shrink-0">
          ${item.value} value
        </span>
      </div>
      <div>
        <h3 className="text-white font-bold text-lg leading-snug mb-2">{item.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}

// ── Email Form ───────────────────────────────────────────────────────────────

function EmailCaptureForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EF9F27]/15 border border-[#EF9F27]/40 mb-6">
          <svg className="w-8 h-8 text-[#EF9F27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[#0A1628] text-2xl font-bold mb-2">Check your inbox.</h3>
        <p className="text-slate-500">Your toolkit is on its way to {email}.</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[#0A1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/40 focus:border-[#EF9F27]/60 text-sm transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
        <input
          required
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name</label>
        <input
          required
          type="text"
          placeholder="Smith Trucking LLC"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
        <input
          required
          type="email"
          placeholder="john@smithtrucking.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#EF9F27] hover:bg-[#d98e1f] disabled:opacity-70 text-[#0A1628] font-bold py-3.5 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
      >
        {loading ? "Sending..." : "Get the free toolkit →"}
      </button>
      <p className="text-center text-xs text-slate-400 pt-1">
        No spam. One email with your files. That&apos;s it.
      </p>
    </form>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const BUNDLE: BundleItem[] = [
  {
    number: "01",
    title: "Broker Rate Exposure Calculator",
    description:
      "See what the shipper paid, what the broker kept, and how much that costs you per year.",
    value: "75",
  },
  {
    number: "02",
    title: "Direct Shipper Outreach Kit",
    description:
      "The exact words to say when you call a shipper cold. Scripts, emails, voicemails, and what to say when they tell you they already use TQL.",
    value: "97",
  },
  {
    number: "03",
    title: "Carrier Credibility Packet",
    description:
      "A done-for-you carrier packet you fill in once and use forever.",
    value: "85",
  },
];

const TOTAL_VALUE = BUNDLE.reduce((sum, item) => sum + Number(item.value), 0);

export default function HomeShell() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Nav />

      <main>
        {/* ── Hero ── */}
        <section
          className="relative px-6 pt-32 pb-24 overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 60% 0%, rgba(239,159,39,0.08) 0%, transparent 60%), radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "auto, 28px 28px",
          }}
        >
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <p className="text-[#EF9F27] text-xs font-bold tracking-widest uppercase mb-6">
                Free Toolkit for Trucking Carriers
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-6">
                Your broker knows exactly what the shipper paid.{" "}
                <span className="text-[#EF9F27]">Now you will too.</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                Put in what they paid you. See what they kept. Then get the exact scripts,
                templates, and tools to cut them out for good.
              </p>
            </div>

            {/* Right — calculator */}
            <div className="flex justify-center lg:justify-end">
              <BrokerCalculator />
            </div>
          </div>
        </section>

        {/* ── Bundle section ── */}
        <section id="toolkit" className="px-6 py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-[#EF9F27] text-xs font-bold tracking-widest uppercase mb-4">
                What&apos;s included
              </p>
              <h2 className="text-3xl md:text-4xl font-black leading-snug mb-4 text-[#0A1628]">
                Three tools. One download.{" "}
                <span className="text-[#EF9F27]">Free.</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-xl">
                Total value{" "}
                <span className="text-[#0A1628] font-bold">${TOTAL_VALUE}</span>.
                You pay nothing. We want you to see what you&apos;re leaving on
                the table before you decide if you want our help.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {BUNDLE.map((item) => (
                <BundleCard key={item.number} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Email capture ── */}
        <section id="get-toolkit" className="px-6 py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left — pitch */}
              <div>
                <p className="text-[#EF9F27] text-xs font-bold tracking-widest uppercase mb-4">
                  Get instant access
                </p>
                <h2 className="text-3xl md:text-4xl font-black leading-snug mb-6 text-[#0A1628]">
                  Stop running blind. Get the toolkit.
                </h2>
                <ul className="space-y-4">
                  {[
                    "Know what the shipper actually paid on every load",
                    "Have the right words when you call a shipper cold",
                    "Show up looking like a real operation, not a one-truck operation scrambling for business",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#EF9F27]/20 border border-[#EF9F27]/40 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#EF9F27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <EmailCaptureForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <span>© 2026 Zon Logistics</span>
          <a
            href="mailto:paolo@zonlogistics.com"
            className="hover:text-white transition-colors"
          >
            paolo@zonlogistics.com
          </a>
        </div>
      </footer>
    </div>
  );
}
