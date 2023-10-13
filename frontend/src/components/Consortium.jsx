import React from "react";
import './css/Consortium.css'


export const Consortium = (props) => {
  return (
    <div id="consortiumandteam">
    <div id="consortium">
        <div className="consortium-content">
          <h2 className="section-title">Our Consortium</h2>
          <ul className="consortium-list">
          <li className="consortium-item">*Entity-1*</li>
          <li className="consortium-item">*Entity-2*</li>
          <li className="consortium-item">*Entity-3*</li>



          </ul>
        </div>
    </div>
        <div id="team">
        <div className="team-content">
          <h2 className="section-title">The Team</h2>
          <ul className="team-list">
            <li className="team-item">(Placeholder_Name), (Placeholder_Organisation)</li>
            <li className="team-item">(Placeholder_Name), (Placeholder_Organisation)</li>
            <li className="team-item">(Placeholder_Name), (Placeholder_Organisation)</li>
            <li className="team-item">(Placeholder_Name), (Placeholder_Organisation)</li>
          </ul>
        </div>
    </div>
    </div>
  );
};
