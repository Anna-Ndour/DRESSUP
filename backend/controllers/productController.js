const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // seller attached by authMiddleware
    const productData = {
      ...req.body,
      seller: req.userId
    };

    const product = await Product.create(productData);
    
    // Return product with populated seller info
    const populatedProduct = await Product.findById(product._id).populate("seller", "username email");
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query).populate("seller", "username email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "username email");
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product only the seller 
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    const { title, description, price, size, category, image } = req.body;
    
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (size) product.size = size;
    if (category) product.category = category;
    if (image) product.image = image;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate("seller", "username email");
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product only the seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user is the seller 
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};