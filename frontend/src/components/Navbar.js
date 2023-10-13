import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Logout from "./Logout";
import './css/navbar.css'
import jwt from 'jwt-decode'

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('access');

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          LEOScope
          {isAuthenticated && (
        <p className="logged-in">
          {jwt(token).userid} logged in.
        </p>
        )}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-experiments">
                    My Experiments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/schedule-experiments">
                    Schedule Experiment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-nodes">
                    View Nodes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-node">
                    Add Node
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-all-runs">
                    View All Runs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Logout />                    
                </li>
                {/* <li className="nav-item">                  
                  <p className="logged-in"> {jwt(token).userid} 
                     logged in. </p>
                </li> */}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/#about-us">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/#features">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/#consortium">
                    Consortium
                  </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/#contact-us">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/#faq-section">
                    FAQs
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
