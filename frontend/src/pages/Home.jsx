import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

/**
 * Home Page
 * Displays product marketplace with filters and search
 */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Categories for filtering
  const categories = [
    "All",
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

  /**
   * Fetch all products from API
   */
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(searchTerm, selectedCategory);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search input change
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
  };

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <div className="home-hero">
          <h1>Welcome to DressUp</h1>
          <p>Buy and sell second-hand clothing</p>
        </div>

        {/* Search Bar */}
        <div className="home-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>

        {/* Category Filters */}
        <div className="home-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`filter-btn ${selectedCategory === (category === "All" ? "" : category) ? "active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="home-products">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;