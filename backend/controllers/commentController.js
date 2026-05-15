const Comment = require("../models/Comment");

/**
 * Add a comment to a product
 * POST /api/comments
 */
exports.addComment = async (req, res) => {
  try {
    const { productId, content } = req.body;

    // Check if product exists
    const product = await require("../models/Product").findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create comment with user ID from auth middleware
    const comment = await Comment.create({
      product: productId,
      user: req.userId,
      content
    });

    // Return comment with populated user info
    const populatedComment = await Comment.findById(comment._id).populate("user", "username email");
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all comments for a product
 * GET /api/comments/product/:productId
 */
exports.getCommentsByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};