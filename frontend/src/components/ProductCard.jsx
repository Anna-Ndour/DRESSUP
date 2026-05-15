import "./ProductCard.css";

/**
 * ProductCard Component
 * Reusable card component to display product preview
 */
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.title}
        />
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{product.title}</h3>
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
      </div>
    </div>
  );
};

export default ProductCard;