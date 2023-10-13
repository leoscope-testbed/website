import React from "react";
import "./css/Features.css";

export const Features = () => {
  const services = [
    {
      title: "LEO Network Testbed",
      description:
        "Our open-source measurement testbed for LEO networks allows users to measure and analyze LEO network performance.",
      icon: "fa fa-satellite",
    },
    {
        title: "Experimentation",
        description:
          "Schedule Experiments to run across the globe based on various triggers that you decide. ",
        icon: "fa fa-users",
      },
  ];

  return (
    <div id="services" className="our-services">
      <div className="container">
        <h2 className="section-title">Key Features</h2>
        <div className="services-wrapper">
          {services.map((service, index) => (
            <div key={index} className="service">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

