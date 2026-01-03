/**
 * Generate sitemap.xml from apps.json
 * Run: npx tsx scripts/generate-sitemap.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://khương.vn";

interface App {
  id: string;
  path: string;
}

interface AppsConfig {
  apps: App[];
}

function generateSitemap(): void {
  // Read apps.json
  const appsPath = join(import.meta.dirname, "../src/apps/apps.json");
  const appsData: AppsConfig = JSON.parse(readFileSync(appsPath, "utf-8"));

  // Build URLs
  const urls = [
    { loc: "/", changefreq: "monthly", priority: "1.0" },
    { loc: "/apps/", changefreq: "weekly", priority: "0.8" },
    ...appsData.apps.map((app) => ({
      loc: app.path,
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  // Write sitemap
  const outputPath = join(import.meta.dirname, "../public/sitemap.xml");
  writeFileSync(outputPath, xml);
  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`URLs: ${urls.length}`);
}

generateSitemap();
