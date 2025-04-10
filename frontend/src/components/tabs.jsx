import React from "react";
import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Tab, { tabClasses } from "@mui/material/Tab";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider} from '@mui/material/styles';

import "./tabs.css";

// const theme = createTheme({

//   palette: {
//     primary: {
//         main: "#fffbed"
//       //main: '#E3D026',
//     //   light: '#E9DB5D',
//     //   dark: '#A29415',
//     //   contrastText: '#242105',
//     },
//   },
// });

const TabItem = styled(Tab)(({ theme }) => ({

  
  opacity: 1,
  overflow: "initial",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2.5),
  minHeight: theme.spacing(7),
  color: "#fff",
  background: "rbga(50,0,0,100)",
  transition: "0.2s",
  zIndex: "var(--_zIndex)",

  backgroundColor: "transparent",
  border: "2px solid #ddd",
  borderRadius: 4,
  borderBottomLeftRadius:0,
  
  
  
  
  
  textTransform: "initial",
  [theme.breakpoints.up("md")]: {
    minWidth: 160, //120
  },
  "&::before, &::after": {
    borderBottom:"none",
    content: '" "',
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  "&:before": {
    borderBottom:"none",
    //backgroundColor: (theme.vars || theme).palette.grey[500],
    backgroundColor:"rgb(219, 166, 123)",
    
    // transform: "skewY(-6deg)",  this is where the serrated shit happens
    // border: "2px solid #ddd",
    // borderRadius: 10,
    borderBottom: "none",
    transformOrigin: "100%",
    zIndex: -1,
  },
  "&::after": {

    borderBottom:"none",
    borderBottom:"none",
    
    left: "unset",
    pointerEvents: "none",
    transition: "0.2s",
    transform: "translateX(100%)",
    display: "block",
    width: 8,
    zIndex: 2,
    background:
      // eslint-disable-next-line max-len
      "linear-gradient(to top right, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 45%, transparent, transparent 64%)",
  },
  [`&.${tabClasses.selected}`]: {
    
    borderBottom:"none",
    color: (theme.vars || theme).palette.text.primary,
    zIndex: 100,
    backgroundColor: "#fffbed",
    "&:before": {
      borderBottom:"none",
      //backgroundColor: "#fff",
      backgroundColor: "#fffbed",
      //boxShadow: "3px 3px 8px 0 rgba(0,0,0,0.38)",
    },
    "&:after": {
      borderBottom:"none",
      width: theme.spacing(3.5),
    },
  },
}));


const TabsSerrated = (props) => {

  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange =  (i) =>
    {
      console.log("local:" + i + " tabIndex: " + tabIndex);
      setTabIndex(i);
      console.log("tabIndex after:" + tabIndex);
      props.handleA(i);
      
    }
  

  
  return (
    // <AppBar 
    //     className="shifter"
    //   position={"static"}
    //   elevation={0}
    //   sx={{ backgroundColor: "#fff" }}
    // >
    //   <Toolbar
    //     sx={{
    //       overflow: "hidden",
    //       minHeight: 72,
    //     }}
    //   >
    //<ThemeProvider theme ={theme}>
        <Tabs
          textColor="inherit"
          className="test"
          value={tabIndex}
          onChange={(e, index )=> handleChange(index)} // (e, index) => setTabIndex(index)
          sx={{
            alignSelf: "flex-end",
            overflow: "visible",
            [`& .${tabsClasses.scroller}`]: {
              overflow: "visible !important",
            },
            [`& .${tabsClasses.indicator}`]: {
              display: "none",
            },
          }}
        >
          {["Inbox", "Inventory", "Schedule", " Billing"].map((label, index) => (
            <TabItem
              key={index}
              disableRipple
              label={label}
              
              sx={{ zIndex: 100 - index }}
            />
          ))}
        </Tabs>
       // </ThemeProvider>
    //   </Toolbar>
    
    // </AppBar>
  );
}

export default TabsSerrated