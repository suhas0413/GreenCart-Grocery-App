import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);

router.post('/', async (req, res) => {
  const items = req.body.items;
  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    return res.status(400).json({ message: 'An order must contain between 1 and 50 items.' });
  }

  const validItems = items.every((item) =>
    item && mongoose.isValidObjectId(item.productId) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99,
  );
  if (!validItems) {
    return res.status(400).json({ message: 'Each item needs a valid product and a quantity from 1 to 99.' });
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: productIds }, inStock: true }).lean();
  const productById = new Map(products.map((product) => [product._id.toString(), product]));
  if (productById.size !== productIds.length) {
    return res.status(400).json({ message: 'One or more products are unavailable.' });
  }

  const orderItems = items.map(({ productId, quantity }) => {
    const product = productById.get(productId);
    return {
      productId: product._id,
      name: product.name,
      unitPrice: product.offerPrice,
      quantity,
      image: product.image[0] || '',
    };
  });
  const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const order = await Order.create({ userId: req.userId, items: orderItems, total });
  return res.status(201).json({ order });
});

router.get('/mine', async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  return res.json({ orders });
});

export default router;