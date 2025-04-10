import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/page";
import User from "../../../../models/schema/user";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await dbConnect.connectDB();
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store or update OTP
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await User.create({
        email,
        otp,
        otpExpiry,
        isVerified: false
      });
    }

    // Create email transporter with Resend SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: '465',
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.EMAIL_PASS
      }
    });

    // Send OTP email
    await transporter.sendMail({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #4CAF50;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}