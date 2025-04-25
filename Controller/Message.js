import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import { io } from "../SocketIO/Server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const { id: receiverId } = req.params;

    if (!message || !senderId || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      from: senderId,
      to: receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const roomId = [senderId, receiverId].sort().join("_");
    io.to(roomId).emit("receiveMessage", newMessage);

    res.status(200).json({ message: "Message sent", newMessage });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId } = req.body;
    const { id: receiverId } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate("messages")
      .lean();

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
