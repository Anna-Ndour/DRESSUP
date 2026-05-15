import { io } from "socket.io-client";

// Connect to the backend Socket.io server
const SOCKET_URL = "http://localhost:5000";

// Create socket instance with auto-connect disabled
// We'll connect manually when user logs in
let socket = null;

export const getSocket = () => socket;

/**
 * Initialize socket connection
 * Call this when user logs in
 */
export const initSocket = (userId) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Join user's private room for receiving messages
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    if (userId) {
      socket.emit("join-room", { userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

/**
 * Disconnect socket
 * Call this when user logs out
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};