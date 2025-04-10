import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../models/page";
import User from "../../../../models/schema/user";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // Log the start of the request
    console.log("Starting send-otp request...");

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      console.log("Invalid email format");
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set");
      return NextResponse.json(
        { message: "Database configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not set");
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 500 }
      );
    }

    // Connect to database
    try {
      console.log("Connecting to database...");
      await dbConnect.connectDB();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if user exists
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      console.log("User already exists and is verified");
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store or update OTP
    try {
      console.log("Saving OTP...");
      if (existingUser) {
        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        await existingUser.save();
      } else {
        const tempUser = new User({
          email,
          otp,
          otpExpiry,
          // These will be updated after verification
          name: "",
          password: "",
          isVerified: false
        });
        await tempUser.save();
      }
      console.log("OTP saved successfully");
    } catch (error) {
      console.error("Error saving user:", error);
      return NextResponse.json(
        { message: "Error saving user data" },
        { status: 500 }
      );
    }

    // Create email transporter
    console.log("Setting up email transporter...");
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    try {
      console.log("Sending email...");
      await transporter.sendMail({
        from: `"Auction App" <${process.env.EMAIL_USER}>`,
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
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-otp endpoint:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}