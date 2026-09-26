"use client";

import { useState, useEffect } from "react";
import { AdSlot } from "./AdSlot";
import { X } from "lucide-react";

interface StickyBottomAnchorProps {
  category?: string;
  slug?: string;
}

export function StickyBottomAnchor({
  category,
  slug,
}: StickyBottomAnchorProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem("logpipeline_anchor_dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("logpipeline_anchor_dismissed", "true");
    } catch {
      // Ignore sessionStorage errors
    }
  };

  if (!hasMounted || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800 shadow-2xl py-2 px-3 transition-transform duration-300">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3 relative">
        {/* Ad Container */}
        <div className="flex-1 flex justify-center items-center">
          <AdSlot
            slotId="bottom-anchor"
            category={category}
            slug={slug}
            className="w-full max-w-[728px]"
          />
        </div>

        {/* Clean Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-3 right-0 sm:top-1 sm:right-1 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 shadow-md transition-colors"
          title="Dismiss ad banner"
          aria-label="Dismiss bottom ad banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
