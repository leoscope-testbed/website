import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Footer } from "./Footer.jsx";
import { About } from "./About.jsx";
import { Consortium } from "./Consortium.jsx";
import { Contact } from "./Contact.js";
import { Faq } from "./Faq.jsx";
import { Header } from "./Header.jsx";
import { Features } from "./Features.jsx";


// import './css/Home.css'

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div>
      <Header/>
      <section className="about-us" id="about-us">
        <About/>
      </section>
      <section className="features" id="features">
          <Features/>
        </section>
      <section className="consortium" id="consortium">
        <Consortium/>
      </section>
      <section className="contact-us" id="contact-us">
      <Contact/>
      </section>
      <section className="faq-section" id="faq-section">
          <Faq/>
        </section>
        <section className="footer">
          <Footer/>
        </section>
        
        {/* </div> */}
      {/* {isAuthenticated ? (
        <div>
          Welcome!
          <br />
          You are now logged in and can access all features.
        </div>
      ) : (
        <div>
          Welcome to our website!
          <br />
          Please log in or sign up to access all features.
        </div>
      )} */}
     </div>
  );
};

export default Home;
