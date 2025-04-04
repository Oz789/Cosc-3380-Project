import React, {useState} from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";



const navBar = () => {
  
  //const [productsDropdown, setProductsDropdown] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "white", height: "65px", boxShadow: "brown", borderBottom: "2px solid #8B5A2B" }} position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button className="nav-link" component={Link} to="/home">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic",fontWeight: "bold", color: "#3E2723" }}>
                Home
              </Typography>
            </Button>

          <Box sx={{ display: "flex", flex: 2, gap: "20px", justifyContent: "center", alignItems: "center"}}>


            <Typography sx={{ color: "#3E2723", fontSize: "25px"}}></Typography>
            <Button className="nav-link" component={Link} to="/log-in">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic", fontWeight:"bold", color: "#3E2723" }}>
                Patient's Center
              </Typography>
            </Button>
            
            
            <Typography sx={{ color: "#3E2723", fontSize: "25px"}}>|</Typography>
            <Button className="nav-link" component={Link} to="/services">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic", fontWeight:"bold", color: "#3E2723" }}>
                Services
              </Typography>
            </Button>

            
             <Typography sx={{ color: "#3E2723", fontSize: "25px"}}>|</Typography>
            <Button className="nav-link" component={Link} to="/frames">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic", fontWeight:"bold", color: "#3E2723" }}>
                Contacts & Frames
              </Typography>
            </Button>


            <Typography sx={{ color: "#3E2723", fontSize: "25px"}}>|</Typography>
            <Button className="nav-link" component={Link} to="/about">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic", fontWeight: "bold" ,color: "#3E2723" }}>
                About
              </Typography>
            </Button>


            <Typography sx={{ color: "#3E2723", fontSize: "25px"}}>|</Typography>
            <Button className="nav-link" component={Link} to="/contact">
              <Typography sx={{ fontFamily: "'Bell MT', serif", fontStyle: "italic", fontWeight:"bold", color: "#3E2723" }}>
                Contact Us
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default navBar;