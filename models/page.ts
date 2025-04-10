import mongoose from 'mongoose';
import User from './schema/user';
import Product from './schema/product';
import Message from './schema/message';

// Database connection function
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Using existing database connection');
      return;
    }

    // Use the connection string from .env file or fall back to default
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-app';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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