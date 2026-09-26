"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WorkerInput, WorkerOutput } from "../workers/parser.worker";
import { LOG_PRESETS } from "../lib/engine/presets";
import { transpilePattern, castValue } from "../lib/engine/transpiler";

export interface UseLogPipelineOptions {
  initialPattern?: string;
  initialLogs?: string;
  initialPresetId?: string;
}

const DEFAULT_PRESET = LOG_PRESETS[0];

export function useLogPipeline(options?: UseLogPipelineOptions) {
  const [pattern, setPattern] = useState<string>(options?.initialPattern ?? DEFAULT_PRESET.pattern);
  const [rawLogs, setRawLogs] = useState<string>(options?.initialLogs ?? DEFAULT_PRESET.rawLogs);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    options?.initialPresetId ?? (options?.initialPattern ? "template" : DEFAULT_PRESET.id)
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [output, setOutput] = useState<WorkerOutput | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback direct execution if Worker is unavailable in environment
  const runDirectParser = useCallback(
    (input: WorkerInput): WorkerOutput => {
      const startTime = performance.now();
      const { rawLogs: logs, patternExpression, customPatterns } = input;

      if (!patternExpression || patternExpression.trim().length === 0) {
        return {
          transpiledRegex: "",
          isValid: true,
          results: logs.map((line, idx) => ({
            lineIndex: idx,
            rawText: line,
            isMatch: false,
            groups: {},
            rawGroups: {},
            indices: [],
            executionTimeUs: 0,
          })),
          totalExecutionTimeMs: 0,
          reDosWarning: false,
          matchedCount: 0,
          totalCount: logs.length,
        };
      }

      const transpiled = transpilePattern(patternExpression, customPatterns);
      if (!transpiled.success || !transpiled.regExp) {
        return {
          transpiledRegex: transpiled.regexString || "",
          isValid: false,
          errorMessage: transpiled.error?.message || "Invalid pattern",
          errorColumn: transpiled.error?.column,
          errorLength: transpiled.error?.length,
          results: logs.map((line, idx) => ({
            lineIndex: idx,
            rawText: line,
            isMatch: false,
            groups: {},
            rawGroups: {},
            indices: [],
            executionTimeUs: 0,
          })),
          totalExecutionTimeMs: performance.now() - startTime,
          reDosWarning: false,
          matchedCount: 0,
          totalCount: logs.length,
        };
      }

      const regExp = transpiled.regExp;
      let matchedCount = 0;
      let reDosWarning = false;
      const BATCH_TIMEOUT_MS = 50;

      const results = logs.map((line, idx) => {
        const lineStart = performance.now();
        if (performance.now() - startTime > BATCH_TIMEOUT_MS) {
          reDosWarning = true;
          return {
            lineIndex: idx,
            rawText: line,
            isMatch: false,
            groups: {},
            rawGroups: {},
            indices: [],
            executionTimeUs: 0,
          };
        }

        try {
          const match = regExp.exec(line);
          const lineElapsedUs = Math.round((performance.now() - lineStart) * 1000);

          if (match) {
            matchedCount++;
            const rawGroups: Record<string, string> = { ...(match.groups || {}) };
            const typedGroups: Record<string, unknown> = {};

            for (const [key, val] of Object.entries(rawGroups)) {
              const type = transpiled.fieldTypes[key] || "string";
              typedGroups[key] = castValue(val, type);
            }

            const indices: Array<{ field: string; start: number; end: number }> = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const groupIndices = (match as any).indices?.groups;
            if (groupIndices) {
              for (const [field, range] of Object.entries(groupIndices)) {
                if (Array.isArray(range) && range.length === 2 && range[0] !== undefined) {
                  indices.push({ field, start: range[0], end: range[1] });
                }
              }
            }

            return {
              lineIndex: idx,
              rawText: line,
              isMatch: true,
              groups: typedGroups,
              rawGroups,
              indices,
              executionTimeUs: lineElapsedUs,
            };
          }

          return {
            lineIndex: idx,
            rawText: line,
            isMatch: false,
            groups: {},
            rawGroups: {},
            indices: [],
            executionTimeUs: lineElapsedUs,
          };
        } catch {
          return {
            lineIndex: idx,
            rawText: line,
            isMatch: false,
            groups: {},
            rawGroups: {},
            indices: [],
            executionTimeUs: 0,
          };
        }
      });

      return {
        transpiledRegex: transpiled.regexString,
        isValid: true,
        results,
        totalExecutionTimeMs: parseFloat((performance.now() - startTime).toFixed(2)),
        reDosWarning,
        matchedCount,
        totalCount: logs.length,
      };
    },
    []
  );

  // Initialize Web Worker
  useEffect(() => {
    try {
      const worker = new Worker(new URL("../workers/parser.worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
        setOutput(event.data);
        setIsProcessing(false);
      };

      worker.onerror = () => {
        // Fall back to direct mode if worker errors
        workerRef.current = null;
      };

      workerRef.current = worker;

      return () => {
        worker.terminate();
      };
    } catch {
      workerRef.current = null;
    }
  }, []);

  // Hydrate from URL hash if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const hash = window.location.hash;
      if (hash.startsWith("#state=")) {
        const base64 = hash.slice(7);
        const decoded = JSON.parse(decodeURIComponent(escape(atob(base64))));
        if (decoded.pattern) setPattern(decoded.pattern);
        if (decoded.rawLogs) setRawLogs(decoded.rawLogs);
        setSelectedPresetId("custom");
      }
    } catch {
      // Ignore hash parse errors
    }
  }, []);

  // Trigger parsing with 150ms debounce
  useEffect(() => {
    setIsProcessing(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const logLines = rawLogs.split(/\r?\n/).slice(0, 50); // limit to 50 lines per spec
      const input: WorkerInput = {
        rawLogs: logLines,
        patternExpression: pattern,
      };

      if (workerRef.current) {
        workerRef.current.postMessage(input);
      } else {
        const directResult = runDirectParser(input);
        setOutput(directResult);
        setIsProcessing(false);
      }
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [pattern, rawLogs, runDirectParser]);

  const loadPreset = useCallback((presetId: string) => {
    const found = LOG_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(found.id);
      setPattern(found.pattern);
      setRawLogs(found.rawLogs);
    }
  }, []);

  const generateShareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const payload = JSON.stringify({ pattern, rawLogs });
    const encoded = btoa(unescape(encodeURIComponent(payload)));
    const url = new URL(window.location.href);
    url.hash = `state=${encoded}`;
    return url.toString();
  }, [pattern, rawLogs]);

  return {
    pattern,
    setPattern,
    rawLogs,
    setRawLogs,
    selectedPresetId,
    loadPreset,
    output,
    isProcessing,
    generateShareUrl,
  };
}
