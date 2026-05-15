import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const userProducts = response.data.filter(
        (product) => product.seller && product.seller._id === user._id
      );
      setMyProducts(userProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="profile-info">
            <h1>{user?.username || "User"}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>My Listings</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : myProducts.length === 0 ? (
            <div className="no-products">
              <p>You haven't listed any products yet.</p>
              <Link to="/add-product" className="add-product-btn">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {myProducts.map((product) => (
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

export default Profile;