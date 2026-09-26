import type { Metadata } from "next";
import Link from "next/link";
import { TopNavigation } from "../../components/TopNavigation";
import { Footer } from "../../components/Footer";
import { Mail, MessageSquare, Bug, Sparkles, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Bug Reports | LogPipeline",
  description:
    "Contact LogPipeline engineering for support, bug reports, feature suggestions, or developer sponsorship opportunities.",
  alternates: {
    canonical: "https://logpipeline.pages.dev/contact",
  },
};

export default function ContactPage() {
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
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Contact & Support
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Reach the LogPipeline engineering team directly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Support Email Card */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">General Support & Feedback</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions about regex transpilation, need assistance with collector configurations, or want to suggest
              a new log format template?
            </p>
            <a
              href="mailto:support@logpipeline.dev"
              className="mt-auto font-mono text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 pt-2"
            >
              <span>support@logpipeline.dev</span>
              <span>→</span>
            </a>
          </div>

          {/* Sponsorships & B2B */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Developer Sponsorships</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach thousands of DevOps, SRE, and platform engineers actively working on observability pipelines.
              Custom native placements and sponsored template integrations available.
            </p>
            <a
              href="mailto:sponsor@logpipeline.dev"
              className="mt-auto font-mono text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 pt-2"
            >
              <span>sponsor@logpipeline.dev</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Bug Reporting Guide */}
        <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Bug className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">How to Report a Parser Bug</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If a Grok pattern fails to match your log line or generates an invalid collector config, email us at{" "}
            <a href="mailto:support@logpipeline.dev" className="text-cyan-400 hover:underline font-mono">
              support@logpipeline.dev
            </a>{" "}
            with the following details:
          </p>

          <div className="rounded-lg bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs text-slate-300 space-y-2">
            <p className="text-slate-400"># Bug Report Format</p>
            <p>1. [Log Format / Technology]: (e.g. AWS ALB, NGINX, Fortinet, etc.)</p>
            <p>2. [Sample Log Line]: (Sanitize any tokens/passwords first!)</p>
            <p>3. [Grok Pattern Expression]: (e.g. %&#123;IP:client_ip&#125; ...)</p>
            <p>4. [Target Collector]: (Fluent Bit / Vector / Datadog / Logstash / OTel)</p>
            <p>5. [Expected Result vs Actual Error]:</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>We usually inspect and patch reported regex edge cases within 24-48 hours.</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
