import Link from "next/link";
import { Terminal, Shield, Lock, Cpu, Mail, FileText, HelpCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 text-slate-400 text-xs py-10 px-4 mt-auto">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Security Guarantee */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[5px] flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-sm text-white font-mono">
              LogPipeline<span className="text-cyan-400">.dev</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            In-browser log pattern architect, Grok regex debugger, and multi-collector telemetry config generator.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-2 mt-1">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Zero Server Transmission — 100% Client-Side Web Worker Execution</span>
          </div>
        </div>

        {/* Observability Tools */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Telemetry Platform
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                Interactive Grok Debugger
              </Link>
            </li>
            <li>
              <Link href="/directory" className="hover:text-cyan-400 transition-colors">
                50 Production Log Templates
              </Link>
            </li>
            <li>
              <Link href="/directory?category=aws" className="hover:text-cyan-400 transition-colors">
                AWS CloudWatch & ALB Parsers
              </Link>
            </li>
            <li>
              <Link href="/directory?category=web" className="hover:text-cyan-400 transition-colors">
                NGINX, Apache & Envoy Regex
              </Link>
            </li>
            <li>
              <Link href="/directory?category=database" className="hover:text-cyan-400 transition-colors">
                PostgreSQL & Redis Telemetry
              </Link>
            </li>
          </ul>
        </div>

        {/* Collector Exporters */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Collector Exporters
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>Fluent Bit [PARSER] Regex</li>
            <li>Vector.dev Remap Language (VRL)</li>
            <li>Datadog Log Pipeline Grok</li>
            <li>Logstash Filter Grok DSL</li>
            <li>OpenTelemetry Transform OTTL</li>
          </ul>
        </div>

        {/* Compliance & Trust */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Compliance & Legal
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy Policy (GDPR / CCPA)
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400 transition-colors">
                About Architecture & E-E-A-T
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} LogPipeline.dev. Open utility for DevOps, SRE, and Platform Engineers.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
