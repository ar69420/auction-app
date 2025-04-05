import { getSession } from "next-auth/react";
import { uploadProduct } from "../../controller/user.controller";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Get user session
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    // 2️⃣ Get product data from request body
    const productData = req.body;
    if (!productData.name || !productData.basePrice) {
      return res.status(400).json({ error: "Missing product details!" });
    }

    // 3️⃣ Call the controller function
    const response = await uploadProduct(session.user.email, productData);

    // 4️⃣ Return response
    if (response.success) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    console.error("Error in upload API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
