import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllTemplates,
  getTemplateBySlug,
  getRelatedTemplates,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "../../../../lib/engine/templates";
import { transpilePattern } from "../../../../lib/engine/transpiler";
import {
  generateFluentBitConfig,
  generateVectorConfig,
  generateDatadogConfig,
  generateLogstashConfig,
  generateOtelConfig,
  ExporterInput,
} from "../../../../lib/engine/exporters";
import { TemplateWorkbench } from "../../../../components/TemplateWorkbench";
import { TopNavigation } from "../../../../components/TopNavigation";
import { AdSlot } from "../../../../components/ads/AdSlot";
import { StickyBottomAnchor } from "../../../../components/ads/StickyBottomAnchor";
import {
  ChevronRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  FileCode,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    platform: string;
    slug: string;
  }>;
}

// 1. Generate Static Params for all 50 templates
export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({
    platform: t.category,
    slug: t.slug,
  }));
}

// 2. Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const template = getTemplateBySlug(resolvedParams.slug);
  if (!template) {
    return {
      title: "Log Template Not Found | LogPipeline",
    };
  }

  const categoryName = CATEGORY_LABELS[template.category] || template.category;
  const pageTitle = `${template.title} | Regex & Collector Exporter | LogPipeline`;
  const pageDesc = `${template.metaDescription} Test Grok regex in-browser and generate verified configs for Fluent Bit, Vector VRL, Datadog, Logstash, and OpenTelemetry.`;
  const canonicalUrl = `https://logpipeline.dev/parser/${template.category}/${template.slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      siteName: "LogPipeline",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
    },
  };
}

export default async function TemplatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const template = getTemplateBySlug(resolvedParams.slug);

  if (!template || template.category !== resolvedParams.platform) {
    notFound();
  }

  // Transpile Grok pattern to base regex at build time for static documentation
  const transpileResult = transpilePattern(template.grokPattern);
  const compiledRegex = transpileResult.regexString || "";
  const exporterFields = transpileResult.fields.map((f) => ({
    name: f.name,
    type: f.dataType,
  }));

  // Generate static collector configs for documentation & crawlers
  const exporterInput: ExporterInput = {
    pattern: template.grokPattern,
    compiledRegex,
    fields: exporterFields,
    pipelineName: template.slug,
  };

  const fluentBitConfig = generateFluentBitConfig(exporterInput);
  const vectorConfig = generateVectorConfig(exporterInput);
  const datadogConfig = generateDatadogConfig(exporterInput);
  const logstashConfig = generateLogstashConfig(exporterInput);
  const otelConfig = generateOtelConfig(exporterInput);

  const related = getRelatedTemplates(template, 4);
  const catColor = CATEGORY_COLORS[template.category];
  const catLabel = CATEGORY_LABELS[template.category];

  // Schema.org Structured Data
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: template.title,
    description: template.metaDescription,
    articleSection: catLabel,
    proficiencyLevel: "Intermediate",
    dependencies: "Fluent Bit, Vector.dev, Datadog Agent, Logstash, OpenTelemetry Collector",
    author: {
      "@type": "Organization",
      name: "LogPipeline Core Engineering",
      url: "https://logpipeline.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "LogPipeline",
      url: "https://logpipeline.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://logpipeline.dev/parser/${template.category}/${template.slug}`,
    },
  };

  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${template.title} In-Browser Debugger`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All (Web Browser)",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://logpipeline.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Templates Directory",
        item: "https://logpipeline.dev/directory",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: catLabel,
        item: `https://logpipeline.dev/directory?category=${template.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: template.title,
        item: `https://logpipeline.dev/parser/${template.category}/${template.slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <TopNavigation />

      {/* 3-Column Layout Container for Ultra-Wide Displays */}
      <div className="flex-1 w-full max-w-[1880px] mx-auto flex items-start justify-center gap-4 p-2 sm:p-4">
        {/* Left Sticky Sidebar Ad (300x600 Desktop) */}
        <aside className="hidden 2xl:block sticky top-20 flex-shrink-0">
          <AdSlot
            slotId="sidebar-left"
            category={template.category}
            slug={template.slug}
          />
        </aside>

        {/* Central Content Column */}
        <main className="flex-1 flex flex-col p-2 md:p-4 lg:p-6 max-w-[1440px] w-full min-w-0 gap-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2 text-xs text-slate-400 font-medium"
        >
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/directory" className="hover:text-cyan-400 transition-colors">
            Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link
            href={`/directory?category=${template.category}`}
            className="hover:text-cyan-400 transition-colors"
          >
            {catLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 truncate max-w-xs sm:max-w-md">
            {template.title}
          </span>
        </nav>

        {/* Page Title & Hero */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border ${catColor.bg} ${catColor.text} ${catColor.border}`}
            >
              {catLabel}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Verified Regex
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-800/50">
              <Cpu className="w-3.5 h-3.5" />
              Zero-Allocation Web Worker
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {template.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
            {template.metaDescription} Test pattern matching, inspect named capture groups,
            and export production-ready parser definitions across Fluent Bit, Vector VRL,
            Datadog Pipelines, Logstash, and OpenTelemetry.
          </p>
        </section>

        {/* Interactive Client-Side Sandbox */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Live Interactive Debugger & Generator
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Matches execute locally in-browser via Web Worker
            </span>
          </div>

          <TemplateWorkbench
            initialPattern={template.grokPattern}
            initialLogs={template.sampleLogs.join("\n")}
            templateTitle={template.title}
            templateCategory={template.category}
          />
        </section>

        {/* Mid-Content Leaderboard Ad (728x90 / 970x90) */}
        <div className="w-full flex justify-center my-2 py-2">
          <AdSlot
            slotId="mid-content"
            category={template.category}
            slug={template.slug}
          />
        </div>

        {/* Deep Technical Documentation & E-E-A-T Content (600+ words) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-800/80">
          {/* Main 2-Column Documentation Area */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* 1. Format Specification & Architecture */}
            <article className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Layers className="w-5 h-5" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Log Architecture & Structural Overview
                </h2>
              </div>

              <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                <p>
                  The <strong className="text-white font-semibold">{template.title}</strong> is a core telemetry
                  stream utilized across enterprise production clusters. In distributed computing environments,
                  unstructured or semi-structured log streams generate high ingestion overhead and elevated storage
                  costs if not parsed into structured key-value schemas at the collection layer.
                </p>
                <p>
                  Modern observability collectors such as <strong className="text-cyan-300">Fluent Bit</strong>,{" "}
                  <strong className="text-cyan-300">Vector</strong>, and{" "}
                  <strong className="text-cyan-300">OpenTelemetry Collector</strong> use regular expressions and
                  named capture groups to parse tokens from raw byte streams before committing records to long-term
                  storage engines like Elasticsearch, ClickHouse, Amazon S3, or Datadog.
                </p>
                <p>
                  By transpiling Logstash-compatible Grok syntax into optimized standard PCRE/ECMAScript regular
                  expressions, LogPipeline allows engineering teams to validate pattern accuracy, inspect capture group
                  character indices, and generate platform-native parser configuration blocks without trial-and-error
                  deployments.
                </p>
              </div>
            </article>

            {/* 2. Schema Breakdown Table */}
            <article className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <FileCode className="w-5 h-5" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Extracted Field Schema & Data Types
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                The transpiled Grok pattern extracts the following schema fields from each raw event line.
                Data collectors cast these values according to the typed mappings below.
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Field Name</th>
                      <th className="px-4 py-3">Inferred Type</th>
                      <th className="px-4 py-3">Description & Collector Semantics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {template.fields.map((field) => (
                      <tr key={field.name} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-cyan-300">
                          {field.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                              field.type === "integer" || field.type === "float"
                                ? "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                                : field.type === "boolean"
                                ? "bg-purple-950/60 text-purple-300 border border-purple-800/50"
                                : "bg-slate-800 text-slate-300 border border-slate-700/50"
                            }`}
                          >
                            {field.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {field.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* 3. Common Pitfalls & Edge Cases */}
            <article className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Common Regex Traps & Production Edge Cases
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Engineers frequently encounter ingestion failures or pipeline drops due to subtle variations in
                real-world event logs. Watch out for these verified pitfalls:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {template.commonPitfalls.map((pitfall, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-slate-300 text-xs sm:text-sm"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-900/60 border border-amber-700/60 flex items-center justify-center text-amber-400 text-xs font-mono font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pitfall}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* 4. Production Collector Deployment Guide */}
            <article className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Production Collector Setup & Configurations
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Pre-configured parser definitions ready to be dropped into your infrastructure repository.
              </p>

              {/* Fluent Bit Config Block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Fluent Bit (parsers.conf)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Format: regex</span>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                  <pre>{fluentBitConfig}</pre>
                </div>
              </div>

              {/* Vector VRL Config Block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Vector.dev (Remap VRL)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">parse_regex!</span>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-cyan-300">
                  <pre>{vectorConfig}</pre>
                </div>
              </div>

              {/* Datadog Log Pipeline JSON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Datadog Log Pipeline Grok Parser
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">match_rules</span>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-amber-300">
                  <pre>{datadogConfig}</pre>
                </div>
              </div>

              {/* OpenTelemetry Collector YAML */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    OpenTelemetry Collector (transform processor)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">regex_parser</span>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-purple-300">
                  <pre>{otelConfig}</pre>
                </div>
              </div>

              {/* Logstash Filter Block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Logstash Filter Configuration
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">filter.grok</span>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-blue-300">
                  <pre>{logstashConfig}</pre>
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar: Production Tips, Indexing Advice & Related Templates */}
          <aside className="flex flex-col gap-6">
            {/* Production Architecture Tip */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Lightbulb className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Production Engineering Advice
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {template.productionTips}
              </p>
            </div>

            {/* Performance Benchmark Guarantee */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Transpiler Performance
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Sub-millisecond transpile latency</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Zero main-thread UI stuttering</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Named groups with automatic index slices</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>50ms ReDoS catastrophic guard</span>
                </li>
              </ul>
            </div>

            {/* Related Log Templates */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-200">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Related Log Templates
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Explore adjacent parsers in {catLabel} and modern cloud platforms:
              </p>

              <div className="flex flex-col gap-2 mt-1">
                {related.map((rel) => {
                  const rColor = CATEGORY_COLORS[rel.category];
                  return (
                    <Link
                      key={rel.slug}
                      href={`/parser/${rel.category}/${rel.slug}`}
                      className="group flex flex-col gap-1 p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-800/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${rColor.bg} ${rColor.text} ${rColor.border}`}
                        >
                          {rel.category}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {rel.title}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/directory"
                className="mt-2 text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-1.5 border border-cyan-800/40 hover:border-cyan-700 rounded-lg transition-colors"
              >
                Browse All 50 Production Templates →
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Right Sticky Sidebar Ad (300x600 Desktop) */}
      <aside className="hidden xl:block sticky top-20 flex-shrink-0">
        <AdSlot
          slotId="sidebar-right"
          category={template.category}
          slug={template.slug}
        />
      </aside>
    </div>

    {/* Sticky Bottom Anchor Ad */}
    <StickyBottomAnchor
      category={template.category}
      slug={template.slug}
    />
  </div>
  );
}
