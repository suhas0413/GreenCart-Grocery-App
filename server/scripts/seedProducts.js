import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const products = [
  {
    name: 'Potato 500g', category: 'Vegetables', price: 25, offerPrice: 20,
    image: ['potato_image_1.png'], description: ['Fresh and organic', 'Ideal for curries and fries'], inStock: true,
  },
  {
    name: 'Tomato 1 kg', category: 'Vegetables', price: 40, offerPrice: 35,
    image: ['tomato_image.png'], description: ['Juicy and ripe', 'Perfect for salads and sauces'], inStock: true,
  },
  {
    name: 'Carrot 500g', category: 'Vegetables', price: 30, offerPrice: 28,
    image: ['carrot_image.png'], description: ['Sweet and crunchy', 'Ideal for juices and salads'], inStock: true,
  },
  {
    name: 'Apple 1 kg', category: 'Fruits', price: 150, offerPrice: 140,
    image: ['apple_image.png'], description: ['Crisp and naturally sweet', 'A fresh everyday favorite'], inStock: true,
  },
];

try {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Configure server/.env before seeding.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const operations = products.map((product) => ({
    updateOne: {
      filter: { name: product.name },
      update: { $setOnInsert: product },
      upsert: true,
    },
  }));
  const result = await Product.bulkWrite(operations);
  console.log(`Catalog ready. Inserted ${result.upsertedCount} starter products.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}