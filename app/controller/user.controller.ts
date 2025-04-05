import dbConnect from "../../lib/database/mongodb";
import User from "../../models/schema/user";
import Product from "../../models/schema/product";
import Bid from "../../models/schema/bid";

export const uploadProduct = async (userEmail, productData) => {
  try {
    await dbConnect();
   
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found!");
    }

    const newProduct = new Product({
      ...productData,
      seller: user._id, 
    });

    
    await newProduct.save();

    return { success: true, message: "Product uploaded successfully!" };
  } catch (error) {
    console.error("Error in uploading product:", error);
    return { success: false, error: error.message };
  }
};




export const placeBid = async (userEmail: string, productId: string, bidAmount: number) => {
  try {
   
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    
    const highestBid = await Bid.findOne({ productId }).sort({ amount: -1 });

    if (new Date(product.auctionEndTime) < new Date()) {
      return { success: false, error: "Auction has ended" };
    }

    if (highestBid && bidAmount <= highestBid.amount) {
      return { success: false, error: "Bid amount must be higher than the current highest bid" };
    }

    
    const bid = new Bid({
      amount: bidAmount,
      userId: user._id,
      productId: product._id,
    });

   
    await bid.save();


    product.latestBid = bidAmount;
    await product.save();

    return { success: true, message: "Bid placed successfully", bidId: bid._id };
  } catch (error) {
    console.error("Error placing bid:", error);
    return { success: false, error: "Internal Server Error" };
  }
};

const saleover
