import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BuyNowModal from "./BuyNowModal";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const isSeller = user && product.seller && user._id === product.seller._id;

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
    navigate(`/messages?contact=${product.seller._id}`);
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-card-image" onClick={handleProductClick}>
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.title}
          />
        </div>
        <div className="product-card-content">
          <h3 className="product-card-title" onClick={handleProductClick}>
            {product.title}
          </h3>
          <p className="product-card-price">${product.price}</p>
          {product.size && (
            <span className="product-card-size">{product.size}</span>
          )}
          {product.category && (
            <span className="product-card-category">{product.category}</span>
          )}
          {product.seller && (
            <p className="product-card-seller">by {product.seller.username || "Unknown"}</p>
          )}
          
          <div className="product-card-actions">
            {!isSeller && (
              <>
                <button className="card-btn buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
                {product.seller && (
                  <button className="card-btn contact-btn" onClick={handleContactSeller}>
                    Chat
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showBuyModal && (
        <BuyNowModal
          product={product}
          onClose={() => setShowBuyModal(false)}
          onContactSeller={(sellerId) => {
            setShowBuyModal(false);
            navigate(`/messages?contact=${sellerId}`);
          }}
        />
      )}
    </>
  );
};

export default ProductCard;