import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('sector', 'name slug')
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new testimonial (Admin Secure)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { clientName, clientPosition, companyName, feedback, avatarPath, sectorId } = req.body;
    if (!clientName || !companyName || !feedback) {
      return res.status(400).json({ error: 'Client name, company name, and feedback are required' });
    }

    const newTestimonial = await Testimonial.create({
      clientName,
      clientPosition: clientPosition || 'Executive',
      companyName,
      feedback,
      avatarPath: avatarPath || '',
      sector: sectorId || null
    });

    const populated = await Testimonial.findById(newTestimonial._id).populate('sector', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update testimonial (Admin Secure)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { clientName, clientPosition, companyName, feedback, avatarPath, sectorId } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    if (clientName) testimonial.clientName = clientName;
    if (clientPosition) testimonial.clientPosition = clientPosition;
    if (companyName) testimonial.companyName = companyName;
    if (feedback) testimonial.feedback = feedback;
    if (avatarPath !== undefined) testimonial.avatarPath = avatarPath;
    if (sectorId !== undefined) testimonial.sector = sectorId || null;

    await testimonial.save();
    const populated = await Testimonial.findById(testimonial._id).populate('sector', 'name slug');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE testimonial (Admin Secure)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully', testimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
