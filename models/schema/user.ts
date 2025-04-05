import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  balance: number;
  products: Types.ObjectId[]; 
  messages: Types.ObjectId[]; 
  createdAt: Date;
  isverified:boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    isAdmin: { type: Boolean, default: false },
    balance: { type: Number, default: 0 }, 
    isverified:{type: Boolean,default: false},
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
