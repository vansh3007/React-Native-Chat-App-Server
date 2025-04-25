// SocketIO/Server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket User Mapping
const users = new Map();

export const getReceiverSocketId = (receiverId) => {
  console.log(users);
  console.log("Receiver ID:", receiverId);
  console.log("Socket ID:", users.get(receiverId?.toString()));
  return users.get(receiverId?.toString());
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId, socket.id);
  if (userId) {
    users.set(userId.toString(), socket.id);
  }

  socket.on("disconnect", () => {
    for (let [id, sid] of users.entries()) {
      if (sid === socket.id) {
        users.delete(id);
        break;
      }
    }
  });
});

export { app, server, io };
