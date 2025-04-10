import React, { useState } from "react";
import EmployeeTemplate from "../../components/employee/employeeTemplate";
import MsgManager from "../../components/msgManager";
import ReplyManager from "../../components/replyManager";
import {Grid2} from '@mui/material';

import InvManager from "../../components/employee/invManager";



import "./employeeProfile.css"



const EmployeeProfile = () => {

      const [patientData, setPatientData] = useState({
        name: "",
        email: "",
        dob: "",
        sex: "",
        address: "",
        phone: "",
        lastExamDate: "",
        usesCorrectiveLenses: "",
        usesContacts: "",
        lensesPrescription: "",
        contactsPrescription: "",
        lastPrescriptionDate: "",
        healthConcerns: "",
        otherConcerns: "",
        conditions: "",
        otherConditions: "",
        hadSurgery: "",
        surgeries: "",
        otherSurgeries: "",
        allergies: "",
        additionalDetails: "",
      });
    
      const [isEditing, setIsEditing] = useState(false);
    
      const [messager, setMessager] = useState(false);

      const [tabIn, setTab] = React.useState(0);

      

      const toggleMessager = () => {
        setMessager(!messager)
        console.log(messager)
      }

      const handleChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
      };

      const handleTab = ( newTab) => {
        setTab(newTab)
        console.log(newTab)
      }

      const [ message, setMessage] = useState("null");
      const msgPasser = (m) => {
        setMessage(m);
      }
      

    return(

      // {messager && (

      <div>

        
        {!messager && ( <EmployeeTemplate
      /* Left Sidebar (Patient Information) */
      
      sidebarContent={
        <div className="cont">
          <img className="rounded pfp" src="/Images/dog-secretary.webp" alt="A pic of John Doe, a white dog" width="300"></img>
          <h2 className="section-title">John Doe</h2>
          <h5 className="job"> Employee: Secretary</h5>
          <h5 ><b>About Me:</b></h5>
          <p className="bio">...Arf!</p>

        </div>
      }

      /* Center Section (Medical Form Data) */
      mainContent={
        <div>

          <>
            {tabIn === 0 && (
              <>
                {/* <h2 className="section-title">Inbox</h2> */}
                <MsgManager
                  bool={toggleMessager}
                  pass={msgPasser}
                />
              </>
            )}
            
            {tabIn === 1 && (
              
              <InvManager
            //bool={toggleMessager}
            //pass={msgPasser}
              />
              
              
            )}

            {tabIn === 2 && (
              
              <InvManager
            //bool={toggleMessager}
            //pass={msgPasser}
              />
              
              
            )}

            {tabIn === 3 && (
              
              <InvManager
            //bool={toggleMessager}
            //pass={msgPasser}
              />
              
              
            )}
          </>
        
        </div>
      }

      handleTab={handleTab}


    />

  )}

  {messager && (

    <ReplyManager
    mes = {message}
    />

    
  )}
    </div>
    

    );

};

export default EmployeeProfile;