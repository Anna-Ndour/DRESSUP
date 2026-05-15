const express = require("express");
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/products
 * Get all products (public)
 */
router.get("/", productController.getAllProducts);

/**
 * GET /api/products/:id
 * Get a single product by ID (public)
 */
router.get("/:id", productController.getProductById);

/**
 * POST /api/products
 * Create a new product (protected - requires authentication)
 */
router.post("/", authMiddleware, productController.createProduct);

/**
 * PUT /api/products/:id
 * Update a product (protected - only seller can update)
 */
router.put("/:id", authMiddleware, productController.updateProduct);

/**
 * DELETE /api/products/:id
 * Delete a product (protected - only seller can delete)
 */
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;