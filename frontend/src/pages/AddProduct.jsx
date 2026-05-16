import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsAPI } from "../services/api";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    category: "",
    image: ""
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Women",
    "Men",
    "Kids",
    "Shoes",
    "Accessories",
    "Jackets",
    "Dresses",
    "Tops",
    "Pants"
  ];

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setEditingProductId(editId);
      fetchProduct(editId);
    }
  }, [searchParams]);

  const fetchProduct = async (id) => {
    try {
      const response = await productsAPI.getById(id);
      const product = response.data;
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        size: product.size || "",
        category: product.category || "",
        image: product.image || ""
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingProductId) {
        await productsAPI.update(editingProductId, productData);
      } else {
        await productsAPI.create(productData);
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h1>{editingProductId ? "Edit Product" : "Sell an Item"}</h1>
        <p className="add-product-subtitle">
          {editingProductId ? "Update your product listing" : "Fill in the details to list your item"}
        </p>

        {error && <div className="add-product-error">{error}</div>}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Vintage Denim Jacket"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="size">Size</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., M, L, 38, etc."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small>Enter an image URL (optional)</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : editingProductId ? "Update Product" : "List Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;