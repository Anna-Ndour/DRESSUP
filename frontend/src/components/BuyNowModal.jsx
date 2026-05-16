import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./BuyNowModal.css";

const BuyNowModal = ({ product, onClose, onContactSeller }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleConfirmBuy = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setStep(2);
  };

  const handleSendMessageToSeller = () => {
    if (onContactSeller && product.seller) {
      onContactSeller(product.seller._id);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setMessage("");
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        
        {step === 1 && (
          <>
            <h2>Buy {product.title}</h2>
            <div className="modal-product-info">
              <img
                src={product.image || "https://via.placeholder.com/100"}
                alt={product.title}
                className="modal-product-image"
              />
              <div className="modal-product-details">
                <p className="modal-product-price">${product.price}</p>
                {product.size && <p>Size: {product.size}</p>}
                {product.category && <p>Category: {product.category}</p>}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn-primary" onClick={handleConfirmBuy}>
                Confirm Purchase
              </button>
              <button className="modal-btn-secondary" onClick={handleSendMessageToSeller}>
                Contact Seller First
              </button>
            </div>
            
            <p className="modal-note">
              This is a demo purchase. No real payment will be processed.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Purchase Request Sent!</h2>
            <div className="modal-success">
              <div className="success-icon">✓</div>
              <p>Your interest in <strong>{product.title}</strong> has been recorded.</p>
              <p>The seller will be notified and may contact you soon.</p>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn-primary" onClick={handleClose}>
                Close
              </button>
              <button className="modal-btn-secondary" onClick={handleSendMessageToSeller}>
                Message the Seller
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyNowModal;