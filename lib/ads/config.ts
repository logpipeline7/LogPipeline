export type AdSlotId =
  | "sidebar-left"
  | "sidebar-right"
  | "mid-content"
  | "bottom-anchor";

export interface AdSlotDefinition {
  id: AdSlotId;
  name: string;
  gptPath: string;
  sizes: [number, number][];
  minWidth: number;
  minHeight: number;
  className?: string;
}

export const AD_SLOTS: Record<AdSlotId, AdSlotDefinition> = {
  "sidebar-left": {
    id: "sidebar-left",
    name: "Desktop Left Sticky Skyscraper",
    gptPath: "/21775744923/logpipeline/sidebar-left",
    sizes: [
      [300, 600],
      [300, 250],
    ],
    minWidth: 300,
    minHeight: 600,
    className: "w-[300px] min-h-[600px]",
  },
  "sidebar-right": {
    id: "sidebar-right",
    name: "Desktop Right Sticky Skyscraper",
    gptPath: "/21775744923/logpipeline/sidebar-right",
    sizes: [
      [300, 250],
      [160, 600],
      [300, 600],
    ],
    minWidth: 160,
    minHeight: 600,
    className: "w-[300px] min-h-[600px]",
  },
  "mid-content": {
    id: "mid-content",
    name: "Workbench Mid-Content Leaderboard",
    gptPath: "/21775744923/logpipeline/mid-content",
    sizes: [
      [728, 90],
      [970, 90],
    ],
    minWidth: 728,
    minHeight: 90,
    className: "w-full max-w-[970px] min-h-[90px]",
  },
  "bottom-anchor": {
    id: "bottom-anchor",
    name: "Sticky Bottom Viewport Anchor",
    gptPath: "/21775744923/logpipeline/bottom-anchor",
    sizes: [
      [728, 90],
      [320, 50],
    ],
    minWidth: 320,
    minHeight: 50,
    className: "w-full max-w-[728px] min-h-[50px] sm:min-h-[90px]",
  },
};

export interface B2BSponsorshipOffer {
  id: string;
  sponsor: string;
  headline: string;
  description: string;
  badge: string;
  perk: string;
  ctaText: string;
  targetUrl: string;
  themeColor: string;
}

export const B2B_SPONSORSHIP_OFFERS: B2BSponsorshipOffer[] = [
  {
    id: "digitalocean",
    sponsor: "DigitalOcean",
    headline: "Deploy High-Performance Log Ingestion",
    description:
      "Spin up fast SSD Droplets and Managed Kubernetes to host Vector, Fluent Bit, and OpenTelemetry forwarders with predictable pricing.",
    badge: "Official Cloud Partner",
    perk: "$200 Free 60-Day Credit",
    ctaText: "Claim $200 Free Credits →",
    targetUrl: "https://www.digitalocean.com/products/droplets",
    themeColor: "from-blue-600 to-cyan-500",
  },
  {
    id: "grafana",
    sponsor: "Grafana Cloud",
    headline: "Zero-Maintenance Log Centralization & Loki",
    description:
      "Eliminate elastic cluster management. Stream your transpiled logs directly into Grafana Loki with Prometheus-compatible labels.",
    badge: "Observability Partner",
    perk: "50GB Logs & 10k Metrics Free/Mo",
    ctaText: "Start Free with Loki →",
    targetUrl: "https://grafana.com/products/cloud/logs/",
    themeColor: "from-amber-500 to-orange-600",
  },
];

/**
 * Returns contextual B2B targeting parameters for Google Publisher Tag (GPT)
 * based on the active log category and specific template.
 */
export function getContextualTargeting(
  category?: string,
  slug?: string
): Record<string, string | string[]> {
  const baseTechStack = [
    "observability",
    "devops",
    "kubernetes",
    "logging",
    "telemetry",
    "sre",
  ];

  const vendorContextMap: Record<string, string[]> = {
    aws: ["amazon_web_services", "cloudwatch", "datadog", "newrelic", "splunk"],
    web: ["nginx", "envoy", "cloudflare", "datadog", "elastic"],
    databases: ["postgresql", "clickhouse", "mongodb", "elastic", "redis"],
    containers: ["kubernetes", "docker", "prometheus", "vector", "fluentbit"],
    runtimes: ["opentelemetry", "golang", "java", "nodejs", "python"],
    security: ["paloalto", "fortinet", "crowdstrike", "splunk", "siem"],
  };

  const selectedVendors = category && vendorContextMap[category]
    ? vendorContextMap[category]
    : ["datadog", "splunk", "elastic", "fluentbit", "vector", "grafana"];

  return {
    tech_stack: baseTechStack,
    vendor_context: selectedVendors,
    category: [category || "general"],
    slug: [slug || "workbench"],
    intent: "log_pipeline_configuration",
    audience: "systems_engineers_and_devops",
  };
}

// Google Publisher Tag (GPT) Global Window Interface
declare global {
  interface Window {
    googletag?: {
      cmd: Array<() => void>;
      defineSlot?: (
        adUnitPath: string,
        size: [number, number] | [number, number][],
        divId: string
      ) => GoogletagSlot;
      destroySlots?: (slots?: GoogletagSlot[]) => boolean;
      display?: (divOrSlot: string | GoogletagSlot) => void;
      enableServices?: () => void;
      pubads?: () => GoogletagPubAdsService;
    };
  }
}

export interface GoogletagSlot {
  addService: (service: GoogletagPubAdsService) => GoogletagSlot;
  setTargeting: (key: string, value: string | string[]) => GoogletagSlot;
  clearTargeting: (key?: string) => GoogletagSlot;
  getSlotElementId: () => string;
}

export interface GoogletagPubAdsService {
  enableSingleRequest: () => void;
  enableLazyLoad?: (config?: Record<string, unknown>) => void;
  refresh: (slots?: GoogletagSlot[]) => void;
  clear: (slots?: GoogletagSlot[]) => void;
  setTargeting: (key: string, value: string | string[]) => GoogletagPubAdsService;
  addEventListener?: (eventType: string, listener: (event: unknown) => void) => void;
}
