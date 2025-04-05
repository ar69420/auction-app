"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.message);

    setOtpSent(true);
    alert("OTP sent to your email. Please check your inbox.");
  };

  const verifyOtp = async () => {
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.message);

    await signIn("credentials", { email: formData.email, redirect: false });
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        {!otpSent ? (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
            />
            <button onClick={sendOtp} className="w-full bg-blue-500 text-white p-2 rounded">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              required
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="w-full bg-green-500 text-white p-2 rounded">
              Verify OTP & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
