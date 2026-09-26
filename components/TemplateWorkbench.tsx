"use client";

import { useMemo } from "react";
import { useLogPipeline } from "../hooks/useLogPipeline";
import { PatternInputBar } from "./PatternInputBar";
import { RawLogEditor } from "./RawLogEditor";
import { OutputViewer } from "./OutputViewer";
import { transpilePattern } from "../lib/engine/transpiler";
import { RotateCcw, Share2, Check } from "lucide-react";
import { useState } from "react";

interface TemplateWorkbenchProps {
  initialPattern: string;
  initialLogs: string;
  templateTitle: string;
  templateCategory: string;
}

export function TemplateWorkbench({
  initialPattern,
  initialLogs,
  templateTitle,
  templateCategory,
}: TemplateWorkbenchProps) {
  const {
    pattern,
    setPattern,
    rawLogs,
    setRawLogs,
    output,
    isProcessing,
    generateShareUrl,
  } = useLogPipeline({
    initialPattern,
    initialLogs,
    initialPresetId: templateCategory,
  });

  const [copiedShare, setCopiedShare] = useState(false);

  const transpileResult = useMemo(() => {
    return transpilePattern(pattern);
  }, [pattern]);

  const results = output?.results || [];
  const matchedCount = output?.matchedCount || 0;
  const totalCount = output?.totalCount || (rawLogs ? rawLogs.split(/\r?\n/).length : 0);
  const totalExecutionTimeMs = output?.totalExecutionTimeMs || 0;
  const reDosWarning = output?.reDosWarning || false;
  const transpiledRegex = output?.transpiledRegex || transpileResult.regexString || "";

  const handleReset = () => {
    setPattern(initialPattern);
    setRawLogs(initialLogs);
  };

  const handleShare = () => {
    const url = generateShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Workbench Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Test & Config Generator Sandbox
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
            title="Reset to original template pattern and logs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Template</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/60 rounded-md transition-colors"
            title="Copy shareable link with current workbench state"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Share State</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pattern Input */}
      <PatternInputBar
        pattern={pattern}
        onChange={setPattern}
        transpileResult={transpileResult}
        isProcessing={isProcessing}
      />

      {/* 2-Column Split: Raw Logs & Live Output / Config Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[480px]">
        <RawLogEditor
          rawLogs={rawLogs}
          onChangeLogs={setRawLogs}
          results={results}
          matchedCount={matchedCount}
          totalCount={totalCount}
        />

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
    </div>
  );
}
