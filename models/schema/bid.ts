
import mongoose, { Schema, Document } from "mongoose";

interface Bid extends Document {
  amount: number;         
  userId: mongoose.Types.ObjectId; 
  productId: mongoose.Types.ObjectId; 
  createdAt: Date;
}

const BidSchema = new Schema<Bid>({
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Bid = mongoose.models.Bid || mongoose.model<Bid>("Bid", BidSchema);

export default Bid;
