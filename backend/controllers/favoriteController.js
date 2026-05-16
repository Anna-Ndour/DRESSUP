const User = require("../models/User");
const Product = require("../models/Product");

// Add a product to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already favorited to prevent duplicates
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ error: "Product already in favorites" });
    }

    // Add to favorites
    user.favorites.push(productId);
    await user.save();


    const updatedUser = await User.findById(req.userId)
      .populate("favorites", "title price image size category");

    res.json({ message: "Product added to favorites", favorites: updatedUser.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    const updatedUser = await User.findById(req.userId)
      .populate("favorites", "title price image size category");

    res.json({ message: "Product removed from favorites", favorites: updatedUser.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's favorite products
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("favorites", "title price image size category seller")
      .select("favorites");

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};