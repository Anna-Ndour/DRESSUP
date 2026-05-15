const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", authController.register);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post("/login", authController.login);

/**
 * GET /api/auth/me
 * Get current logged-in user (protected route)
 */
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;