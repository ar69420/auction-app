"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PlaceBid = ({ productId }: { productId: string }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };

  const placeBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/placeBid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, bidAmount: parseFloat(bidAmount) }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Bid placed successfully!");
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Bid Amount</label>
        <input
          type="number"
          value={bidAmount}
          onChange={handleBidChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter your bid"
        />
      </div>

      <button
        onClick={placeBid}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {loading ? "Placing Bid..." : "Place Bid"}
      </button>
    </div>
  );
};

export default PlaceBid;
