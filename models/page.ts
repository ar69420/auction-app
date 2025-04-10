import mongoose from 'mongoose';
import User from './schema/user';
import Product from './schema/product';
import Message from './schema/message';



// Database connection function
const connectDB = async () => {
  try {
    // Use the connection string from .env file or fall back to default
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-app';
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error; // Throw the error instead of exiting
  }
};

export default {
  connectDB,
  User,
  Product,
  Message
}; 