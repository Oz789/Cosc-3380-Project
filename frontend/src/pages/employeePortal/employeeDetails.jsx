import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid
} from "@mui/material";
import axios from "axios";
import "./employeeDetails.css"

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/employees`);
        const userData = res.data.find((emp) => emp.employeeID == userID);
        setEmployee(userData);
        setUpdatedData(userData);
      } catch (err) {
        console.error("Failed to fetch employee", err);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    setUpdatedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/api/employees/${employee.employeeID}`, updatedData);
      setEmployee(updatedData);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
<Paper className="employee-details-container">
  <Typography variant="h5" gutterBottom className="employee-details-title">
    Employee Details
  </Typography>

  <Grid container spacing={2}>
    {["firstName", "lastName", "email", "phone", "role", "gender", "address"].map((field) => (
      <Grid item xs={12} sm={6} key={field}>
        <TextField
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          name={field}
          fullWidth
          value={updatedData[field] || ""}
          onChange={handleChange}
          disabled={!editMode}
          className="employee-text-field"
        />
      </Grid>
    ))}
        <Grid item xs={12}>
          {editMode ? (
            <Button variant="contained" color="success" onClick={handleUpdate}>
              Save Changes
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmployeeDetails;