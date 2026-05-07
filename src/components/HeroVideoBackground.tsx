"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onOpenQuote: () => void;
}

export default function HeroVideoBackground({ onOpenQuote }: Props) {
  return (
    <section
      className="relative flex items-center min-h-[85vh] px-6 py-20 overflow-hidden bg-[#0A2540]"
    >
      {/* Background video — hidden when user prefers reduced motion */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover motion-reduce:hidden"
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

      {/* Static poster — shown only when reduced motion is preferred */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center motion-safe:hidden"
        style={{ backgroundImage: "url('/images/truck-poster.jpg')" }}
        aria-hidden="true"
      />

      {/* Gradient overlay: ~20% opacity top → ~40% bottom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.40) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[2] max-w-4xl mx-auto w-full">
        <p className="text-[#C9A961] text-xs font-bold tracking-widest uppercase mb-6">
          Refrigerated Freight &bull; Direct Carrier
        </p>
        <h1 className="text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-8 max-w-3xl text-white">
          Reefer freight you can trust.{" "}
          <span className="text-[#C9A961]">Quotes in minutes, not days.</span>
        </h1>
        <p className="text-xl text-slate-200 mb-12 max-w-[580px] leading-relaxed">
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
    </section>
  );
}
