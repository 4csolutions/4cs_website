import express from 'express';
import ClientLogo from '../models/ClientLogo.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// GET all logos (returns base64 data URI for rendering)
router.get('/', async (req, res) => {
  try {
    const logos = await ClientLogo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new client logo with base64 image (Admin Secure)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { clientName, logoData, logoMimeType, websiteUrl } = req.body;
    if (!clientName || !logoData) {
      return res.status(400).json({ error: 'Client name and logo image are required' });
    }

    const newLogo = await ClientLogo.create({
      clientName,
      logoData,
      logoMimeType: logoMimeType || 'image/png',
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
    const { clientName, logoData, logoMimeType, websiteUrl } = req.body;
    const logo = await ClientLogo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: 'Client logo not found' });
    }

    if (clientName) logo.clientName = clientName;
    if (logoData) logo.logoData = logoData;
    if (logoMimeType) logo.logoMimeType = logoMimeType;
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
    res.json({ message: 'Client logo deleted successfully', deleted: logo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
