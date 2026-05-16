const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", authController.register);

// Login user and get JWT token
router.post("/login", authController.login);

// Get current logged-in user (protected route)
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;