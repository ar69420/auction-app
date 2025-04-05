import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId; 
  receiver: Types.ObjectId; 
  product: Types.ObjectId; 
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, 
    content: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
