import mongoose from 'mongoose';

export async function connectToDatabase() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Copy server/.env.example to server/.env and configure it.');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
}