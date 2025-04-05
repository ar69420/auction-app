// pages/api/placeBid.ts
import { getSession } from "next-auth/react";
import { placeBid } from "../../controller/user.controller";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Get user session
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2️⃣ Get productId and bidAmount from the request body
    const { productId, bidAmount } = req.body;
    if (!productId || !bidAmount) {
      return res.status(400).json({ error: "Missing product ID or bid amount" });
    }

    // 3️⃣ Call the controller function to place the bid
    const response = await placeBid(session.user.email, productId, bidAmount);

    // 4️⃣ Return response
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    console.error("Error in placing bid:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
