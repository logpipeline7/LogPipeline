"use client";

import { useState } from "react";
import Link from "next/link";
import { LOG_PRESETS } from "../lib/engine/presets";
import { Share2, Check, Sparkles, Terminal, FileCode2, BookOpen } from "lucide-react";

interface TopNavigationProps {
  selectedPresetId?: string;
  onSelectPreset?: (id: string) => void;
  onShare?: () => string;
}

export function TopNavigation({
  selectedPresetId,
  onSelectPreset,
  onShare,
}: TopNavigationProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!onShare) return;
    const shareUrl = onShare();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white font-mono group-hover:text-cyan-300 transition-colors">
              LogPipeline<span className="text-cyan-400">.dev</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 tracking-tight">
            Log Extraction & Pipeline Architect
          </p>
        </div>
      </Link>

      {/* Preset Selector & Action Toolbar */}
      <div className="flex items-center gap-3">
        {/* Templates Directory Link */}
        <Link
          href="/directory"
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>50 Templates Catalog</span>
        </Link>

        {onSelectPreset && selectedPresetId !== undefined && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Presets:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {LOG_PRESETS.map((preset) => (
                <option
                  key={preset.id}
                  value={preset.id}
                  className="bg-slate-900 text-slate-200"
                >
                  {preset.name}
                </option>
              ))}
              {selectedPresetId === "custom" && (
                <option value="custom" className="bg-slate-900 text-slate-200">
                  Custom Configuration
                </option>
              )}
            </select>
          </div>
        )}

        {/* Share Button */}
        {onShare && (
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              copied
                ? "bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm shadow-emerald-900"
                : "bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-700/80 hover:border-cyan-600 hover:text-white"
            }`}
            title="Compress pattern and sample logs into a shareable URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Share Config</span>
              </>
            )}
          </button>
        )}

        <div className="hidden xl:flex items-center gap-1.5 text-slate-500 text-xs pl-2 border-l border-slate-800">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Multi-Collector Exporters Active</span>
        </div>
      </div>
    </header>
  );
}
