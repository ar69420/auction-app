import { env } from "process";
import dbConnect from "../../../../models/page"
import User from "../../../../models/schema/user";
import bcrypt from "bcryptjs";
import nodeMailer from "nodemailer";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    
    const { name, email, password } = req.body;
    
    
    await dbConnect();

    // 2️⃣ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const otp = Math.floor(100000 + Math.random() * 900000);

   
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      otp, 
      isVerified: false 
    });

    
    const transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${otp}`,
    });

    return res.status(201).json({ message: "User registered. Verify email." });

  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
