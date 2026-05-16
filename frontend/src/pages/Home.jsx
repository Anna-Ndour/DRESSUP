import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const urlSearchTerm = searchParams.get("search") || "";

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

  useEffect(() => {
    fetchProducts();
  }, [urlSearchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(urlSearchTerm, selectedCategory);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
  };

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-hero">
          <h1>Welcome to DressUp</h1>
          <p>Buy and sell second-hand clothing</p>
          {urlSearchTerm && (
            <p className="search-results-info">
              Search results for: <strong>{urlSearchTerm}</strong>
            </p>
          )}
        </div>

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