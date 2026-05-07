"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import CityAutocomplete, { type CityOption } from "@/components/CityAutocomplete";

// ─── Types ────────────────────────────────────────────────────────────────────

type TempOption = "frozen" | "refrigerated" | "ambient";
type SpecialKey = "multiStop" | "appointment" | "weekend" | "floorLoaded";

interface FormState {
  pickupLocation: CityOption | null;
  deliveryLocation: CityOption | null;
  commodity: string;
  temperature: TempOption | "";
  weight: string;
  pickupDate: string;
  contactName: string;
  contactEmail: string;
  special: Record<SpecialKey, boolean>;
}

interface FormErrors {
  pickupLocation?: string;
  deliveryLocation?: string;
  commodity?: string;
  weight?: string;
  pickupDate?: string;
  contactName?: string;
  contactEmail?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLANK: FormState = {
  pickupLocation: null,
  deliveryLocation: null,
  commodity: "",
  temperature: "",
  weight: "",
  pickupDate: "",
  contactName: "",
  contactEmail: "",
  special: {
    multiStop: false,
    appointment: false,
    weekend: false,
    floorLoaded: false,
  },
};

const TEMP_OPTIONS: { value: TempOption; label: string; sub: string }[] = [
  { value: "frozen",       label: "Frozen",             sub: "0°F or below" },
  { value: "refrigerated", label: "Refrigerated",       sub: "34–38°F" },
  { value: "ambient",      label: "Controlled Ambient", sub: "55–70°F" },
];

const SPECIAL_OPTIONS: { key: SpecialKey; label: string }[] = [
  { key: "multiStop",   label: "Multi-stop" },
  { key: "appointment", label: "Appointment required" },
  { key: "weekend",     label: "Weekend pickup" },
  { key: "floorLoaded", label: "Floor loaded" },
];

// ─── Distance + Quote Math ────────────────────────────────────────────────────

function estimateDrivingMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const straightLine = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(straightLine * 1.15);
}

// ─── Lane-based Pricing ───────────────────────────────────────────────────────

type Region = "NORTHEAST" | "MIDATLANTIC" | "MIDWEST" | "SOUTHEAST" | "FLORIDA";

const STATE_TO_REGION: Record<string, Region> = {
  NJ: "NORTHEAST", NY: "NORTHEAST", PA: "NORTHEAST", CT: "NORTHEAST",
  MA: "NORTHEAST", RI: "NORTHEAST", VT: "NORTHEAST", NH: "NORTHEAST", ME: "NORTHEAST",
  DE: "MIDATLANTIC", MD: "MIDATLANTIC", VA: "MIDATLANTIC", WV: "MIDATLANTIC",
  OH: "MIDWEST",   MI: "MIDWEST",   IN: "MIDWEST",   IL: "MIDWEST",
  WI: "MIDWEST",   MN: "MIDWEST",   IA: "MIDWEST",   MO: "MIDWEST",
  NC: "SOUTHEAST", SC: "SOUTHEAST", GA: "SOUTHEAST", TN: "SOUTHEAST",
  AL: "SOUTHEAST", MS: "SOUTHEAST",
  FL: "FLORIDA",
};

const LANE_RATES: Partial<Record<`${Region}->${Region}`, number>> = {
  "NORTHEAST->NORTHEAST":   4.20,
  "MIDATLANTIC->NORTHEAST": 3.15,
  "NORTHEAST->MIDWEST":     3.35,
  "MIDWEST->NORTHEAST":     3.45,
  "MIDATLANTIC->MIDWEST":   3.30,
  "MIDWEST->MIDWEST":       3.20,
  "FLORIDA->NORTHEAST":     3.60,
  "SOUTHEAST->NORTHEAST":   3.25,
};

function getLaneRate(pickupState: string, deliveryState: string): number {
  const from = STATE_TO_REGION[pickupState.toUpperCase()];
  const to   = STATE_TO_REGION[deliveryState.toUpperCase()];
  if (!from || !to) return 3.5;
  return LANE_RATES[`${from}->${to}`] ?? 3.5;
}

function calcQuote(
  pickup: CityOption | null,
  delivery: CityOption | null,
  temp: TempOption | "",
  weight: string
): { miles: number; low: number; high: number } | null {
  if (
    !pickup?.lat || !pickup?.lng ||
    !delivery?.lat || !delivery?.lng ||
    !temp
  ) return null;

  const miles         = estimateDrivingMiles(pickup.lat, pickup.lng, delivery.lat, delivery.lng);
  const baseRate      = getLaneRate(pickup.state, delivery.state);
  const frozenAdd     = temp === "frozen" ? 0.30 : 0;
  const clampedWeight = Math.max(0, Math.min(parseFloat(weight) || 0, 42000));
  const weightAdd     = (clampedWeight / 42000) * 0.35;
  const finalRate     = baseRate + frozenAdd + weightAdd;
  const quote         = Math.round(miles * finalRate);

  const low = Math.round(quote * 0.92);
  const high = Math.round(quote * 1.08);
  return { miles, low, high };
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function SectionLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[11px] font-bold text-[#0A2540] uppercase tracking-[0.12em] whitespace-nowrap">
        {children}
      </span>
      {optional && (
        <span className="text-[11px] text-slate-400 whitespace-nowrap">optional</span>
      )}
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return hasError
    ? "border-red-300 focus-visible:ring-red-200"
    : "border-slate-200 focus-visible:ring-[#C9A961]/30";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuoteAssistant() {
  const [form, setForm] = useState<FormState>({
    ...BLANK,
    special: { ...BLANK.special },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // String field setter
  const setField = (
    key: "commodity" | "weight" | "pickupDate" | "contactName" | "contactEmail",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setTemp = (t: TempOption) =>
    setForm((prev) => ({ ...prev, temperature: t }));

  const setPickup = (city: CityOption | null) => {
    setForm((prev) => ({ ...prev, pickupLocation: city }));
    if (errors.pickupLocation)
      setErrors((prev) => ({ ...prev, pickupLocation: undefined }));
  };

  const setDelivery = (city: CityOption | null) => {
    setForm((prev) => ({ ...prev, deliveryLocation: city }));
    if (errors.deliveryLocation)
      setErrors((prev) => ({ ...prev, deliveryLocation: undefined }));
  };

  const toggleSpecial = (key: SpecialKey) =>
    setForm((prev) => ({
      ...prev,
      special: { ...prev.special, [key]: !prev.special[key] },
    }));

  const estimate = calcQuote(
    form.pickupLocation,
    form.deliveryLocation,
    form.temperature,
    form.weight
  );

  // Show estimate as soon as we have both cities with coords + temp selected
  const showEstimate = estimate !== null;

  // Show a "select both cities" nudge when temp is chosen but coords aren't ready
  const tempChosen = form.temperature !== "";
  const awaitingCities =
    tempChosen &&
    !showEstimate &&
    (form.pickupLocation !== null || form.deliveryLocation !== null);

  const handleSubmit = () => {
    const newErrors: FormErrors = {};
    if (!form.pickupLocation)          newErrors.pickupLocation  = "Required";
    if (!form.deliveryLocation)        newErrors.deliveryLocation = "Required";
    if (!form.commodity.trim())        newErrors.commodity        = "Required";
    if (!form.weight.trim())           newErrors.weight           = "Required";
    if (!form.pickupDate.trim())       newErrors.pickupDate       = "Required";
    if (!form.contactName.trim())      newErrors.contactName      = "Required";
    if (!form.contactEmail.trim())     newErrors.contactEmail     = "Required";

    if (Object.keys(newErrors).length > 0 || !form.temperature) {
      setErrors(newErrors);
      return;
    }

    console.log("Zon quote request:", {
      pickup:    form.pickupLocation?.label,
      delivery:  form.deliveryLocation?.label,
      commodity: form.commodity,
      temp:      form.temperature,
      weight:    form.weight,
      date:      form.pickupDate,
      contact:   { name: form.contactName, email: form.contactEmail },
      special:   form.special,
      estimate,
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ ...BLANK, special: { ...BLANK.special } });
    setErrors({});
    setSubmitted(false);
  };

  // ── Confirmation ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#C9A961]/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-[#C9A961]" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0A2540] mb-2">
            Got it, {form.contactName}.
          </h3>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Paolo will email you a firm quote at{" "}
            <span className="font-semibold text-[#0A2540]">
              {form.contactEmail}
            </span>{" "}
            within 1 business hour.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="mt-2 text-sm text-slate-400 underline underline-offset-4 hover:text-[#0A2540] transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Section 1: Route ── */}
      <div>
        <SectionLabel>Route</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Pickup city + state" error={errors.pickupLocation}>
            <CityAutocomplete
              value={form.pickupLocation}
              onChange={setPickup}
              placeholder="e.g. Chicago, IL"
              hasError={!!errors.pickupLocation}
            />
          </Field>
          <Field label="Delivery city + state" error={errors.deliveryLocation}>
            <CityAutocomplete
              value={form.deliveryLocation}
              onChange={setDelivery}
              placeholder="e.g. Boston, MA"
              hasError={!!errors.deliveryLocation}
            />
          </Field>
        </div>
      </div>

      {/* ── Section 2: Load Details ── */}
      <div>
        <SectionLabel>Load Details</SectionLabel>
        <div className="space-y-4">
          <Field label="Commodity" error={errors.commodity}>
            <Input
              placeholder="e.g. Frozen seafood, dairy, fresh produce…"
              value={form.commodity}
              onChange={(e) => setField("commodity", e.target.value)}
              className={inputCls(!!errors.commodity)}
            />
          </Field>

          <div>
            <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Temperature requirement
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMP_OPTIONS.map((opt) => {
                const active = form.temperature === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTemp(opt.value)}
                    className={`flex flex-col items-start rounded-lg border-2 px-4 py-3 text-left transition-all ${
                      active
                        ? "border-[#C9A961] bg-[#0A2540]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${active ? "text-white" : "text-slate-700"}`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`mt-0.5 text-xs ${active ? "text-[#C9A961]" : "text-slate-400"}`}
                    >
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Weight (lbs)" error={errors.weight}>
              <Input
                type="number"
                placeholder="e.g. 42,000"
                value={form.weight}
                onChange={(e) => setField("weight", e.target.value)}
                className={inputCls(!!errors.weight)}
              />
            </Field>
            <Field label="Target pickup date" error={errors.pickupDate}>
              <Input
                type="date"
                value={form.pickupDate}
                onChange={(e) => setField("pickupDate", e.target.value)}
                className={inputCls(!!errors.pickupDate)}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Section 3: Special Handling ── */}
      <div>
        <SectionLabel optional>Special Handling</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_OPTIONS.map((opt) => {
            const active = form.special[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleSpecial(opt.key)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-[#0A2540] bg-[#0A2540] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: Contact ── */}
      <div>
        <SectionLabel>Contact</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your name" error={errors.contactName}>
            <Input
              placeholder="First and last name"
              value={form.contactName}
              onChange={(e) => setField("contactName", e.target.value)}
              className={inputCls(!!errors.contactName)}
            />
          </Field>
          <Field label="Email address" error={errors.contactEmail}>
            <Input
              type="email"
              placeholder="you@company.com"
              value={form.contactEmail}
              onChange={(e) => setField("contactEmail", e.target.value)}
              className={inputCls(!!errors.contactEmail)}
            />
          </Field>
        </div>
      </div>

      {/* ── Estimate card ── */}
      {showEstimate && (
        <div
          className="rounded-xl bg-[#0A2540] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#C9A961] mb-1">
              Estimated Ballpark
            </p>
            <p className="text-3xl font-black tracking-tight text-white">
              ${estimate.low.toLocaleString()}{" "}
              <span className="text-xl font-normal text-slate-400">–</span>{" "}
              ${estimate.high.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              ~{estimate.miles.toLocaleString()} mi estimated route
            </p>
          </div>
          <p className="text-xs leading-relaxed text-slate-400 sm:max-w-[200px]">
            Ballpark estimate only. Final rate confirmed by Paolo after review.
          </p>
        </div>
      )}

      {/* Nudge when temp is chosen but cities are missing coords */}
      {awaitingCities && !showEstimate && (
        <p className="text-center text-xs text-slate-400">
          Select both cities above to see a distance-based estimate.
        </p>
      )}

      {/* ── Submit ── */}
      <div className="space-y-3 pt-1">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-[#C9A961] hover:bg-[#b8963c] text-[#0A2540] font-bold h-12 text-base"
        >
          Get My Ballpark Quote
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-center text-xs text-slate-400">
          Direct reefer carrier &bull; Northeast + Midwest focus &bull; No broker chain
        </p>
      </div>
    </div>
  );
}
