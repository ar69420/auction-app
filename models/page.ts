import mongoose from 'mongoose';
import User from './schema/user';
import Product from './schema/product';
import Message from './schema/message';

// Database connection function
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    // Use the connection string from .env file or fall back to default
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-app';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    } as mongoose.ConnectOptions);
    
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export default {
  connectDB,
  User,
  Product,
  Message
}; 