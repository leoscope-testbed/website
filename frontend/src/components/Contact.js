import React from "react";
import './css/Contact.css'
export const Contact = (props) => {
  return (
    <div id="contact">
        <div className="contact-content">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-details">
            {/* <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>123 Main Street<br />New York, NY 10001</p>
            </div> */}
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p style={{fontSize: '30px'}}>(placeholder_email)</p>
            </div>
            {/* <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>555-555-5555</p>
            </div> */}
          </div>
        </div>
    </div>
  );
};
