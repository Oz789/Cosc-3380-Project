import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const EmpHeader = ({ name, role, avatar }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#e3f2fd", 
        borderBottom: "1px solid #ccc"
      }}
    >
      <Avatar src={avatar} sx={{ width: 64, height: 64, mr: 2 }} />
      <Box>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle2" color="text.secondary">{role}</Typography>
      </Box>
    </Box>
  );
};

export default EmpHeader;
