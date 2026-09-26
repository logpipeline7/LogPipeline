"use client";

import { useState } from "react";
import { LineMatchResult } from "../workers/parser.worker";
import { getFieldColorTheme } from "../lib/engine/colors";
import { FileText, CheckCircle2, XCircle, Eye, Edit3, AlertCircle } from "lucide-react";

interface RawLogEditorProps {
  rawLogs: string;
  onChangeLogs: (val: string) => void;
  results: LineMatchResult[];
  matchedCount: number;
  totalCount: number;
}

export function RawLogEditor({
  rawLogs,
  onChangeLogs,
  results,
  matchedCount,
  totalCount,
}: RawLogEditorProps) {
  const [activeTab, setActiveTab] = useState<"highlight" | "edit">("highlight");
  const [selectedErrorLine, setSelectedErrorLine] = useState<number | null>(null);

  // Render a single line with color-highlighted slices based on indices
  const renderHighlightedLine = (lineResult: LineMatchResult) => {
    const { rawText, isMatch, indices, failedAtChar } = lineResult;

    if (!isMatch) {
      if (failedAtChar !== undefined && failedAtChar > 0) {
        const matchedPrefix = rawText.slice(0, failedAtChar);
        const brokenChar = rawText.slice(failedAtChar, failedAtChar + 1);
        const rest = rawText.slice(failedAtChar + 1);
        return (
          <span className="font-mono text-xs">
            <span className="text-slate-400">{matchedPrefix}</span>
            <span
              className="bg-rose-500/40 text-rose-200 border-b-2 border-rose-500 font-bold px-0.5 rounded cursor-pointer"
              title={`Match broken at char ${failedAtChar}`}
            >
              {brokenChar || "↵"}
            </span>
            <span className="text-rose-400/60 line-through decoration-rose-500/40">{rest}</span>
          </span>
        );
      }
      return <span className="font-mono text-xs text-rose-300/80">{rawText}</span>;
    }

    if (indices.length === 0) {
      return <span className="font-mono text-xs text-emerald-300">{rawText}</span>;
    }

    // Sort index intervals ascending by start position
    const sorted = [...indices].sort((a, b) => a.start - b.start);
    const elements: React.ReactNode[] = [];
    let cur = 0;

    sorted.forEach((item, i) => {
      // Uncaptured delimiter/whitespace between groups
      if (item.start > cur) {
        elements.push(
          <span key={`gap-${i}`} className="text-slate-400 font-mono text-xs">
            {rawText.slice(cur, item.start)}
          </span>
        );
      }

      const tokenText = rawText.slice(item.start, item.end);
      const theme = getFieldColorTheme(item.field);

      elements.push(
        <span
          key={`token-${item.field}-${i}`}
          className={`font-mono text-xs px-1 py-0.5 rounded font-semibold transition-all relative group cursor-pointer ${theme.highlightBg} ${theme.highlightText} ${theme.highlightBorder}`}
          title={`${item.field}: "${tokenText}"`}
        >
          {tokenText}
          <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 text-cyan-300 rounded shadow-lg whitespace-nowrap z-20">
            {item.field}
          </span>
        </span>
      );

      cur = Math.max(cur, item.end);
    });

    // Trailing uncaptured text
    if (cur < rawText.length) {
      elements.push(
        <span key="trailing" className="text-slate-400 font-mono text-xs">
          {rawText.slice(cur)}
        </span>
      );
    }

    return <div className="inline-flex flex-wrap items-center gap-0.5">{elements}</div>;
  };

  const lines = rawLogs.split(/\r?\n/).slice(0, 50);

  return (
    <section className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-full min-h-[380px]">
      {/* Pane Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Raw Log Stream Sandbox
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ({matchedCount}/{totalCount} matched)
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("highlight")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "highlight"
                ? "bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/80"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "edit"
                ? "bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/80"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Input</span>
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-auto bg-slate-950/60 p-2 font-mono text-xs">
        {activeTab === "edit" ? (
          <div className="relative flex min-h-full">
            {/* Line numbers gutter */}
            <div className="select-none pr-3 pl-1 text-right text-slate-600 border-r border-slate-800/80 leading-6">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              value={rawLogs}
              onChange={(e) => onChangeLogs(e.target.value)}
              placeholder="Paste raw log lines here (up to 50 lines)..."
              className="flex-1 bg-transparent text-slate-200 pl-3 leading-6 focus:outline-none resize-none font-mono text-xs whitespace-pre"
              rows={Math.max(12, lines.length)}
              spellCheck={false}
            />
          </div>
        ) : (
          /* Highlighted Inspector Mode */
          <div className="space-y-1.5">
            {results.map((res) => {
              const isSelectedError = selectedErrorLine === res.lineIndex;
              return (
                <div
                  key={res.lineIndex}
                  className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors border ${
                    res.isMatch
                      ? "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
                      : "bg-rose-950/20 border-rose-900/40 hover:border-rose-700"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono w-5 text-right select-none">
                      {res.lineIndex + 1}
                    </span>
                    {res.isMatch ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>MATCHED</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedErrorLine(isSelectedError ? null : res.lineIndex)
                        }
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors"
                        title="Click to view breakdown"
                      >
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>NO MATCH</span>
                      </button>
                    )}
                  </div>

                  {/* Highlighted Log Content */}
                  <div className="flex-1 overflow-x-auto py-0.5 leading-relaxed">
                    {renderHighlightedLine(res)}
                  </div>

                  {/* Execution microsecond counter */}
                  {res.executionTimeUs > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 pt-1">
                      {res.executionTimeUs}μs
                    </span>
                  )}
                </div>
              );
            })}

            {results.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                No log lines provided. Paste lines or select a preset above.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Error Diagnostic Drawer */}
      {selectedErrorLine !== null && results[selectedErrorLine] && (
        <div className="bg-rose-950/70 border-t border-rose-800/80 p-2.5 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>
              Line {selectedErrorLine + 1} failed to match pattern.
              {results[selectedErrorLine].failedAtChar !== undefined && (
                <span className="ml-1 text-rose-300 font-mono">
                  Prefix matched up to character position{" "}
                  <strong>{results[selectedErrorLine].failedAtChar}</strong>.
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedErrorLine(null)}
            className="text-[11px] text-rose-300 hover:text-white underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </section>
  );
}
