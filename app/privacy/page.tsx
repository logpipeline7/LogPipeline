import type { Metadata } from "next";
import Link from "next/link";
import { TopNavigation } from "../../components/TopNavigation";
import { Footer } from "../../components/Footer";
import { Shield, Lock, Eye, Cookie, Server, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LogPipeline",
  description:
    "LogPipeline Privacy Policy. Zero server transmission architecture: all log parsing, Grok transpilation, and regex benchmarking occur 100% in your local browser.",
  alternates: {
    canonical: "https://logpipeline.dev/privacy",
  },
};

export default function PrivacyPage() {
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
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Last Updated: September 26, 2026 • Effective Date: September 26, 2026
          </p>
        </div>

        {/* Security Highlight Box */}
        <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 mb-10 flex items-start gap-4">
          <Lock className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-sm text-emerald-200">
            <span className="font-bold text-white text-base">
              The LogPipeline Zero-Transmission Security Guarantee
            </span>
            <p className="text-xs text-emerald-300/90 leading-relaxed">
              LogPipeline.dev is architected as a pure client-side utility. When you paste production log data,
              access logs, or sensitive infrastructure events into our workbench,{" "}
              <strong>that data never leaves your browser</strong>. All regular expression parsing, Grok macro
              transpilation, and token extraction are executed entirely inside your device&apos;s local Web Worker thread.
            </p>
          </div>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Do NOT Collect</h2>
            <p>
              Unlike traditional SaaS log management platforms, LogPipeline does not operate backend ingestion servers
              or telemetry databases. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 mt-2">
              <li>We do <strong>not</strong> upload, store, or transmit your raw log text.</li>
              <li>We do <strong>not</strong> record your parsed tokens, capture groups, or matched values.</li>
              <li>We do <strong>not</strong> retain IP addresses, usernames, or auth tokens contained within your logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Cookies and Third-Party Advertising</h2>
            <p>
              LogPipeline is 100% free for users, funded by advertising partners and developer sponsorships.
              We partner with Google AdSense and Google Publisher Tag (GPT) to serve relevant advertisements.
            </p>
            <p className="mt-2">
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to
              our website or other websites on the Internet:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 mt-2">
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on
                their visit to LogPipeline.dev and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized
                advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Local Storage and Session Storage</h2>
            <p>
              To provide a seamless developer experience, LogPipeline utilizes browser <code>localStorage</code> and{" "}
              <code>sessionStorage</code> to preserve your active Grok pattern expression, user UI preferences
              (such as dark mode styling or dismissed banner preferences), and custom pattern snippets between refreshes.
              This data resides exclusively on your local hard drive and is never transmitted to our infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. GDPR & CCPA Compliance</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), United Kingdom, or California:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 mt-2">
              <li>
                <strong>Right to Access / Deletion:</strong> Because we do not collect personal identities or store log
                records on servers, we hold no personal data records tied to your person.
              </li>
              <li>
                <strong>Do Not Sell My Personal Information:</strong> We do not sell user personal data. Advertising
                partners operate under standard IAB privacy strings and Google consent frameworks.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Contact Regarding Privacy</h2>
            <p>
              If you have any questions or concerns regarding this privacy policy or our client-side architecture, please
              contact us at{" "}
              <a href="mailto:privacy@logpipeline.dev" className="text-cyan-400 hover:underline font-mono">
                privacy@logpipeline.dev
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
