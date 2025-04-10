import React, { useState } from "react";
import AdminHeader from "../admin/adminHeader";
import AdminTabs from "../admin/adminTabs";
import AdminTabContent from "../admin/adminTabContent";

import EmpHeader from "./empHeader";
import EmpTabs from "./empTabs";
import EmpTabContent from "./empTabContent";

const EmployeeProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const user = {
    name: "John Doe",
    role: "Employee",
    avatar: "/Images/dog-secretary.webp",
  };

  return (
    <div>
      <EmpHeader name={user.name} role={user.role} avatar={user.avatar} />
      <EmpTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <EmpTabContent activeTab={activeTab} />
    </div>
  );
};

export default EmployeeProfilePage;
