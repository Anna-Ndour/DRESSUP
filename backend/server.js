const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const socketServer = require("./socket/socketServer");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://dressup-two.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize Socket.io handlers
socketServer(io);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://dressup-frontend.vercel.app", "https://dressup.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "DressUp API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for real-time messaging`);
});

module.exports = { app, io };