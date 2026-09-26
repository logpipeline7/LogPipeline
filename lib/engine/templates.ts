import templatesData from "../../data/templates.json";

export type TemplateCategory =
  | "aws"
  | "web"
  | "databases"
  | "containers"
  | "runtimes"
  | "security";

export interface LogTemplateField {
  name: string;
  type: string;
  description: string;
}

export interface LogTemplateItem {
  slug: string;
  category: TemplateCategory;
  title: string;
  metaDescription: string;
  sampleLogs: string[];
  grokPattern: string;
  fields: LogTemplateField[];
  commonPitfalls: string[];
  productionTips: string;
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  aws: "AWS Cloud Infrastructure",
  web: "Web Servers & Reverse Proxies",
  databases: "Databases & Key-Value Stores",
  containers: "Containers & Kubernetes",
  runtimes: "Application Frameworks & Runtimes",
  security: "Networking & Security Appliances",
};

export const CATEGORY_COLORS: Record<TemplateCategory, { bg: string; text: string; border: string }> = {
  aws: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-700/50" },
  web: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-700/50" },
  databases: { bg: "bg-cyan-950/40", text: "text-cyan-400", border: "border-cyan-700/50" },
  containers: { bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-700/50" },
  runtimes: { bg: "bg-purple-950/40", text: "text-purple-400", border: "border-purple-700/50" },
  security: { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-700/50" },
};

const typedTemplates: LogTemplateItem[] = templatesData as LogTemplateItem[];

export function getAllTemplates(): LogTemplateItem[] {
  return typedTemplates;
}

export function getTemplateBySlug(slug: string): LogTemplateItem | undefined {
  return typedTemplates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: string): LogTemplateItem[] {
  return typedTemplates.filter((t) => t.category === category);
}

export function getRelatedTemplates(current: LogTemplateItem, limit = 4): LogTemplateItem[] {
  // First get templates in the same category
  const sameCategory = typedTemplates.filter(
    (t) => t.category === current.category && t.slug !== current.slug
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  // Fill remaining from other categories
  const others = typedTemplates.filter(
    (t) => t.category !== current.category && t.slug !== current.slug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getAllCategories(): Array<{ id: TemplateCategory; label: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const t of typedTemplates) {
    counts[t.category] = (counts[t.category] || 0) + 1;
  }

  const categoryKeys: TemplateCategory[] = ["aws", "web", "databases", "containers", "runtimes", "security"];
  return categoryKeys.map((cat) => ({
    id: cat,
    label: CATEGORY_LABELS[cat] || cat,
    count: counts[cat] || 0,
  }));
}
