"use client";

import { useMemo } from "react";
import {
  B2B_SPONSORSHIP_OFFERS,
  B2BSponsorshipOffer,
  AdSlotId,
} from "../../lib/ads/config";
import {
  ExternalLink,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface B2BFallbackCardProps {
  slotId: AdSlotId;
  offerIndex?: number;
}

export function B2BFallbackCard({ slotId, offerIndex }: B2BFallbackCardProps) {
  // Deterministically select or rotate offer based on slotId
  const offer: B2BSponsorshipOffer = useMemo(() => {
    if (offerIndex !== undefined) {
      return B2B_SPONSORSHIP_OFFERS[offerIndex % B2B_SPONSORSHIP_OFFERS.length];
    }
    const idx = slotId === "sidebar-left" || slotId === "mid-content" ? 0 : 1;
    return B2B_SPONSORSHIP_OFFERS[idx];
  }, [slotId, offerIndex]);

  const isSidebar = slotId === "sidebar-left" || slotId === "sidebar-right";
  const isMidContent = slotId === "mid-content";
  const isBottomAnchor = slotId === "bottom-anchor";

  // 1. Horizontal Leaderboard Format (728x90 / 970x90)
  if (isMidContent) {
    return (
      <div className="w-full h-[90px] rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 p-3 sm:p-4 flex items-center justify-between gap-4 overflow-hidden relative group hover:border-cyan-700/60 transition-colors">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-full bg-cyan-500/5 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
            {offer.id === "digitalocean" ? (
              <Server className="w-5 h-5 text-cyan-400" />
            ) : (
              <Activity className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                {offer.sponsor}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                {offer.badge}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Sponsored
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
              {offer.headline}
            </h4>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {offer.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Special Developer Offer
            </span>
            <span className="text-xs font-bold text-slate-200">{offer.perk}</span>
          </div>
          <a
            href={offer.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/50 whitespace-nowrap transition-colors"
          >
            <span>{offer.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. Compact Bottom Anchor Format (728x90 desktop / 320x50 mobile)
  if (isBottomAnchor) {
    return (
      <div className="w-full h-full flex items-center justify-between gap-3 px-3 py-1.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 flex-shrink-0">
            Sponsored
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-white truncate">
              {offer.sponsor}:
            </span>
            <span className="text-xs text-cyan-300 font-medium truncate hidden sm:inline">
              {offer.perk}
            </span>
          </div>
        </div>

        <a
          href={offer.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs whitespace-nowrap transition-colors flex-shrink-0"
        >
          <span>Claim Offer</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // 3. Vertical Skyscraper Format (300x600 / 300x250 / 160x600)
  return (
    <div className="w-full h-full min-h-[480px] rounded-xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative group hover:border-cyan-700/60 transition-colors shadow-xl">
      {/* Background Accent Gradient */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              {offer.id === "digitalocean" ? (
                <Server className="w-4 h-4 text-cyan-400" />
              ) : (
                <Activity className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <span className="font-mono text-xs font-bold text-white">
              {offer.sponsor}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Sponsored
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="inline-flex self-start px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            {offer.badge}
          </span>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
            {offer.headline}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {offer.description}
          </p>
        </div>

        {/* Feature Checkpoints */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>High IOPS NVMe SSD storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Zero bandwidth surprise egress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>1-Click Docker & Kubernetes setup</span>
          </div>
        </div>
      </div>

      {/* Bottom Perk Banner & CTA */}
      <div className="flex flex-col gap-3 relative z-10 pt-4 border-t border-slate-800">
        <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-900/40 flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
            Exclusive Developer Perk
          </span>
          <span className="text-xs font-extrabold text-white">
            {offer.perk}
          </span>
        </div>

        <a
          href={offer.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 group-hover:scale-[1.02] transition-all"
        >
          <span>{offer.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <span className="text-[9px] font-mono text-center text-slate-500">
          Supports open-source LogPipeline development
        </span>
      </div>
    </div>
  );
}
