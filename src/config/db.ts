import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/electro-pi-db';
    await mongoose.connect(uri);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};