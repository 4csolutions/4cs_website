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
