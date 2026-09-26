import fs from "node:fs";
import path from "node:path";

interface TemplateStub {
  slug: string;
  category: string;
}

const BASE_URL = "https://logpipeline.dev";
const TEMPLATES_FILE = path.join(process.cwd(), "data", "templates.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function generateSitemap() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Read templates safely
  let templates: TemplateStub[] = [];
  if (fs.existsSync(TEMPLATES_FILE)) {
    try {
      const rawData = fs.readFileSync(TEMPLATES_FILE, "utf-8");
      templates = JSON.parse(rawData);
    } catch (err) {
      console.warn(`[Sitemap] Warning: Failed to parse ${TEMPLATES_FILE}:`, err);
    }
  } else {
    console.warn(`[Sitemap] Warning: ${TEMPLATES_FILE} does not exist yet.`);
  }

  const today = new Date().toISOString().split("T")[0];

  interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: string;
  }

  // Core canonical routes strictly matching layout metadataBase & canonical tags
  const urls: SitemapUrl[] = [
    {
      loc: BASE_URL,
      lastmod: today,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: `${BASE_URL}/directory`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      loc: `${BASE_URL}/about`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/contact`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: `${BASE_URL}/privacy`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      loc: `${BASE_URL}/terms`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.5",
    },
  ];

  // Programmatic 50 template routes
  for (const t of templates) {
    const encodedCategory = encodeURIComponent(t.category);
    const encodedSlug = encodeURIComponent(t.slug);
    urls.push({
      loc: `${BASE_URL}/parser/${encodedCategory}/${encodedSlug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  // Build XML String
  const xmlContent = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    "</urlset>",
  ].join("\n");

  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xmlContent, "utf-8");
  console.log(`[Sitemap] Generated ${urls.length} URLs at ${sitemapPath}`);

  // Generate robots.txt
  const robotsContent = [
    "# LogPipeline Robots.txt",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
  ].join("\n");

  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  fs.writeFileSync(robotsPath, robotsContent, "utf-8");
  console.log(`[Robots] Generated robots.txt at ${robotsPath}`);

  // Also sync directly to out/ if static export directory already exists
  const OUT_DIR = path.join(process.cwd(), "out");
  if (fs.existsSync(OUT_DIR)) {
    fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xmlContent, "utf-8");
    fs.writeFileSync(path.join(OUT_DIR, "robots.txt"), robotsContent, "utf-8");
    console.log(`[Sitemap] Synced sitemap.xml and robots.txt to ${OUT_DIR}`);
  }
}

generateSitemap();
