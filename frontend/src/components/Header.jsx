import React from "react";
import './css/Header.css'
import { Link } from 'react-router-dom';

export const Header = (props) => {
  return (
    <div id="Header">
        <div className="hero-section">
          <h1 className="hero-title">LEOScope</h1>
          <h2 className='hero-subtitle'>A Measurement Testbed for Low-Earth Orbit (LEO) Satellite Networks </h2>
          {/* <p className="hero-description">LEOScope is an opensource measurement testbed for low earth oribit satellite networks like Starlink. It is driven by community efforts where people contribute their nodes (terminal resources) to the testbed for different people across the globe to perform measurement experiments which can offer interesting insights and progress innovative research.</p> */}
          <div className="btn-group">
            <Link to="/signup" className="btn btn-primary">Request for Access</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
    </div>
  );
};
