import { transpilePattern, castValue } from "../lib/engine/transpiler";

export interface WorkerInput {
  rawLogs: string[];
  patternExpression: string;
  customPatterns?: Record<string, string>;
}

export interface LineMatchResult {
  lineIndex: number;
  rawText: string;
  isMatch: boolean;
  groups: Record<string, unknown>;
  rawGroups: Record<string, string>;
  indices: Array<{ field: string; start: number; end: number }>;
  executionTimeUs: number;
  failedAtChar?: number;
}

export interface WorkerOutput {
  transpiledRegex: string;
  isValid: boolean;
  errorMessage?: string;
  errorColumn?: number;
  errorLength?: number;
  results: LineMatchResult[];
  totalExecutionTimeMs: number;
  reDosWarning: boolean;
  matchedCount: number;
  totalCount: number;
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { rawLogs, patternExpression, customPatterns } = event.data;
  const startTime = performance.now();

  if (!patternExpression || patternExpression.trim().length === 0) {
    const output: WorkerOutput = {
      transpiledRegex: "",
      isValid: true,
      results: rawLogs.map((line, idx) => ({
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
      totalCount: rawLogs.length,
    };
    self.postMessage(output);
    return;
  }

  const transpiled = transpilePattern(patternExpression, customPatterns);

  if (!transpiled.success || !transpiled.regExp) {
    const output: WorkerOutput = {
      transpiledRegex: transpiled.regexString || "",
      isValid: false,
      errorMessage: transpiled.error?.message || "Pattern compilation failed",
      errorColumn: transpiled.error?.column,
      errorLength: transpiled.error?.length,
      results: rawLogs.map((line, idx) => ({
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
      totalCount: rawLogs.length,
    };
    self.postMessage(output);
    return;
  }

  const regExp = transpiled.regExp;
  const results: LineMatchResult[] = [];
  let matchedCount = 0;
  let reDosWarning = false;
  const BATCH_TIMEOUT_MS = 50;

  for (let idx = 0; idx < rawLogs.length; idx++) {
    const line = rawLogs[idx];
    const lineStart = performance.now();

    // Check batch timeout safety guard
    if (performance.now() - startTime > BATCH_TIMEOUT_MS) {
      reDosWarning = true;
      results.push({
        lineIndex: idx,
        rawText: line,
        isMatch: false,
        groups: {},
        rawGroups: {},
        indices: [],
        executionTimeUs: 0,
      });
      continue;
    }

    try {
      // Execute with RegExp d flag
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
        // Extract indices from match.indices.groups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupIndices = (match as any).indices?.groups;
        if (groupIndices) {
          for (const [field, range] of Object.entries(groupIndices)) {
            if (Array.isArray(range) && range.length === 2 && range[0] !== undefined) {
              indices.push({
                field,
                start: range[0],
                end: range[1],
              });
            }
          }
        }

        results.push({
          lineIndex: idx,
          rawText: line,
          isMatch: true,
          groups: typedGroups,
          rawGroups,
          indices,
          executionTimeUs: lineElapsedUs,
        });
      } else {
        // Line did not match - find where it broke
        let failedAtChar = 0;
        // Progressive search to find longest matching prefix
        for (let c = 1; c <= line.length; c++) {
          const slice = line.slice(0, c);
          try {
            // Check if partial matches start
            if (regExp.test(slice)) {
              failedAtChar = c;
            }
          } catch {
            break;
          }
        }

        results.push({
          lineIndex: idx,
          rawText: line,
          isMatch: false,
          groups: {},
          rawGroups: {},
          indices: [],
          executionTimeUs: lineElapsedUs,
          failedAtChar,
        });
      }
    } catch {
      results.push({
        lineIndex: idx,
        rawText: line,
        isMatch: false,
        groups: {},
        rawGroups: {},
        indices: [],
        executionTimeUs: 0,
      });
    }
  }

  const totalExecutionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  const output: WorkerOutput = {
    transpiledRegex: transpiled.regexString,
    isValid: true,
    results,
    totalExecutionTimeMs,
    reDosWarning,
    matchedCount,
    totalCount: rawLogs.length,
  };

  self.postMessage(output);
};
