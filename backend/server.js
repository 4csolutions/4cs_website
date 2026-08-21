import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

// Database connection
import { connectDB } from './db.js';

// Route routers
import authRouter from './routes/auth.js';
import sectorsRouter from './routes/sectors.js';
import testimonialsRouter from './routes/testimonials.js';
import logosRouter from './routes/logos.js';
import blogsRouter from './routes/blogs.js';
import contactRouter from './routes/contact.js';

// Database Models for Sitemap
import Sector from './models/Sector.js';
import Blog from './models/Blog.js';

// Init environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Resolve ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Establish Database Connection
connectDB();

// 2. Middlewares
app.use(cors());
// Increase JSON body limit to 10MB to accommodate base64 logo uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. API Routes mapping
app.use('/api/auth', authRouter);
app.use('/api/sectors', sectorsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/logos', logosRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/contact', contactRouter);

// Root Ping endpoint for API diagnostics
app.get('/api/ping', (req, res) => {
  res.json({ message: '4C Solutions API service is fully functional!', time: new Date() });
});

// Robots.txt dynamic endpoint for search engine crawlers
app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: https://4csolutions.in/sitemap.xml
`;
  res.type('text/plain');
  res.status(200).send(robotsTxt);
});

// Dynamic XML Sitemap for SEO & AEO Crawlers
app.get('/sitemap.xml', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sectors = await Sector.find({}, 'slug updatedAt createdAt');
    const blogs = await Blog.find({}, 'slug datePublished updatedAt createdAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Routes -->
  <url>
    <loc>https://4csolutions.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/solutions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/whyerpnext</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/about-us</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/case-studies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://4csolutions.in/terms-of-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

    // Dynamic Solution Verticals
    sectors.forEach(sec => {
      const lastModDate = sec.updatedAt ? new Date(sec.updatedAt).toISOString().split('T')[0] : today;
      xml += `
  <url>
    <loc>https://4csolutions.in/solutions/${sec.slug}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // Dynamic Case Study Blog Posts
    blogs.forEach(blog => {
      const lastModDate = blog.updatedAt 
        ? new Date(blog.updatedAt).toISOString().split('T')[0] 
        : (blog.datePublished ? new Date(blog.datePublished).toISOString().split('T')[0] : today);
      xml += `
  <url>
    <loc>https://4csolutions.in/case-studies/${blog.slug}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});


// 4. Production Static File Rendering
// Serves React frontend built assets in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
  console.log(`Production Mode: Serving static client SPA assets from: ${frontendBuildPath}`);
  app.use(express.static(frontendBuildPath));
  
  // All other endpoints fallback to index.html to support client-side React Router reloads
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  console.log('Development Mode: Serving API endpoints only. Start frontend dev server on port 5173.');
  app.get('/', (req, res) => {
    res.send('4C Solutions API Server is active. Start frontend Vite space.');
  });
}

// 5. Boot Express Server
app.listen(PORT, () => {
  console.log(`Server is running in container space on: http://localhost:${PORT}`);
});
