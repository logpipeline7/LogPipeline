import fs from "node:fs";
import path from "node:path";

interface TemplateStub {
  slug: string;
  category: string;
}

const BASE_URL = "https://logpipeline.dev";
const TEMPLATES_FILE = path.join(process.cwd(), "data", "templates.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function generateSitemap() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Read templates
  const rawData = fs.readFileSync(TEMPLATES_FILE, "utf-8");
  const templates: TemplateStub[] = JSON.parse(rawData);

  const today = new Date().toISOString().split("T")[0];

  interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: string;
  }

  const urls: SitemapUrl[] = [
    {
      loc: `${BASE_URL}/`,
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
  ];

  for (const t of templates) {
    urls.push({
      loc: `${BASE_URL}/parser/${t.category}/${t.slug}`,
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
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
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
}

generateSitemap();
