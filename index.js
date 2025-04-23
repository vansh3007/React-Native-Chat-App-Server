import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoute from "./Routes/User.js";
import messageRoute from "./Routes/Message.js";
import { app , io, server} from "./SocketIO/Server.js";

dotenv.config();
const DBurl = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/user", userRoute);
app.use("/message", messageRoute);

app.get("/", (req, res) => {
  res.send("root path");
});


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to DB
mongoose
  .connect(DBurl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));
