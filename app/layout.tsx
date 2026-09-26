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
  title: "LogPipeline | Log Extraction & Pipeline Architect",
  description:
    "In-browser log parser, pattern debugger, and multi-collector config generator with live syntax token synchronization, ReDoS safety, and instant exports.",
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
