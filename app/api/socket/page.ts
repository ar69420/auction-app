import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "../../../models/schema/message";

const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGO_URI);
};

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      
      socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room.`);
      });

    
      socket.on("sendMessage", async ({ sender, receiver, content }) => {
        if (!sender || !receiver || !content) return;

        await connectDB();

        const newMsg = await Message.create({ sender, receiver, content });

   
        io.to(sender).emit("receiveMessage", newMsg);
        io.to(receiver).emit("receiveMessage", newMsg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("🚀 Socket.IO server ready");
  }

  res.end();
}
