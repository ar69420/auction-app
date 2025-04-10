import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../models/page";
import User from "../../../../models/schema/user";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Create new user
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      otp,
      otpExpiry,
      isVerified: false 
    });

    // Set up transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, 
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    return NextResponse.json(
      { message: "User registered. Verify email." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}