import React from "react";
import { Grid, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ReportColumn = ({ label, borderRight, to }) => (
  <Box
    sx={{
      height: "calc(90vh - 40px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRight: borderRight ? "2px solid black" : "none",
    }}
  >
    <Button
      component={Link}
      to={to}
      variant="contained"
      sx={{
        fontSize: "1.2rem",
        fontFamily: "BellMT",
        padding: "12px 24px",
        fontWeight: "bold",
        textTransform: "italic",
        backgroundColor: "white",
        color: "black",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      {label}
    </Button>
  </Box>
);

const AdminReports = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        <ReportColumn label="Staff" borderRight to="/staff-report" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ReportColumn label="Patient Demographics" borderRight to="/patientDemographicsReport" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ReportColumn label="Patient Prescriptions" borderRight to="/patientPrescriptionReport" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ReportColumn label="Inventory" to="/inventory-report" />
      </Grid>
    </Grid>
  );
};

export default AdminReports;

