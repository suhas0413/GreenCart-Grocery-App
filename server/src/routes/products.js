import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 100;
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 80) : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim().slice(0, 60) : '';

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ message: 'Page must be positive and limit must be between 1 and 100.' });
  }

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return res.json({ products, page, limit, total });
});

export default router;