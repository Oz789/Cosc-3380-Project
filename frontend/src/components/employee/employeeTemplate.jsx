import React, { useState } from "react";
import "./employeeTemplate.css";
import UsernavBar from "../navBar";
import  TabsSerrated  from "../../components/tabs";
import {Grid2} from '@mui/material';

const EmployeeTemplate = ({ sidebarContent, mainContent, handleTab}) => {
  return (
    <>
      <UsernavBar />
      <div className="profile-container">
        <div className="profile-wrapper">

          <div className="profile-sidebar">
            {sidebarContent ? sidebarContent : <p style={{ color: "#aaa", fontStyle: "italic" }}></p>}
          </div>

          <Grid2 container className="testo">
            
              <TabsSerrated
              handleA={handleTab}
              />
            

            
              <div className="profile-content">
                {mainContent ? mainContent : <p style={{ color: "#aaa", fontStyle: "italic" }}>Penis</p>}
              </div>
            
          </Grid2>



        </div>
      </div>
    </>
  );
};

export default EmployeeTemplate;