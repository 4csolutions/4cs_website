import express from 'express';
import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// POST new inquiry (Public Contact Form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // 1. Save Enquiry to MongoDB
    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    console.log(`Saved contact form from ${name} (${email}) in database.`);

    // 2. Dispatch Email alert using NodeMailer (resilient setup)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.CONTACT_EMAIL || 'syedmujeerhashmi@gmail.com'; // Fallback recipient

    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log(`Attempting to send email alert via SMTP: ${smtpHost}:${smtpPort}...`);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: parseInt(smtpPort) === 465, // True for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const mailOptions = {
          from: `"4C Solutions Contact Alert" <${smtpUser}>`,
          to: recipientEmail,
          subject: `New Website Inquiry: ${subject || 'General'}`,
          text: `You have received a new message from the 4C Solutions website contact form.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject || 'N/A'}\nMessage:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
              <div style="background-color: #12283A; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">New Enquiry Received</h2>
              </div>
              <div style="padding: 25px; background-color: #fdfdfd;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <hr style="border: 0; border-top: 1px dashed #ddd; margin: 20px 0;" />
                <p><strong>Message:</strong></p>
                <p style="background-color: #f5f7f8; padding: 15px; border-radius: 6px; border-left: 4px solid #18d26e; font-style: italic;">"${message}"</p>
              </div>
              <div style="background-color: #f1f3f5; color: #777; font-size: 11px; text-align: center; padding: 15px;">
                This alert was generated automatically by the 4C Solutions Website.
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email alert dispatched successfully to ${recipientEmail}.`);
      } catch (emailError) {
        console.error(`Email Dispatch Alert failed: ${emailError.message}`);
        console.log(`Failsafe database logging will let the admin view this enquiry inside the dashboard.`);
      }
    } else {
      console.warn('NodeMailer SMTP credentials not configured in environment (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping email dispatch.');
      console.log('Failsafe: Enquiries are logged inside MongoDB and can be reviewed directly in the Admin Dashboard.');
    }

    res.status(201).json({
      message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all contact messages (Admin Secure)
router.get('/admin/inbox', authenticateAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update inquiry status (Admin Secure)
router.put('/admin/inbox/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Enquiry message not found' });
    }

    message.status = status;
    const updated = await message.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE inquiry (Admin Secure)
router.delete('/admin/inbox/:id', authenticateAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Enquiry message not found' });
    }
    res.json({ message: 'Enquiry deleted successfully', message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
