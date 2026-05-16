import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { favoritesAPI, productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFavorite = async (productId) => {
    try {
      await favoritesAPI.remove(productId);
      // Update local state
      setFavorites(favorites.filter((fav) => fav._id !== productId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1>My Favorites</h1>
        <p className="favorites-subtitle">
          Products you've saved for later
        </p>

        {loading ? (
          <div className="loading">Loading your favorites...</div>
        ) : favorites.length === 0 ? (
          <div className="no-favorites">
            <p>You haven't favorited any products yet.</p>
            <Link to="/" className="browse-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <p className="favorites-count">{favorites.length} item(s)</p>
            <div className="favorites-grid">
              {favorites.map((product) => (
                <div key={product._id} className="favorite-card-wrapper">
                  <Link to={`/product/${product._id}`}>
                    <ProductCard product={product} />
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(product._id)}
                    className="remove-favorite-btn"
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;