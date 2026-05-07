"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onOpenQuote: () => void;
}

export default function HeroVideoSplit({ onOpenQuote }: Props) {
  return (
    <section
      className="bg-[#0A2540] text-white flex items-center min-h-[85vh] px-6 py-20"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">

        {/* Left: headline + CTAs */}
        <div>
          <p className="text-[#C9A961] text-xs font-bold tracking-widest uppercase mb-6">
            Refrigerated Freight &bull; Direct Carrier
          </p>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-8">
            Reefer freight you can trust.{" "}
            <span className="text-[#C9A961]">Quotes in minutes, not days.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Direct-shipper refrigerated trucking across the Northeast and Midwest
            — and anywhere your freight needs to go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={onOpenQuote}
              className="bg-[#C9A961] hover:bg-[#b8963c] text-[#0A2540] font-semibold px-8 h-12 text-base"
            >
              Get an Instant Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href="mailto:paolo@zonlogistics.com" className="sm:w-auto w-full">
              <Button
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#0A2540] px-8 h-12 text-base w-full transition-colors"
              >
                Email Us
              </Button>
            </a>
          </div>
        </div>

        {/* Right: video — stacks below text on mobile */}
        <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl">
          {/* Video — hidden when user prefers reduced motion */}
          <video
            className="w-full h-full object-cover motion-reduce:hidden"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/truck-poster.jpg"
            aria-label="Aerial drone shot of semi-truck at loading dock"
          >
            <source src="/Videos/truck-hero.mp4.mp4" type="video/mp4" />
            <source src="/videos/truck-hero.webm" type="video/webm" />
          </video>
          {/* Static poster — reduced motion fallback */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/truck-poster.jpg"
            alt="Aerial drone shot of semi-truck at loading dock"
            className="w-full h-full object-cover motion-safe:hidden"
          />
        </div>

      </div>
    </section>
  );
}
