import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllTemplates,
  getAllCategories,
} from "../../lib/engine/templates";
import { DirectoryClient } from "../../components/DirectoryClient";
import { TopNavigation } from "../../components/TopNavigation";
import {
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCode,
} from "lucide-react";

export const metadata: Metadata = {
  title: "50 Production Log Templates & Grok Parsers Directory | LogPipeline",
  description:
    "Comprehensive catalog of 50 production-verified log templates across AWS Cloud, NGINX, Envoy, PostgreSQL, Kafka, Kubernetes, and Palo Alto. Live regex debugging and instant multi-collector configuration export.",
  alternates: {
    canonical: "https://logpipeline.dev/directory",
  },
  openGraph: {
    title: "50 Production Log Templates & Grok Parsers Directory | LogPipeline",
    description:
      "Explore 50 production-verified log parser templates with live in-browser regex transpilation and configuration export for Fluent Bit, Vector VRL, Datadog, Logstash, and OpenTelemetry.",
    url: "https://logpipeline.dev/directory",
    siteName: "LogPipeline",
    type: "website",
  },
};

export default function DirectoryPage() {
  const templates = getAllTemplates();
  const categories = getAllCategories();

  const jsonLdCatalog = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Production Log Parser & Transpiler Templates Catalog",
    description:
      "A directory of 50 enterprise-grade log parser templates with verified regex matching and collector pipeline configurations.",
    numberOfItems: templates.length,
    itemListElement: templates.map((template, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: template.title,
      description: template.metaDescription,
      url: `https://logpipeline.dev/parser/${template.category}/${template.slug}`,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCatalog) }}
      />

      <TopNavigation />

      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-[1720px] w-full mx-auto gap-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-400 font-medium"
        >
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200">Templates Directory</span>
        </nav>

        {/* Directory Hero Header */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <BookOpen className="w-3.5 h-3.5" />
              50 Production Templates
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Test-Verified Matches
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-purple-950/40 text-purple-400 border border-purple-800/50">
              <FileCode className="w-3.5 h-3.5" />
              Multi-Collector Ready
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Log Parser & Telemetry Pipeline Directory
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
            Browse our library of 50 verified log schemas across AWS Cloud, modern web gateways,
            distributed databases, container runtimes, application frameworks, and perimeter network
            appliances. Every template includes authentic sample lines, verified Grok patterns, field
            type mappings, and instant 1-click config exports for{" "}
            <span className="text-cyan-300 font-medium">Fluent Bit</span>,{" "}
            <span className="text-cyan-300 font-medium">Vector VRL</span>,{" "}
            <span className="text-cyan-300 font-medium">Datadog</span>,{" "}
            <span className="text-cyan-300 font-medium">Logstash</span>, and{" "}
            <span className="text-cyan-300 font-medium">OpenTelemetry</span>.
          </p>
        </section>

        {/* Search, Filter, and Grid Interface */}
        <DirectoryClient initialTemplates={templates} categories={categories} />
      </main>
    </div>
  );
}
