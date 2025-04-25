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

const users = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    users.set(userId.toString(), socket.id);
    socket.join(userId.toString());
  }

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
  });

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
