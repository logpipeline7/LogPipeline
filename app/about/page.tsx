import type { Metadata } from "next";
import Link from "next/link";
import { TopNavigation } from "../../components/TopNavigation";
import { Footer } from "../../components/Footer";
import { Cpu, Terminal, Zap, Shield, Layers, Code, CheckCircle2, ArrowLeft, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About LogPipeline | Architecture & Engineering Mission",
  description:
    "Learn about LogPipeline's engineering mission: zero-overhead client-side log parsing, Web Worker regex tokenization, and multi-collector configuration transpilation.",
  alternates: {
    canonical: "https://logpipeline.dev/about",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNavigation />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workbench</span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              About LogPipeline
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            The Client-Side Log Parser & Multi-Collector Configuration Engine
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Mission */}
          <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Our Engineering Mission
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Every day, Site Reliability Engineers, DevOps teams, and platform developers waste hundreds of hours
              manually writing and testing regular expressions for distributed log streams. Existing online regex tools
              either freeze the browser UI when pasting large production batches, or compromise sensitive data by
              sending proprietary server logs to unknown backend endpoints.
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong>LogPipeline was built to solve this problem permanently:</strong> a blistering-fast, 100%
              client-side parsing workbench that provides live AST tokenization, character-level highlight synchronization,
              and instant transpilations into battle-tested configs for Fluent Bit, Vector, Datadog, Logstash, and OpenTelemetry.
            </p>
          </section>

          {/* Architectural Pillars */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Core Architecture & Technical Design
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono">
                  <Cpu className="w-4 h-4" />
                  <span>Dedicated Web Worker Threading</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regular expression parsing is notoriously CPU-intensive. LogPipeline offloads all regex compilation,
                  batch evaluation, and character offset calculations to a dedicated browser Web Worker, ensuring a silky
                  60 FPS UI experience regardless of log volume.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono">
                  <Shield className="w-4 h-4" />
                  <span>Air-Gapped Zero Data Transmission</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your logs remain on your device. We operate no ingestion microservices, no log databases, and no proxy
                  servers. Even if you paste authorization tokens or internal IP addresses, they never touch the wire.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                  <Code className="w-4 h-4" />
                  <span>Recursive Grok-to-PCRE Transpiler</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our custom transpiler resolves nested Grok patterns down to base regular expressions with named
                  capture groups, providing type coercion metadata (`:integer`, `:float`) recognized by downstream collectors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>Multi-Collector Exporters</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Avoid vendor lock-in. One pattern transpiles simultaneously into Fluent Bit `[PARSER]` blocks,
                  Vector Remap Language (VRL), Datadog Grok JSON, Logstash filter blocks, and OpenTelemetry YAML.
                </p>
              </div>
            </div>
          </section>

          {/* E-E-A-T & Team Context */}
          <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Editorial Standards & Author Experience (E-E-A-T)
            </h2>
            <p className="text-slate-300 leading-relaxed">
              All 50 log format specifications, sample log lines, and parser templates curated in LogPipeline are
              researched and verified against official upstream documentation (AWS CloudWatch, NGINX Core, PostgreSQL
              Documentation, CNCF OpenTelemetry Specifications).
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every template undergoes automated unit testing before release, ensuring that capture group names,
              timestamp formats, and numeric casts match real production telemetry streams.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="text-center pt-6 border-t border-slate-800 flex flex-col items-center gap-3">
            <p className="text-slate-400 text-xs">
              Have feedback, a custom log template request, or want to sponsor LogPipeline?
            </p>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              Get in Touch with the Engineering Team
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
