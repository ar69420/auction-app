import dbConnect from "../../../lib/database/mongodb";
import Product from "../../../models/schema/product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { productId } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID!" });
    }

    
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found!" });

    return res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
