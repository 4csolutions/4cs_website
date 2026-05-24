import express from 'express';
import Sector from '../models/Sector.js';
import Testimonial from '../models/Testimonial.js';
import ClientLogo from '../models/ClientLogo.js';
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

// GET all sectors
router.get('/', async (req, res) => {
  try {
    const sectors = await Sector.find().sort({ createdAt: -1 });
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single sector by slug (including testimonials, logos, and latest 3 blogs!)
router.get('/slug/:slug', async (req, res) => {
  try {
    const sector = await Sector.findOne({ slug: req.params.slug.toLowerCase() });
    if (!sector) {
      return res.status(404).json({ error: 'Sector not found' });
    }
    
    // Fetch testimonials linked to this sector
    const testimonials = await Testimonial.find({ sector: sector._id });
    
    // Fetch client logos linked to this sector
    const logos = await ClientLogo.find({ sector: sector._id });
    
    // Fetch latest 3 blogs/case studies linked to this sector
    const blogs = await Blog.find({ sector: sector._id }).sort({ datePublished: -1 }).limit(3);
    
    res.json({ sector, testimonials, logos, blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new sector (Admin Secure)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, icon, features } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const slug = slugify(name);
    const existing = await Sector.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: `A sector named "${name}" already exists` });
    }

    const newSector = await Sector.create({
      slug,
      name,
      description,
      icon: icon || 'activity',
      features: Array.isArray(features) ? features : []
    });

    res.status(201).json(newSector);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update sector (Admin Secure)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, icon, features } = req.body;
    const sector = await Sector.findById(req.params.id);
    if (!sector) {
      return res.status(404).json({ error: 'Sector not found' });
    }

    if (name && name !== sector.name) {
      const slug = slugify(name);
      const existing = await Sector.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ error: `A sector named "${name}" already exists` });
      }
      sector.name = name;
      sector.slug = slug;
    }

    if (description) sector.description = description;
    if (icon) sector.icon = icon;
    if (features) sector.features = Array.isArray(features) ? features : [];

    const updatedSector = await sector.save();
    res.json(updatedSector);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE sector (Admin Secure)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);
    if (!sector) {
      return res.status(404).json({ error: 'Sector not found' });
    }
    
    // Clear association in testimonials
    await Testimonial.updateMany({ sector: req.params.id }, { sector: null });
    
    res.json({ message: 'Sector deleted successfully', sector });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
