"use client";

import { useMemo } from "react";
import { useLogPipeline } from "../hooks/useLogPipeline";
import { TopNavigation } from "../components/TopNavigation";
import { PatternInputBar } from "../components/PatternInputBar";
import { RawLogEditor } from "../components/RawLogEditor";
import { OutputViewer } from "../components/OutputViewer";
import { transpilePattern } from "../lib/engine/transpiler";

export default function Home() {
  const {
    pattern,
    setPattern,
    rawLogs,
    setRawLogs,
    selectedPresetId,
    loadPreset,
    output,
    isProcessing,
    generateShareUrl,
  } = useLogPipeline();

  // Instant client-side transpilation for immediate token typing feedback
  const transpileResult = useMemo(() => {
    return transpilePattern(pattern);
  }, [pattern]);

  const results = output?.results || [];
  const matchedCount = output?.matchedCount || 0;
  const totalCount = output?.totalCount || (rawLogs ? rawLogs.split(/\r?\n/).length : 0);
  const totalExecutionTimeMs = output?.totalExecutionTimeMs || 0;
  const reDosWarning = output?.reDosWarning || false;
  const transpiledRegex = output?.transpiledRegex || transpileResult.regexString || "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <TopNavigation
        selectedPresetId={selectedPresetId}
        onSelectPreset={loadPreset}
        onShare={generateShareUrl}
      />

      {/* Main Workbench Body */}
      <main className="flex-1 flex flex-col p-3 md:p-4 gap-3 max-w-[1720px] w-full mx-auto">
        {/* Pane 2: Pattern Input Bar & Macro Autocomplete */}
        <PatternInputBar
          pattern={pattern}
          onChange={setPattern}
          transpileResult={transpileResult}
          isProcessing={isProcessing}
        />

        {/* 2-Column Split: Pane 1 (Raw Logs) & Pane 3 (Live Output) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[460px]">
          {/* Pane 1: Raw Log Stream Sandbox */}
          <RawLogEditor
            rawLogs={rawLogs}
            onChangeLogs={setRawLogs}
            results={results}
            matchedCount={matchedCount}
            totalCount={totalCount}
          />

          {/* Pane 3: Extracted JSON, RegExp & Performance Benchmarks */}
          <OutputViewer
            pattern={pattern}
            transpiledRegex={transpiledRegex}
            results={results}
            totalExecutionTimeMs={totalExecutionTimeMs}
            reDosWarning={reDosWarning}
            matchedCount={matchedCount}
            totalCount={totalCount}
            fields={transpileResult.fields.map((f) => ({
              name: f.name,
              type: f.dataType,
            }))}
          />
        </div>

        {/* Featured Production Templates Catalog Banner */}
        <section className="mt-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                50 Production Templates
              </span>
              <span className="text-xs text-slate-400 font-medium">
                AWS • NGINX • Postgres • Kafka • Kubernetes • Fortinet
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Need pre-built Grok patterns for your cloud or container stack?
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Explore 50 production-verified log templates with instant configuration generators for
              Fluent Bit, Vector VRL, Datadog Pipelines, and OpenTelemetry Collector.
            </p>
          </div>
          <a
            href="/directory"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-cyan-950/40 transition-colors"
          >
            <span>Explore 50 Templates Catalog</span>
            <span>→</span>
          </a>
        </section>
      </main>
    </div>
  );
}
