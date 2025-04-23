import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// Use Map for clean and efficient user tracking
const users = new Map();

export const getReceiverSocketId = (receiverId) => {
  console.log("Looking for receiver:", receiverId);
  console.log("🔎 Current connected users:", Array.from(users.entries()));
  const socketId = users.get(receiverId?.toString()); // Ensure it's a string
  console.log("Socket ID:", socketId);
  if (!socketId) {
    console.error("Receiver not connected");
  }
  return socketId;
};


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    users.set(userId.toString(), socket.id); // Ensure userId is stored as a string
    console.log(`🟢 User ${userId} mapped to socket ${socket.id}`);
    console.log(
      "🟢 Current users after this connection:",
      Array.from(users.entries())
    );
  }

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    // Remove the user from the `users` map
    for (let [id, sid] of users.entries()) {
      if (sid === socket.id) {
        users.delete(id);
        console.log(`🔴 Removed user ${id} from active users`);
        break;
      }
    }
  });
});

export { app, io, server };

