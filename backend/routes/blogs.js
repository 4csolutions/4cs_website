import express from 'express';
import Blog from '../models/Blog.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('sector', 'name slug')
      .sort({ datePublished: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() })
      .populate('sector', 'name slug description icon features');
    if (!blog) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new case study (Admin Secure)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, summary, content, author, coverImage, sectorId, metaKeywords } = req.body;
    if (!title || !summary || !content || !author) {
      return res.status(400).json({ error: 'Title, summary, content, and author are required' });
    }

    const slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: `A case study with slug "${slug}" already exists` });
    }

    const newBlog = await Blog.create({
      slug,
      title,
      summary,
      content,
      author,
      coverImage: coverImage || '',
      sector: sectorId || null,
      metaKeywords: Array.isArray(metaKeywords)
        ? metaKeywords
        : typeof metaKeywords === 'string'
          ? metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
          : []
    });

    const populated = await Blog.findById(newBlog._id).populate('sector', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update case study (Admin Secure)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, summary, content, author, coverImage, sectorId, metaKeywords } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    if (title && title !== blog.title) {
      const slug = slugify(title);
      const existing = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ error: `A case study with slug "${slug}" already exists` });
      }
      blog.title = title;
      blog.slug = slug;
    }

    if (summary) blog.summary = summary;
    if (content) blog.content = content;
    if (author) blog.author = author;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (sectorId !== undefined) blog.sector = sectorId || null;
    if (metaKeywords !== undefined) {
      blog.metaKeywords = Array.isArray(metaKeywords)
        ? metaKeywords
        : typeof metaKeywords === 'string'
          ? metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
          : [];
    }

    await blog.save();
    const populated = await Blog.findById(blog._id).populate('sector', 'name slug');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE case study (Admin Secure)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    res.json({ message: 'Case study deleted successfully', blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
