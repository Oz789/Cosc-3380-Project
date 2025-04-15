import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminHeader from "./adminHeader";
import AdminTabs from "./adminTabs";
import AdminTabContent from "./adminTabContent";

const AdminProfilePage = () => {
  const { employeeID } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/employees/${employeeID}`)
      .then((res) => res.json())
      .then((data) => setAdmin(data))
      .catch((err) => console.error("Error fetching admin data:", err));
  }, [employeeID]);

  if (!admin) return <p>Loading admin profile...</p>;

  const user = {
    name: `${admin.firstName} ${admin.lastName}`,
    role: admin.title || "Administrator",
    avatar: "/Images/dog-secretary.webp",
  };

  return (
    <div>
      <AdminHeader name={user.name} role={user.role} avatar={user.avatar} />
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminTabContent activeTab={activeTab} admin={admin} />
    </div>
  );
};

export default AdminProfilePage;

