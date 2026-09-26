"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CORE_PATTERNS } from "../lib/engine/patterns";
import { getFieldColorTheme } from "../lib/engine/colors";
import { TranspileResult } from "../lib/engine/transpiler";
import { Code, AlertTriangle, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface PatternInputBarProps {
  pattern: string;
  onChange: (val: string) => void;
  transpileResult: TranspileResult | null;
  isProcessing: boolean;
}

export function PatternInputBar({
  pattern,
  onChange,
  transpileResult,
  isProcessing,
}: PatternInputBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Available patterns list
  const patternsList = useMemo(() => Object.values(CORE_PATTERNS), []);

  // Filtered autocomplete suggestions based on query after '%{' or '%'
  const filteredSuggestions = useMemo(() => {
    if (!suggestionFilter) return patternsList.slice(0, 10);
    const q = suggestionFilter.toLowerCase();
    return patternsList
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 8);
  }, [patternsList, suggestionFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart || 0;
    onChange(val);
    setCursorPos(pos);

    // Check if user is typing a macro token like % or %{...
    const textBeforeCursor = val.slice(0, pos);
    const match = textBeforeCursor.match(/%\{?([A-Za-z0-9_]*)$/);

    if (match) {
      setSuggestionFilter(match[1]);
      setShowSuggestions(true);
      setSelectedSuggestionIdx(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIdx((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIdx((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertSuggestion(filteredSuggestions[selectedSuggestionIdx].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (macroName: string) => {
    const textBeforeCursor = pattern.slice(0, cursorPos);
    const textAfterCursor = pattern.slice(cursorPos);

    // Replace the trailing % or %{query with %{MACRO:fieldName}
    const replacedBefore = textBeforeCursor.replace(/%\{?[A-Za-z0-9_]*$/, `%{${macroName}:`);
    const newPattern = `${replacedBefore}}${textAfterCursor}`;
    onChange(newPattern);
    setShowSuggestions(false);

    // Refocus and place cursor at field name position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = replacedBefore.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasError = transpileResult && !transpileResult.success;
  const capturedFields = transpileResult?.fields || [];

  return (
    <section className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative flex flex-col gap-2.5">
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Extraction Pattern (Grok / PCRE Expression)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isProcessing ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              Transpiling...
            </span>
          ) : hasError ? (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              Pattern Syntax Error
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pattern Valid ({capturedFields.length} fields)
            </span>
          )}
        </div>
      </div>

      {/* Main Pattern Input Bar */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={pattern}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            const pos = inputRef.current?.selectionStart || 0;
            const textBefore = pattern.slice(0, pos);
            if (/%\{?[A-Za-z0-9_]*$/.test(textBefore)) {
              setShowSuggestions(true);
            }
          }}
          placeholder="e.g. %{IP:client_ip} %{USER:ident} [%{HTTPDATE:timestamp}] %{INT:status:integer}"
          className={`w-full bg-slate-950 font-mono text-sm px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors ${
            hasError
              ? "border-rose-500/80 text-rose-200 focus:border-rose-400"
              : "border-slate-700/80 text-cyan-100 focus:border-cyan-500"
          }`}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Autocomplete Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionBoxRef}
            className="absolute left-0 top-full mt-1.5 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800"
          >
            <div className="px-3 py-1.5 bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Macro Autocomplete</span>
              <span className="text-[10px] text-slate-500 lowercase">Press Tab or Enter to insert</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredSuggestions.map((macro, idx) => (
                <button
                  key={macro.name}
                  type="button"
                  onClick={() => insertSuggestion(macro.name)}
                  onMouseEnter={() => setSelectedSuggestionIdx(idx)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    idx === selectedSuggestionIdx
                      ? "bg-cyan-950/70 text-cyan-200"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-cyan-400">
                      %{`{${macro.name}}`}
                    </span>
                    <span className="text-slate-400 text-[11px] truncate max-w-xs">
                      {macro.description}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {macro.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {hasError && transpileResult?.error && (
        <div className="flex items-start gap-2 bg-rose-950/40 border border-rose-800/60 rounded-lg p-2.5 text-xs text-rose-300 font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-200">
              {transpileResult.error.message}
            </span>
            <span className="text-rose-400/80 ml-2">
              (Column: {transpileResult.error.column})
            </span>
          </div>
        </div>
      )}

      {/* Synchronized Token Chips */}
      {capturedFields.length > 0 && !hasError && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
            <ChevronRight className="w-3 h-3 text-slate-500" />
            Detected Fields:
          </span>
          {capturedFields.map((field) => {
            const theme = getFieldColorTheme(field.name);
            return (
              <span
                key={field.name}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
              >
                <span className="font-bold">{field.name}</span>
                {field.dataType !== "string" && (
                  <span className="text-[10px] opacity-75">:{field.dataType}</span>
                )}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
