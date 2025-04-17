import React, { useState } from "react";
import AdminFrames from "./frames/adminFrames";
import AdminFramesTab from "./frames/adminFramesTab";
import ManageStaffTab from "./employee/manageStaffTab";
import AdminContactsTab from "./contacts/adminContactsTab";
import AdminServicesTab from "./services/adminServicesTab";
import MsgManager from "../../components/msgManager";
import AdminReportsPage from "./reports/adminReportsPage";
import EmployeeDetails from "../employeePortal/employeeDetails";

const AdminTabContent = ({ activeTab }) => {

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
      return <MsgManager
        bool={toggleMessager}
        pass={msgPasser}/>
    case 2:
      return <AdminFramesTab/>;
    case 3:
      return <AdminContactsTab/>
    case 4:
      return <ManageStaffTab/>
    case 5:
      return <AdminReportsPage/>
    case 6:
      
      return (
       /* <div
        style={{
          backgroundImage: `url('/images/white.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '2rem'
        }}
      >
      </div>*/
      <AdminReportsPage />
      );
    
    default:
      return null;
  }
};

export default AdminTabContent;

