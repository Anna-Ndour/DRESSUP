const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/favorites
router.get("/", authMiddleware, favoriteController.getFavorites);

// POST /api/favorites/:productId
router.post("/:productId", authMiddleware, favoriteController.addToFavorites);

// DELETE /api/favorites/:productId
router.delete("/:productId", authMiddleware, favoriteController.removeFromFavorites);

module.exports = router;