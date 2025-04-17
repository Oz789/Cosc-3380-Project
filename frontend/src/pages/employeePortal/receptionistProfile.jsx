import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReceptionistHeader from "./receptionistHeader";
import ReceptionistTabs from "./receptionistTabs";
import ReceptionistTabContent from "./receptionistTabContent";

const EmployeeProfilePage = () => {
  const { employeeID } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/employees/${employeeID}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Error fetching employee:", err));
  }, [employeeID]);

  useEffect(() => {
    if (employeeID) {
      fetch(`http://localhost:5001/api/stock-alerts?employeeID=${employeeID}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error("Error fetching stock alerts:", err));
    }
  }, [employeeID]);

  if (!employee) return <p>Loading employee profile...</p>;

  const user = {
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.title || "Receptionist",
    avatar: "/Images/dog-secretary.webp",
  };

  return (
    <div>
      <ReceptionistHeader
        name={user.name}
        role={user.role}
        avatar={user.avatar}
        notifications={notifications}
      />
      <ReceptionistTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReceptionistTabContent activeTab={activeTab} employee={employee} />
    </div>
  );
};

export default EmployeeProfilePage;
