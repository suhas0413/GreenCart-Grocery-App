import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters.');
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  return res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await connectToDatabase();
  const server = app.listen(port, () => console.log(`GreenCart API listening on port ${port}`));

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    });
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}