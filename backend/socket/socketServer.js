const Message = require("../models/Message");

/**
 * Socket.io Server Setup for Real-time Messaging
 * Handles private messaging between users with room-based communication
 */
module.exports = (io) => {
  // Store online users: { userId: socketId }
  const onlineUsers = new Map();

  /**
   * Handle Socket.io connections
   */
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    /**
     * User joins a room for private messaging
     * Event: "join-room"
     * Payload: { userId }
     */
    socket.on("join-room", ({ userId }) => {
      // Join room based on user ID
      socket.join(userId);
      
      // Store user's socket ID for direct messaging
      onlineUsers.set(userId, socket.id);
      
      console.log(`User ${userId} joined room ${userId}`);
    });

    /**
     * Handle sending private messages
     * Event: "send-message"
     * Payload: { senderId, receiverId, content }
     */
    socket.on("send-message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        // Save message to database
        const message = await Message.create({
          senderId,
          receiverId,
          content
        });

        // Populate sender and receiver info
        const savedMessage = await Message.findById(message._id)
          .populate("senderId", "username email")
          .populate("receiverId", "username email");

        // Send message to receiver if they're online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", savedMessage);
        }

        // Send confirmation back to sender
        socket.emit("message-sent", savedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });

    /**
     * Handle typing indicator
     * Event: "typing"
     * Payload: { senderId, receiverId }
     */
    socket.on("typing", (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", { senderId });
      }
    });

    /**
     * Handle stop typing indicator
     * Event: "stop-typing"
     * Payload: { senderId, receiverId }
     */
    socket.on("stop-typing", (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-stopped-typing", { senderId });
      }
    });

    /**
     * Handle user disconnection
     */
    socket.on("disconnect", () => {
      // Remove user from online users map
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Return online users map for external access if needed
  return { onlineUsers };
};