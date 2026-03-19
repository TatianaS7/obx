import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">OBX</span>
          <p>Custom hair oils crafted precisely for you.</p>
        </div>

        <nav className="footer-nav">
          <h4>Explore</h4>
          <ul>
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/browse-oils")}>
                Browse Oils
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/start-order")}>
                Start Order
              </button>
            </li>
          </ul>
        </nav>

        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:hello@obx.com">hello@obx.com</a>
            </li>
            <li>
              <a
                href="https://yourportfolio.com"
                target="_blank"
                rel="noreferrer"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} OBX. All rights reserved.</span>
      </div>
    </footer>
  );
}
