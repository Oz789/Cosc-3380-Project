import React, { useState } from "react";
//import AdminFrames from "./frames/adminFrames";
import AdminFramesTab from "../admin/frames/adminFramesTab";
import ManageStaffTab from "../admin/employee/manageStaffTab";
import AdminContactsTab from "../admin/contacts/adminContactsTab";
import AdminServicesTab from "../admin/services/adminServicesTab";
import MsgManager from "../../components/msgManager";
import EmployeeDetails from "./employeeDetails";
//import ReceptionistAppointments from "./receptionistAppointments";
import ClinicAppointments from "./clinicAppointments";
import CheckedInAppointments from "./checkedIn";
import TestManager from "../../components/testmanager";
import ReceptionistAppointments from "./receptionistAppointments";

const EmpTabContent = ({ activeTab }) => {

  const toggleMessager = () => {
    setMessager(!messager)
    console.log(messager)

  }
  const [messager, setMessager] = useState(false);
  const [ message, setMessage] = useState("null");
  const msgPasser = (m) => {
    setMessage(m);
  }
  switch (activeTab) {
  
    case 0:
      return <EmployeeDetails/>
      case 1:
        return <ReceptionistAppointments/>
    case 2:
      return <CheckedInAppointments/>
    case 3:
      return <TestManager/>
      case 4:
      return <MsgManager
      bool={toggleMessager}
      pass={msgPasser}/>
    default:
      return null;
  }
};

export default EmpTabContent;