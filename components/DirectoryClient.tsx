"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LogTemplateItem,
  TemplateCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "../lib/engine/templates";
import {
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface DirectoryClientProps {
  initialTemplates: LogTemplateItem[];
  categories: Array<{ id: TemplateCategory; label: string; count: number }>;
}

export function DirectoryClient({
  initialTemplates,
  categories,
}: DirectoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Query match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.metaDescription.toLowerCase().includes(q);
        const matchesSlug = item.slug.toLowerCase().includes(q);
        const matchesFields = item.fields.some((f) =>
          f.name.toLowerCase().includes(q)
        );
        return matchesTitle || matchesDesc || matchesSlug || matchesFields;
      }
      return true;
    });
  }, [initialTemplates, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by keyword, technology, or field name (e.g. nginx, client_ip, alb, kafka)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Total Results Count */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-400 font-mono">
          <span className="text-cyan-400 font-bold">{filteredTemplates.length}</span> of{" "}
          <span>{initialTemplates.length} templates</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-950"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <span>All Templates</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === "all"
                ? "bg-slate-950/30 text-slate-950"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {initialTemplates.length}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-950"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-slate-950/30 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Card Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-xl text-center">
          <BookOpen className="w-8 h-8 text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">
            No matching templates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search query or reset the category filter to explore all 50 production templates.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const catColor = CATEGORY_COLORS[template.category];
            const catLabel = CATEGORY_LABELS[template.category];

            return (
              <Link
                key={template.slug}
                href={`/parser/${template.category}/${template.slug}`}
                className="group flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-700/60 shadow-sm hover:shadow-lg hover:shadow-cyan-950/30 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                    >
                      {catLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      100% Match
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {template.title}
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {template.metaDescription}
                  </p>
                </div>

                {/* Sample Log Preview */}
                <div className="my-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 overflow-hidden">
                  <div className="text-[10px] text-slate-500 font-mono mb-1 flex items-center justify-between">
                    <span>Sample Line</span>
                    <span>{template.fields.length} schema fields</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 font-mono truncate leading-normal">
                    {template.sampleLogs[0]}
                  </pre>
                </div>

                {/* Footer CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Fluent Bit • Vector • DD • OTEL
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span>Open Parser</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
