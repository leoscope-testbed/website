import React from "react";
import './css/Footer.css'

export const Footer = () => {
  return (
    <div id="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#about-us">About Us</a>
          <a href="#faq-section">FAQ</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-info">
          <p>LEOScope &copy; 2023. All Rights Reserved.</p>
          <p>Designed with 🤍 by LEOScope Team</p>
        </div>
      </div>
    </div>
  );
};
