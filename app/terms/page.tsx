import type { Metadata } from "next";
import Link from "next/link";
import { TopNavigation } from "../../components/TopNavigation";
import { Footer } from "../../components/Footer";
import { FileText, ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | LogPipeline",
  description:
    "LogPipeline Terms of Service. Understand terms of use, client-side execution parameters, and warranty disclaimers for generated log parsing configurations.",
  alternates: {
    canonical: "https://logpipeline.pages.dev/terms",
  },
};

export default function TermsPage() {
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
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Last Updated: September 26, 2026 • Effective Date: September 26, 2026
          </p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using LogPipeline.dev (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
              If you disagree with any part of these terms, you may not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              LogPipeline provides an interactive, client-side web utility that allows developers, DevOps engineers, and
              Site Reliability Engineers (SREs) to debug Grok regular expression patterns, test log sample extraction, and
              generate exporter configuration stanzas for telemetry collectors including Fluent Bit, Vector, Datadog Agent,
              Logstash, and OpenTelemetry Collector.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Client-Side Execution & Fair Use</h2>
            <p>
              All pattern transpilation, parsing evaluations, and character index highlighting occur within your browser&apos;s
              local Web Worker environment. You agree to use the Service only for lawful purposes in accordance with these Terms.
              You agree not to attempt to inject malicious code into client-side dependencies or circumvent rate-limiting or
              ad delivery systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Disclaimer of Warranties for Production Configurations</h2>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 my-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>IMPORTANT NOTICE REGARDING PRODUCTION LOG PIPELINES</span>
              </div>
              <p>
                THE SERVICE AND ALL GENERATED CONFIGURATIONS (INCLUDING FLUENT BIT, VECTOR VRL, DATADOG GROK JSON,
                LOGSTASH CONFIGS, AND OPENTELEMETRY YAML) ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p>
                ENGINEERING TEAMS MUST INDEPENDENTLY BENCHMARK, VALIDATE, AND TEST ALL GENERATED PATTERNS AND REGEX EXPRESSIONS
                IN STAGING ENVIRONMENTS BEFORE COMMITTING THEM TO HIGH-THROUGHPUT PRODUCTION CLUSTERS. LOGPIPELINE SHALL NOT BE
                LIABLE FOR INGESTION DATA DROPS, CATASTROPHIC REGEX BACKTRACKING (REDOS), PARSER CRASHES, OR BILLING OVERAGES
                OCCURRING ON THIRD-PARTY TELEMETRY PROVIDERS.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              LogPipeline.dev and its original interface, design, documentation, and transpiler software are protected by
              copyright and intellectual property laws. Configurations generated through the tool belong to the user who
              authored or generated them and may be freely utilized in commercial, proprietary, or open-source infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Modifications to the Service</h2>
            <p>
              We reserve the right to withdraw, amend, or modernize the Service at any time without notice. We will not be
              liable if for any reason all or any part of the Service is unavailable at any time or for any period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be directed to{" "}
              <a href="mailto:legal@logpipeline.dev" className="text-cyan-400 hover:underline font-mono">
                legal@logpipeline.dev
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
