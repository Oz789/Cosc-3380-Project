import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const tabLabels = ["Dashboard", "Inbox", "Schedule", "Patient Info"]; // "Dashboard", "Inbox", "Services", "Frames", "Eye Contacts", "Staff", "Reports"

const EmpTabs = ({ activeTab, setActiveTab }) => {
  const handleChange = (e, newVal) => setActiveTab(newVal);

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={activeTab} onChange={handleChange}>
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default EmpTabs;
