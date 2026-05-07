"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DriveWithUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [years, setYears] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Driver application:", { name, email, years });
    setSubmitted(true);
  };

  return (
    <section id="drive" className="bg-[#0A2540] py-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[#C9A961] text-xs font-bold tracking-widest uppercase mb-4">
            Join the Fleet
          </p>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Drive for Zon.
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            We&apos;re growing. If you&apos;re an experienced reefer driver running
            Northeast or Midwest lanes and you&apos;re tired of being a number,
            let&apos;s talk. Owner-involved operation, direct dispatch, fair pay.
          </p>
        </div>

        <div>
          {submitted ? (
            <div className="bg-white/10 border border-white/15 rounded-xl p-8">
              <p className="font-semibold text-white text-lg mb-2">
                Thanks, {name}.
              </p>
              <p className="text-slate-300">
                Paolo will reach out within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="driver-name"
                  className="text-slate-300 text-sm block mb-1.5"
                >
                  Name
                </Label>
                <Input
                  id="driver-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#C9A961]"
                />
              </div>
              <div>
                <Label
                  htmlFor="driver-email"
                  className="text-slate-300 text-sm block mb-1.5"
                >
                  Email
                </Label>
                <Input
                  id="driver-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#C9A961]"
                />
              </div>
              <div>
                <Label
                  htmlFor="driver-years"
                  className="text-slate-300 text-sm block mb-1.5"
                >
                  Years of experience
                </Label>
                <Input
                  id="driver-years"
                  type="number"
                  min="0"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  required
                  placeholder="e.g. 5"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#C9A961]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#C9A961] hover:bg-[#b8963c] text-[#0A2540] font-semibold mt-2"
              >
                Apply Now
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
