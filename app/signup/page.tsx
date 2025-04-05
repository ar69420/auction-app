"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    setError("");
    try {
      const res = await fetch(`/api/auth/send-otp?email=${formData.email}`);
      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Failed to send OTP");
      }

      alert("OTP sent to your email. Please check your inbox.");
      setOtpSent(true);
    } catch (err) {
      setError("Something went wrong while sending OTP");
    }
  };

  const verifyAndRegister = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Registration failed");
      }

      alert("Registration successful! You can now log in.");
      router.push("/signin");
    } catch (err) {
      setError("Something went wrong during registration");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        {!otpSent ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-4"
              onChange={handleChange}
              required
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              onClick={verifyAndRegister}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
            >
              Verify OTP & Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
