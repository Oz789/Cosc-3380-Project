import React from "react";
import { useNavigate } from "react-router-dom";
import HomeNavBar from "../../components/homeNavBar";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Grid } from "@mui/material";
import "./home.css";
import NavBar from "../../components/cartNavBar";

const homeBackground = "./images/home.jpg"; 


const services = [
  { title: "Comprehensive Eye Exams", image: "/images/exams.jpg", description: "" },
  { title: "Injury & Disease Treatment", image: "/images/injury.jpg", description: "" },
  { title: "Children's Eye Care", image: "/images/kids.jpg", description: "" },
  { title: "Contacts & Frames", image: "/images/frames copy.jpg", description: "" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
  
      <HomeNavBar/>
    

      {/* HOME SECTION */}
      <div className="home-page-section">
        <div
          className="home-page"
          style={{
            backgroundImage: `url(${homeBackground})`,
            
            
          }}
        >
          
          <motion.button
  onClick={() => navigate("/book-appointment")}
  className="home-button"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5, duration: 0.8 }}
>
  <motion.span
    initial={{ width: 0 }}
    animate={{ width: "100%" }}
    transition={{ duration: 2.5, ease: "easeOut" }}
    className="typewriter-text"
  >
    Book Your Appointment
  </motion.span>
</motion.button>
  
        </div>

      </div>

      {/* SERVICES SECTION */}
      <div className="services-section">
        <Typography className="services-title" variant="h3" fontFamily={"Serif"}>
          Our Services Offered
        </Typography>

        <div className="service-circles">
  {services.map((service, index) => (
    <motion.div
      className="circle-service"
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <img src={service.image} alt={service.title} />
      <div className="circle-label">{service.title}</div>
    </motion.div>
  ))}
</div>
      </div>
    </>
  );
};

export default Home;

