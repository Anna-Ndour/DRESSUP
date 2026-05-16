import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsAPI, commentsAPI, favoritesAPI } from "../services/api";
import CommentSection from "../components/CommentSection";
import BuyNowModal from "../components/BuyNowModal";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);

  const sellerIdFromUrl = searchParams.get("contact");

  useEffect(() => {
    if (sellerIdFromUrl && product && isAuthenticated()) {
      navigate(`/messages?contact=${sellerIdFromUrl}`, { replace: true });
    }
  }, [sellerIdFromUrl, product, isAuthenticated]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && product) {
      checkFavorite();
    }
  }, [product, isAuthenticated]);

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.getAll();
      const favoriteIds = response.data.map((fav) => fav._id);
      setIsFavorite(favoriteIds.includes(product._id));
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productsAPI.delete(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setShowBuyModal(true);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (product?.seller) {
      navigate(`/messages?contact=${product.seller._id}`);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (error || !product) {
    return <div className="error-page">{error || "Product not found"}</div>;
  }

  const isSeller = user && product.seller && user._id === product.seller._id;

  return (
    <div className="product-details">
      <div className="product-details-container">

        <Link to="/" className="back-btn">
          ← Back to Products
        </Link>

        <div className="product-details-content">

          <div className="product-image-section">
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.title}
              className="product-image"
            />
          </div>

          <div className="product-info-section">
            <h1>{product.title}</h1>
            <p className="product-price">${product.price}</p>

            <div className="product-meta">
              {product.size && (
                <span className="product-tag">Size: {product.size}</span>
              )}
              {product.category && (
                <span className="product-tag">Category: {product.category}</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="seller-info">
              <h3>Seller</h3>
              <p>{product.seller?.username || "Unknown"}</p>
            </div>

            <div className="product-actions">
              {!isSeller && (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="action-btn buy-now-btn"
                  >
                    Buy Now
                  </button>
                  
                  <button
                    onClick={handleContactSeller}
                    className="action-btn contact-btn"
                  >
                    Contact Seller
                  </button>
                </>
              )}
              
              <button
                onClick={handleFavorite}
                className={`action-btn ${isFavorite ? "favorite-active" : ""}`}
              >
                {isFavorite ? "♥ Favorited" : "♡ Add to Favorites"}
              </button>

              {isSeller && (
                <>
                  <Link to={`/add-product?edit=${id}`} className="action-btn edit-btn">
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="action-btn delete-btn">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="comments-section">
          <CommentSection productId={id} />
        </div>
      </div>

      {showBuyModal && product && (
        <BuyNowModal
          product={product}
          onClose={() => setShowBuyModal(false)}
          onContactSeller={(sellerId) => {
            setShowBuyModal(false);
            navigate(`/messages?contact=${sellerId}`);
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;