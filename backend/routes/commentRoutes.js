const express = require("express");
const commentController = require("../controllers/commentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/comments
router.post("/", authMiddleware, commentController.addComment);

// GET /api/comments/product/:productId
router.get("/product/:productId", commentController.getCommentsByProduct);

module.exports = router;