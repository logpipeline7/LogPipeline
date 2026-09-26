"use client";

import { useEffect, useRef, useState } from "react";
import {
  AD_SLOTS,
  AdSlotId,
  getContextualTargeting,
  GoogletagSlot,
} from "../../lib/ads/config";
import { ActiveRefreshController } from "../../lib/ads/refreshController";
import { B2BFallbackCard } from "./B2BFallbackCard";

interface AdSlotProps {
  slotId: AdSlotId;
  category?: string;
  slug?: string;
  className?: string;
}

export function AdSlot({
  slotId,
  category,
  slug,
  className = "",
}: AdSlotProps) {
  const slotDef = AD_SLOTS[slotId];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotElementId = `gpt-slot-${slotId}`;

  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let gptSlotInstance: GoogletagSlot | null = null;
    const refreshController = ActiveRefreshController.getInstance();

    // 1.5-second AdBlock Detection Probe
    timeoutId = setTimeout(() => {
      if (!window.googletag || !window.googletag.pubads) {
        setIsBlocked(true);
      } else {
        // Also check if adblock CSS hidden rule applied
        const el = document.getElementById(slotElementId);
        if (el && (el.offsetHeight === 0 || window.getComputedStyle(el).display === "none")) {
          setIsBlocked(true);
        }
      }
    }, 1500);

    // Initialize GPT Slot if window is present
    if (typeof window !== "undefined") {
      window.googletag = window.googletag || { cmd: [] };

      window.googletag.cmd.push(() => {
        try {
          if (!window.googletag?.defineSlot) {
            setIsBlocked(true);
            return;
          }

          // Check if slot already exists to prevent duplicate slot definition errors
          const existingSlot = gptSlotInstance;
          if (existingSlot) {
            return;
          }

          const slot = window.googletag.defineSlot(
            slotDef.gptPath,
            slotDef.sizes,
            slotElementId
          );

          if (!slot) {
            setIsBlocked(true);
            return;
          }

          gptSlotInstance = slot;

          // Apply contextual B2B targeting
          const targeting = getContextualTargeting(category, slug);
          Object.entries(targeting).forEach(([key, val]) => {
            slot.setTargeting(key, val);
          });

          const pubads = window.googletag.pubads?.();
          if (pubads) {
            slot.addService(pubads);
          }

          window.googletag.display?.(slotElementId);
          setIsLoaded(true);

          // Register with Active Refresh Controller for 30s viewability-gated refreshes
          if (containerRef.current) {
            refreshController.registerSlot(slotId, containerRef.current, slot);
          }
        } catch {
          setIsBlocked(true);
        }
      });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      refreshController.unregisterSlot(slotId);

      if (gptSlotInstance && window.googletag?.destroySlots) {
        window.googletag.cmd.push(() => {
          try {
            if (gptSlotInstance) {
              window.googletag?.destroySlots?.([gptSlotInstance]);
            }
          } catch {
            // Ignore cleanup errors
          }
        });
      }
    };
  }, [slotId, slotDef, slotElementId, category, slug]);

  // Dimension styles for strictly 0.00 CLS layout preservation
  const minHeightStyle = {
    minHeight: `${slotDef.minHeight}px`,
    minWidth: `${slotDef.minWidth}px`,
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center transition-all ${slotDef.className} ${className}`}
      style={minHeightStyle}
    >
      {isBlocked ? (
        // Native B2B Sponsorship Fallback when AdBlock is active or GPT times out
        <div className="w-full h-full">
          <B2BFallbackCard slotId={slotId} />
        </div>
      ) : (
        // Standard Display Ad Container with Micro-Label
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800/60 rounded-xl p-2 relative overflow-hidden">
          {/* Micro Caption */}
          <div className="w-full flex items-center justify-between pb-1.5 px-2 border-b border-slate-800/40 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Advertisement
            </span>
            <span className="text-[9px] font-mono text-slate-600">
              Active Viewability 30s
            </span>
          </div>

          {/* GPT Target Container */}
          <div
            id={slotElementId}
            className="flex items-center justify-center mx-auto"
            style={{ minHeight: `${slotDef.minHeight - 24}px` }}
          />
        </div>
      )}
    </div>
  );
}
