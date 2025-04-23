import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getRecevierSocketId = (recieverId) => { 
    return users[recieverId];
}

const users = {};

io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) {
        users[userId] = socket.id;
    }

    
    
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

export { app, io, server };
