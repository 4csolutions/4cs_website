import express from 'express';
import ClientLogo from '../models/ClientLogo.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// GET all logos
router.get('/', async (req, res) => {
  try {
    const logos = await ClientLogo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new client logo (Admin Secure)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { clientName, logoPath, websiteUrl } = req.body;
    if (!clientName || !logoPath) {
      return res.status(400).json({ error: 'Client name and logo path are required' });
    }

    const newLogo = await ClientLogo.create({
      clientName,
      logoPath,
      websiteUrl: websiteUrl || ''
    });

    res.status(201).json(newLogo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update client logo (Admin Secure)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { clientName, logoPath, websiteUrl } = req.body;
    const logo = await ClientLogo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: 'Client logo not found' });
    }

    if (clientName) logo.clientName = clientName;
    if (logoPath) logo.logoPath = logoPath;
    if (websiteUrl !== undefined) logo.websiteUrl = websiteUrl;

    const updatedLogo = await logo.save();
    res.json(updatedLogo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE client logo (Admin Secure)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const logo = await ClientLogo.findByIdAndDelete(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: 'Client logo not found' });
    }
    res.json({ message: 'Client logo deleted successfully', logo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
