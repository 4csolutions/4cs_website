import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
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

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Establish Database Connection
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload folder
app.use('/uploads', express.static(uploadsDir));

// Multer Upload configuration for dashboard logos/avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload Endpoint (Secured or Public for panel creation)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file to upload' });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', url: relativePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
