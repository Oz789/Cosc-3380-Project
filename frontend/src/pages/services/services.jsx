import React from "react";
import UsernavBar from "../../components/navBar";
import { Typography } from "@mui/material";


const services = [
  { title: "Comprehensive Eye Exams", image: "/images/exams.jpg" },
  { title: "Injury & Disease Treatment", image: "/images/injury.jpg" },
  { title: "Children's Eye Care", image: "/images/kids.jpg" },
  { title: "Contacts & Frames", image: "/images/frames copy.jpg" },
];

const Services = () => {
  return (
    <>
      <UsernavBar />
      <div className="services-section">
        <Typography className="services-title" variant="h3">
          Our Services Offered
        </Typography>

        <div className="service-circles">
          {services.map((service, index) => (
            <div className="circle-service" key={index}>
              <img src={service.image} alt={service.title} />
              <div className="circle-label">{service.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;