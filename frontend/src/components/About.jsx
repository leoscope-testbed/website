import React from "react";
import './css/About.css'

export const About = (props) => {
  return (
    <div id="about">
        <div className="about-content">
          <h2 className="section-title">About LEOScope</h2>
          <p style={{fontSize: '20px'}}>LEOScope is an open-source measurement testbed for Low Earth Orbit (LEO) Constellation Satellite Networks (eg, Starlink). It is driven by community efforts where people contribute nodes (LEO ground-terminal and compute) to the testbed for researchers/developers across the globe to perform experiments across the LEO network and this drive innovation in this new <i>space</i>!</p>
        </div>
    </div>
  );
};
