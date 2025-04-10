import React, {useState, useEffect}from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomeNavBar = () => {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100); // change at 100px scroll (adjust if needed)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      {/* Black top bar (scrolls away) */}
      <Box
        sx={{
          backgroundColor: "black",
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={"/images/logo"} alt="logo" style={{ height: "150px" }} />
      </Box>

      {/* White nav bar (sticky!) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1000,
          borderBottom: "1px solid #dcdcdc",
          height: "65px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            fontFamily: "'Bell MT'",
            fontWeight: "bold",
          }}
        >
          <Button component={Link} to="/home" sx={{ color: "#3E2723" }}>
            Home
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/log-in" sx={{ color: "#3E2723" }}>
            Patient's Center
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/services" sx={{ color: "#3E2723" }}>
            Services
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/frames" sx={{ color: "#3E2723" }}>
            Contacts & Frames
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/about" sx={{ color: "#3E2723" }}>
            About
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/contact" sx={{ color: "#3E2723" }}>
            Contact Us
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default HomeNavBar;
