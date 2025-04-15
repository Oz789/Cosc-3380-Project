import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReceptionistHeader from "./receptionistHeader";
import NurseTabs from "./nurseTabs";
import NurseTabContent from "./nurseTabContent";


 
const NurseProfilePage = () => {
  const employeeID = localStorage.getItem("userID");
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    console.log("🧪 Nurse employeeID from route:", employeeID);
    if (employeeID) {
      fetch(`http://localhost:5001/api/employees/${employeeID}`)
        .then((res) => res.json())
        .then((data) => setEmployee(data))
        .catch((err) => console.error("Error fetching employee:", err));
    }
  }, [employeeID]);

  if (!employee) return <p>Loading employee profile...</p>;

  const user = {
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.role || "Nurse",
    avatar: "/Images/dog-secretary.webp", // replace with dynamic picture
  };

  return (
    <div>
      <ReceptionistHeader name={user.name} role={user.role} avatar={user.avatar} />
      <NurseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <NurseTabContent activeTab={activeTab} employee={employee} />
    </div>
  );
};

export default NurseProfilePage;
