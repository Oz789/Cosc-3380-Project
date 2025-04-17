import React from "react";
import { Avatar, Box, Typography, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

const ReceptionistHeader = ({ name, role, avatar, notifications }) => {
  const alertCount = notifications?.length || 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        backgroundColor: "#e3f2fd",
        borderBottom: "1px solid #ccc"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar src={avatar} sx={{ width: 64, height: 64, mr: 2 }} />
        <Box>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle2" color="text.secondary">{role}</Typography>
        </Box>
      </Box>

      <IconButton component={Link} to="/stock-monitor" sx={{ ml: 2 }}>
        <Badge badgeContent={alertCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default ReceptionistHeader;
