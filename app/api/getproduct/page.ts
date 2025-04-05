
import dbConnect from "../../../lib/database/mongodb";
import Product from "../../../models/schema/product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { productId } = req.query;

    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID!" });
    }

   
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found!" });

    const timeLeft = new Date(product.auctionEndTime).getTime() - Date.now();

    return res.status(200).json({
      product,
      timeLeft: timeLeft > 0 ? timeLeft : 0, 
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


   
    






