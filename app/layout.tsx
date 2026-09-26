import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://logpipeline.pages.dev"),
  title: {
    default: "LogPipeline | Log Extraction Regex Architect & Multi-Collector Generator",
    template: "%s | LogPipeline",
  },
  description:
    "Interactive in-browser log parser and regex architect for DevOps & SREs. Test Grok patterns with live AST token highlights and export to Fluent Bit, Vector, Datadog, and Logstash.",
  keywords: [
    "log parser",
    "grok debugger",
    "logstash grok regex",
    "fluent bit regex parser",
    "vector vrl generator",
    "datadog grok parser",
    "opentelemetry regex parser",
    "devops log pipeline",
    "alb access log parser",
    "nginx log regex",
  ],
  authors: [{ name: "LogPipeline Engineering Team", url: "https://logpipeline.pages.dev" }],
  creator: "LogPipeline",
  publisher: "LogPipeline",
  alternates: {
    canonical: "https://logpipeline.pages.dev",
  },
  openGraph: {
    title: "LogPipeline | Log Extraction Regex Architect & Multi-Collector Generator",
    description:
      "Interactive in-browser log parser and regex architect for DevOps & SREs. Test Grok patterns with live AST token highlights and export to Fluent Bit, Vector, Datadog, and Logstash.",
    url: "https://logpipeline.pages.dev",
    siteName: "LogPipeline",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogPipeline | Log Extraction Regex Architect & Multi-Collector Generator",
    description:
      "Interactive in-browser log parser and regex architect for DevOps & SREs. Test Grok patterns with live AST token highlights and export to Fluent Bit, Vector, Datadog, and Logstash.",
  },
  verification: {
    google: "Qt6fnk3kgvaJ81WRUDNXbZ03sBCV3N_5Vh5uZC3lh4s",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        {/* Google Publisher Tag (GPT) Script */}
        <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="afterInteractive"
        />
        <Script id="gpt-init" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(function() {
              window.googletag.pubads().enableSingleRequest();
              window.googletag.enableServices();
            });
          `}
        </Script>
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
