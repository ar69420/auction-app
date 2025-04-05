import dbConnect from "../../../../models/page"
import User from "../../../../models/schema/user";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, otp } = req.body;
    
    // 1️⃣ Validate Input
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required!" });
    }

    // 2️⃣ Connect to MongoDB
    await dbConnect();

    // 3️⃣ Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // 4️⃣ Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified!" });
    }

    // 5️⃣ Validate OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP!" });
    }

    // 6️⃣ Mark user as verified & remove OTP
    user.isVerified = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now log in!" });

  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
