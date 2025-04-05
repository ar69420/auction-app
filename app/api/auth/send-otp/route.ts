import dbConnect from "../../../../models/page"
import User from "../../../../models/schema/user";
import nodemailer from "nodemailer";




export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ message: "Email is required" }), {
      status: 400,
    });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,          // e.g. "smtp.gmail.com"
      port: Number(process.env.EMAIL_PORT),  // e.g. 465
      secure: true,                          // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,        // Your email address
        pass: process.env.EMAIL_PASS,        // App password (NOT your Gmail password)
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "OTP sent successfully", otp }), // Remove `otp` in production
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(JSON.stringify({ message: "Failed to send OTP" }), {
      status: 500,
    });
  }
}
