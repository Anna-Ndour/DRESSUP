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

    // Find all messages between current user and the other user
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

module.exports = router;