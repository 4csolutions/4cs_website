import express from 'express';
import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';
import { authenticateAdmin } from './auth.js';

const router = express.Router();

// -------------------------------------------------------------
// ANTI-SPAM DEFENSE LAYER
// -------------------------------------------------------------

// 1. In-Memory IP Rate Limiter (Max 5 submissions per 15 minutes per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

function contactRateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    } else if (record.count >= MAX_SUBMISSIONS_PER_WINDOW) {
      console.warn(`[Anti-Spam] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        error: 'Too many submissions received from your connection. Please wait a few minutes before trying again.' 
      });
    } else {
      record.count++;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, startTime: now });
  }

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  next();
}

// 2. Bot Gibberish & Heuristic Detection Helper
function isSpamSubmission({ name, email, message, website_url, _t }) {
  // A. Honeypot check: Non-empty hidden field filled by bot scrapers
  if (website_url && website_url.trim().length > 0) {
    return { isSpam: true, reason: 'Honeypot field triggered' };
  }

  // B. Submission speed check: Bots submit instantaneously (<2.5 seconds)
  if (_t) {
    const elapsed = Date.now() - Number(_t);
    if (elapsed > 0 && elapsed < 2500) {
      return { isSpam: true, reason: `Sub-human submission speed (${elapsed}ms)` };
    }
  }

  // C. Dotted email spam pattern (e.g. e.ka.ci.qop.ep.i.k.0.3@gmail.com)
  const emailUser = (email || '').split('@')[0] || '';
  if (emailUser.split('.').length > 4) {
    return { isSpam: true, reason: 'Excessively dotted email pattern' };
  }

  // D. Gibberish / High-Entropy Random String Detection (e.g. nnBIVLFwIzoGLEkT or esWycPAJcXNTFcZet)
  const isGibberish = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (trimmed.length < 10) return false;

    // Check single-word high length with frequent uppercase/lowercase alternating transitions
    if (!trimmed.includes(' ')) {
      let caseTransitions = 0;
      for (let i = 0; i < trimmed.length - 1; i++) {
        const isCurrentUpper = trimmed[i] >= 'A' && trimmed[i] <= 'Z';
        const isNextUpper = trimmed[i + 1] >= 'A' && trimmed[i + 1] <= 'Z';
        const isCurrentLower = trimmed[i] >= 'a' && trimmed[i] <= 'z';
        const isNextLower = trimmed[i + 1] >= 'a' && trimmed[i + 1] <= 'z';
        if ((isCurrentUpper && isNextLower) || (isCurrentLower && isNextUpper)) {
          caseTransitions++;
        }
      }
      if (caseTransitions >= 4 && trimmed.length >= 10) {
        return true;
      }
      if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(trimmed)) {
        return true;
      }
    }
    return false;
  };

  if (isGibberish(name)) {
    return { isSpam: true, reason: `Gibberish name detected ("${name}")` };
  }
  if (isGibberish(message)) {
    return { isSpam: true, reason: `Gibberish message detected ("${message}")` };
  }

  return { isSpam: false };
}

// POST new inquiry (Public Contact Form with Anti-Spam Protection)
router.post('/', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message, website_url, _t } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Run Anti-Spam filters
    const spamCheck = isSpamSubmission({ name, email, message, website_url, _t });
    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Filter] Blocked contact bot: ${spamCheck.reason} from IP: ${req.ip}`);
      // Silently return success to the bot to avoid retry attacks
      return res.status(200).json({
        message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
        data: { _id: 'filtered' }
      });
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
    const recipientEmail = process.env.CONTACT_EMAIL || 'mujeerhashmi@4csolutions.in'; // Fallback recipient

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
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enquiry message not found' });
    }
    res.json({ message: 'Enquiry deleted successfully', deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST bulk delete inquiries (Admin Secure)
router.post('/admin/inbox/bulk-delete', authenticateAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of inquiry IDs to delete.' });
    }

    const result = await ContactMessage.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} enquiries deleted successfully.`, count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
