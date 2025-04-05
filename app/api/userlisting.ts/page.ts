import dbConnect from "../../../lib/database/mongodb";
import Product from "../../../models/schema/product";
import User from "../../../models/schema/user";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    // ✅ Fetch all products for the user
    const products = await Product.find({ userId: user._id });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
