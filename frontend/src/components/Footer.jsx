import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo">
            DressUp
          </Link>
          <p className="footer-tagline">Buy & Sell Second-Hand Fashion</p>
        </div>

        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
            <li>
              <Link to="/add-product">Sell Item</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-about">
          <h4>About DressUp</h4>
          <p>
            A sustainable marketplace for pre-loved fashion. 
            Give your clothes a second life and discover unique pieces.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>DressUp © 2026. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;