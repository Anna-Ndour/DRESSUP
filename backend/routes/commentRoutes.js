const express = require("express");
const commentController = require("../controllers/commentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/comments
 * Add a comment to a product (protected)
 */
router.post("/", authMiddleware, commentController.addComment);

/**
 * GET /api/comments/product/:productId
 * Get all comments for a product (public)
 */
router.get("/product/:productId", commentController.getCommentsByProduct);

module.exports = router;