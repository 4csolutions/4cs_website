import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

const BASE_URL = 'https://4csolutions.in';
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/solutions', priority: '0.9', changefreq: 'weekly' },
  { path: '/whyerpnext', priority: '0.8', changefreq: 'monthly' },
  { path: '/about-us', priority: '0.8', changefreq: 'monthly' },
  { path: '/case-studies', priority: '0.8', changefreq: 'daily' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
];

const defaultSectors = [
  'healthcare',
  'logistics',
  'legal-practice',
  'project-contracting'
];

const defaultBlogs = [
  'hospital-management-system-erpnext',
  'fleet-dispatch-logistics-case-study',
  'law-firm-practice-erpnext-migration',
  'construction-contractor-budgeting'
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->`;

  staticRoutes.forEach(r => {
    xml += `
  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  });

  xml += `\n  <!-- ERPNext Solutions -->`;
  defaultSectors.forEach(slug => {
    xml += `
  <url>
    <loc>${BASE_URL}/solutions/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  xml += `\n  <!-- Case Studies -->`;
  defaultBlogs.forEach(slug => {
    xml += `
  <url>
    <loc>${BASE_URL}/case-studies/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `\n</urlset>\n`;

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Generated static sitemap.xml at: ${sitemapPath}`);
}

function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: ${BASE_URL}/sitemap.xml
`;
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robots, 'utf8');
  console.log(`Generated static robots.txt at: ${robotsPath}`);
}

generateSitemap();
generateRobotsTxt();
