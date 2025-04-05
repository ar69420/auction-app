"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[], // TypeScript expects an array of strings for URLs
    basePrice: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, images: fileArray }));
    }
  };

  const upload = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          images: formData.images,
          basePrice: formData.basePrice,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Product</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter product name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter product description"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Base Price</label>
        <input
          type="number"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter base price"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      <button
        onClick={upload}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
