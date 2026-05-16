const express = require("express");
const Message = require("../models/Message");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/messages
 * Send a message (protected)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: "Receiver ID and content are required" });
    }

    // Create message
    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      content
    });

    // Return saved message
    const savedMessage = await Message.findById(message._id)
      .populate("senderId", "username email")
      .populate("receiverId", "username email");

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/messages/:otherUserId
 * Get conversation between current user and another user (protected)
 */
router.get("/:otherUserId", authMiddleware, async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "username email")
      .populate("receiverId", "username email");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/messages/conversations
 * Get all conversations for current user (protected)
 */
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "username email")
      .populate("receiverId", "username email");

    const userMap = new Map();
    
    messages.forEach((msg) => {
      const senderId = msg.senderId._id.toString();
      const receiverId = msg.receiverId._id.toString();
      
      const otherUserId = senderId === req.userId ? receiverId : senderId;
      const otherUser = senderId === req.userId ? msg.receiverId : msg.senderId;
      
      if (otherUserId !== req.userId && !userMap.has(otherUserId)) {
        userMap.set(otherUserId, {
          _id: otherUserId,
          username: otherUser.username || "User",
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt
        });
      }
    });

    res.json(Array.from(userMap.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;