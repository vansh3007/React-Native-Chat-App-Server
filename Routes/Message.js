import express from "express";
import { getMessages, sendMessage } from "../Controller/Message.js";
const router = express.Router();

router.post("/send/:id", sendMessage);
router.post("/get/:id", getMessages);

export default router;