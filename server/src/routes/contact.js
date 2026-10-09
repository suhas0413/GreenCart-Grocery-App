import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import ContactMessage from '../models/ContactMessage.js';

const router = Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
});
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', contactLimiter, async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const topic = typeof req.body.topic === 'string' ? req.body.topic : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Enter a name between 2 and 100 characters.' });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (!['order', 'product', 'delivery', 'feedback', 'other'].includes(topic)) {
    return res.status(400).json({ message: 'Choose a valid message topic.' });
  }
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({ message: 'Message must be between 10 and 2000 characters.' });
  }

  const contactMessage = await ContactMessage.create({ name, email, topic, message });
  return res.status(201).json({ id: contactMessage.id, message: 'Your message has been recorded.' });
});

export default router;