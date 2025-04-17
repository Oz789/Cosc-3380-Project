// components/NavBarBasic.jsx
/*
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #dcdcdc",
          height: "60px",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            fontFamily: "'Bell MT', serif",
          }}
        >
          <Button component={Link} to="/home" sx={{ color: "#3E2723"}}>
            Home
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/log-in" sx={{ color: "#3E2723",}}>
            Patient's Center
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/services" sx={{ color: "#3E2723",}}>
            Services
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/frames" sx={{ color: "#3E2723", }}>
            Contacts & Frames
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/about" sx={{ color: "#3E2723",}}>
            About
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/contact" sx={{ color: "#3E2723",}}>
            Contact Us
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
*/
// components/NavBarBasic.jsx
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import the cart icon

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #dcdcdc",
          height: "60px",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            fontFamily: "'Bell MT', serif",
          }}
        >
          <Button component={Link} to="/home" sx={{ color: "#3E2723"}}>
            Home
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/log-in" sx={{ color: "#3E2723",}}>
            Patient's Center
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/services" sx={{ color: "#3E2723",}}>
            Services
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/frames" sx={{ color: "#3E2723", }}>
            Contacts & Frames
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/about" sx={{ color: "#3E2723",}}>
            About
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/contact" sx={{ color: "#3E2723",}}>
            Contact Us
          </Button>
          <Typography>|</Typography>
          {/* Add the Cart button here */}
          <Button component={Link} to="/cart" sx={{ color: "#3E2723", display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShoppingCartIcon />
            Cart
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;