import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

/**
 * Navbar Component
 * Main navigation bar with logo, search, and user actions
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout and redirect to home
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Links to Home */}
        <Link to="/" className="navbar-logo">
          DressUp
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {isAuthenticated() ? (
            <>
              <Link to="/add-product" className="nav-btn nav-btn-primary">
                Sell Item
              </Link>
              <Link to="/favorites" className="nav-btn">
                Favorites
              </Link>
              <Link to="/messages" className="nav-btn">
                Messages
              </Link>
              <Link to="/profile" className="nav-btn">
                {user?.username || "Profile"}
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;