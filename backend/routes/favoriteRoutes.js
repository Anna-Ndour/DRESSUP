const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/favorites
 * Get current user's favorite products (protected)
 */
router.get("/", authMiddleware, favoriteController.getFavorites);

/**
 * POST /api/favorites/:productId
 * Add product to favorites (protected)
 */
router.post("/:productId", authMiddleware, favoriteController.addToFavorites);

/**
 * DELETE /api/favorites/:productId
 * Remove product from favorites (protected)
 */
router.delete("/:productId", authMiddleware, favoriteController.removeFromFavorites);

module.exports = router;