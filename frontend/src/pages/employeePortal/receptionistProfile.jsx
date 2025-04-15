import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReceptionistHeader from "./receptionistHeader";
import ReceptionistTabs from "./receptionistTabs";
import ReceptionistTabContent from "./receptionistTabContent";

const EmployeeProfilePage = () => {
  const { employeeID } = useParams(); // dynamically from route
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/employees/${employeeID}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Error fetching employee:", err));
  }, [employeeID]);

  if (!employee) return <p>Loading employee profile...</p>;

  const user = {
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.title || "Receptionist",
    avatar: "/Images/dog-secretary.webp", // replace with dynamic picture
  };

  return (
    <div>
      <ReceptionistHeader name={user.name} role={user.role} avatar={user.avatar} />
      <ReceptionistTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReceptionistTabContent activeTab={activeTab} employee={employee} />
    </div>
  );
};

export default EmployeeProfilePage;

