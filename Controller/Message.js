import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import { getReceiverSocketId } from "../SocketIO/Server.js";
export const sendMessage = async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const { id: receiverId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create and save the new message
    const newMessage = await Message.create({
      from: senderId,
      to: receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save(); 
    }

    const recieverSocketId = getReceiverSocketId(receiverId);

    if(recieverSocketId){
      io.to(recieverSocketId).emit("receiveMessage", newMessage);
    }

    return res.status(200).json({
      message: "Message sent successfully",
      newMessage: newMessage,
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return res.status(500).json({ message: "Something went wrong..." });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { senderId } = req.body;
    const { id: receiverId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");



    if (!conversation) {
      return res.status(200).json({ message: "No conversation found" });
    }

    const messages = conversation.messages;
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("Something went wrong:", error);
    return res.status(500).json({ message: "Something went wrong..." });
  }
};
