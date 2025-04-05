import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  currentBid: number;
  highestBidder?: Types.ObjectId; 
  seller: Types.ObjectId;
  expiryTime: Date; 
  bids: { user: Types.ObjectId; amount: number; time: Date }[];
  createdAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], 
    basePrice: { type: Number, required: true }, 
    currentBid: { type: Number, default: 0 },
    highestBidder: { type: Schema.Types.ObjectId, ref: "User" }, 
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    expiryTime: { type: Date, required: true },
    bids: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        time: { type: Date, default: Date.now },
      },
    ], 
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
