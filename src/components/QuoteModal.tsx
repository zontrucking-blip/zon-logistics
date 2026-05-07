"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import QuoteAssistant from "@/components/QuoteAssistant";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-full p-0 gap-0 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Fixed header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-slate-200 bg-white">
          <DialogTitle className="text-2xl font-bold text-[#0A2540] leading-tight">
            Get an Instant Reefer Quote
          </DialogTitle>
          <p className="text-slate-500 text-sm mt-1.5">
            Tell us about your load and get a ballpark rate in under a minute.
          </p>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#FAFAFA]">
          <QuoteAssistant />
        </div>
      </DialogContent>
    </Dialog>
  );
}
