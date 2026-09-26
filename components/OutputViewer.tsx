"use client";

import { useState, useMemo } from "react";
import { LineMatchResult } from "../workers/parser.worker";
import { getFieldColorTheme } from "../lib/engine/colors";
import {
  generateFluentBitConfig,
  generateVectorConfig,
  generateDatadogConfig,
  generateLogstashConfig,
  generateOtelConfig,
  ExporterField,
} from "../lib/engine/exporters";
import {
  Braces,
  Regex,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Layers,
  ChevronDown,
  Terminal,
  Workflow,
  Cpu,
  Boxes,
} from "lucide-react";

export type OutputTab =
  | "json"
  | "regex"
  | "fluentbit"
  | "vector"
  | "datadog"
  | "logstash"
  | "otel"
  | "schema";

interface OutputViewerProps {
  pattern?: string;
  transpiledRegex: string;
  results: LineMatchResult[];
  totalExecutionTimeMs: number;
  reDosWarning: boolean;
  matchedCount: number;
  totalCount: number;
  fields?: ExporterField[];
}

export function OutputViewer({
  pattern = "",
  transpiledRegex,
  results,
  totalExecutionTimeMs,
  reDosWarning,
  matchedCount,
  totalCount,
  fields = [],
}: OutputViewerProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>("json");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number>(0);

  const matchedLines = results.filter((r) => r.isMatch);
  const currentLine = matchedLines[selectedLineIdx] || matchedLines[0] || results[0];

  // Derive fields if not passed explicitly
  const effectiveFields: ExporterField[] = useMemo(() => {
    if (fields && fields.length > 0) return fields;
    if (currentLine?.groups) {
      return Object.entries(currentLine.groups).map(([name, val]) => ({
        name,
        type: typeof val === "number" ? (Number.isInteger(val) ? "integer" : "float") : typeof val,
      }));
    }
    return [];
  }, [fields, currentLine]);

  // Pre-generate exporter configurations
  const exporterConfigs = useMemo(() => {
    const input = {
      pattern,
      compiledRegex: transpiledRegex,
      fields: effectiveFields,
    };

    return {
      fluentbit: generateFluentBitConfig(input),
      vector: generateVectorConfig(input),
      datadog: generateDatadogConfig(input),
      logstash: generateLogstashConfig(input),
      otel: generateOtelConfig(input),
    };
  }, [pattern, transpiledRegex, effectiveFields]);

  const jsonString = currentLine?.groups
    ? JSON.stringify(currentLine.groups, null, 2)
    : "{}";

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      });
    }
  };

  const getContentForCopy = (tab: OutputTab): string => {
    switch (tab) {
      case "json":
        return jsonString;
      case "regex":
        return transpiledRegex;
      case "fluentbit":
        return exporterConfigs.fluentbit;
      case "vector":
        return exporterConfigs.vector;
      case "datadog":
        return exporterConfigs.datadog;
      case "logstash":
        return exporterConfigs.logstash;
      case "otel":
        return exporterConfigs.otel;
      case "schema":
        return JSON.stringify(effectiveFields, null, 2);
    }
  };

  const tabs: Array<{ id: OutputTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "json", label: "JSON", icon: <Braces className="w-3.5 h-3.5" /> },
    { id: "regex", label: "RegExp", icon: <Regex className="w-3.5 h-3.5" /> },
    { id: "fluentbit", label: "Fluent Bit", icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: "vector", label: "Vector VRL", icon: <Workflow className="w-3.5 h-3.5" /> },
    { id: "datadog", label: "Datadog", icon: <Boxes className="w-3.5 h-3.5" /> },
    { id: "logstash", label: "Logstash", icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: "otel", label: "OpenTelemetry", icon: <Cpu className="w-3.5 h-3.5" /> },
    {
      id: "schema",
      label: "Schema",
      icon: <Layers className="w-3.5 h-3.5" />,
      badge: String(effectiveFields.length),
    },
  ];

  return (
    <section className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-full min-h-[420px]">
      {/* Pane Tabs Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto gap-2">
        <div className="flex items-center gap-1 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Copy Button & Sample Line Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === "json" && matchedLines.length > 1 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
              <span>Sample:</span>
              <select
                value={selectedLineIdx}
                onChange={(e) => setSelectedLineIdx(Number(e.target.value))}
                className="bg-transparent text-slate-200 font-mono text-[11px] focus:outline-none cursor-pointer"
              >
                {matchedLines.map((l, i) => (
                  <option key={i} value={i} className="bg-slate-900 text-slate-200">
                    Line {l.lineIndex + 1}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>
          )}

          <button
            type="button"
            onClick={() => handleCopy(getContentForCopy(activeTab), activeTab)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors shadow-sm"
          >
            {copied === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium">Copy Config</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-auto bg-slate-950/80 p-3.5 font-mono text-xs">
        {activeTab === "json" && (
          <div>
            {currentLine?.isMatch ? (
              <pre className="text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-text">
                {jsonString}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-500">
                No matching lines available to generate JSON output.
              </div>
            )}
          </div>
        )}

        {activeTab === "regex" && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 break-all leading-relaxed text-cyan-200 font-mono text-xs select-text">
              /{transpiledRegex}/d
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              <strong className="text-slate-300">Flags:</strong> Compiled with JavaScript{" "}
              <code className="text-cyan-400 font-mono">/d</code> (hasIndices) flag for character slice mapping.
            </div>
          </div>
        )}

        {activeTab === "fluentbit" && (
          <pre className="text-cyan-200/90 whitespace-pre-wrap leading-relaxed select-text">
            {exporterConfigs.fluentbit}
          </pre>
        )}

        {activeTab === "vector" && (
          <pre className="text-emerald-200/90 whitespace-pre-wrap leading-relaxed select-text">
            {exporterConfigs.vector}
          </pre>
        )}

        {activeTab === "datadog" && (
          <pre className="text-amber-200/90 whitespace-pre-wrap leading-relaxed select-text">
            {exporterConfigs.datadog}
          </pre>
        )}

        {activeTab === "logstash" && (
          <pre className="text-violet-200/90 whitespace-pre-wrap leading-relaxed select-text">
            {exporterConfigs.logstash}
          </pre>
        )}

        {activeTab === "otel" && (
          <pre className="text-sky-200/90 whitespace-pre-wrap leading-relaxed select-text">
            {exporterConfigs.otel}
          </pre>
        )}

        {activeTab === "schema" && (
          <div className="space-y-2">
            <div className="text-slate-400 text-[11px] mb-2">
              Detected fields and target types from pattern:
            </div>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
              {effectiveFields.map((field) => {
                const val = currentLine?.groups ? currentLine.groups[field.name] : undefined;
                const theme = getFieldColorTheme(field.name);
                return (
                  <div
                    key={field.name}
                    className="flex items-center justify-between p-2.5 bg-slate-900/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                      >
                        {field.name}
                      </span>
                      <span className="text-slate-500 text-[11px] uppercase font-mono">
                        {field.type}
                      </span>
                    </div>
                    {val !== undefined && (
                      <div className="text-slate-300 font-mono max-w-xs truncate text-[11px]">
                        {JSON.stringify(val)}
                      </div>
                    )}
                  </div>
                );
              })}
              {effectiveFields.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs">
                  No capture fields identified yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <footer className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>
              Parsed <strong className="text-slate-200">{matchedCount}/{totalCount}</strong> lines
            </span>
          </span>

          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              <strong className="text-slate-200">{totalExecutionTimeMs} ms</strong> ({Math.round(totalExecutionTimeMs * 1000)} μs)
            </span>
          </span>
        </div>

        {/* ReDoS Risk Indicator */}
        <div className="flex items-center gap-1.5">
          {reDosWarning ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ReDoS Risk: WARNING (Timeout Exceeded)
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ReDoS Risk: SAFE
            </span>
          )}
        </div>
      </footer>
    </section>
  );
}
