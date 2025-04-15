import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper
} from "@mui/material";
import axios from "axios";

const roles = ["Receptionist", "Nurse", "Doctor", "Administrator"]

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    isAdmin: false,
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    licenseNumber: "",
    locationID: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isAdmin: e.target.checked ? 1 : 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/employees/add-employee", formData);
      setStatus(res.data.message);
      setFormData({
        isAdmin: false,
        firstName: "",
        lastName: "",
        role: "",
        phone: "",
        email: "",
        password: "",
        address: "",
        gender: "",
        licenseNumber: ""
      });
    } catch (err) {
      setStatus(err.response?.data?.error || "Submission failed.");
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 4, maxWidth: 600, margin: "2rem auto", borderRadius: "16px" }}>
      <Typography variant="h5" gutterBottom sx={{ fontFamily: "Bell MT", fontWeight: "bold", color: "#00796B" }}>
        Add New Employee
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={6} >
            <TextField name="firstName" label="First Name" fullWidth value={formData.firstName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6}>
            <TextField name="lastName" label="Last Name" fullWidth value={formData.lastName} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField select name="gender" label="Gender" fullWidth value={formData.gender} onChange={handleChange} required>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
  <TextField
    select
    name="locationID"
    label="Location"
    fullWidth
    value={formData.locationID}
    onChange={handleChange}
    required
  >
    <MenuItem value="1">Eye Clinic 1</MenuItem>
    <MenuItem value="2">Eye Clinic 2</MenuItem>
    <MenuItem value="3">Eye Clinic 3</MenuItem>
  </TextField>
</Grid>

          <Grid item xs={12}>
            <TextField select name="role" label="Role" fullWidth value={formData.role} onChange={handleChange} required>
              {roles.map((role, index) => (
                <MenuItem key={index} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {formData.role === "Doctor" && (
            <Grid item xs={12}>
              <TextField name="licenseNumber" label="Medical License #" fullWidth value={formData.licenseNumber} onChange={handleChange} required />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField name="address" label="Home Address" fullWidth value={formData.address} onChange={handleChange} required />
          </Grid>

          <Grid item xs={6}>
            <TextField name="phone" label="Phone" fullWidth value={formData.phone} onChange={handleChange} required />
          </Grid>
          <Grid item xs={6}>
            <TextField name="email" label="Email" fullWidth value={formData.email} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.isAdmin === 1} onChange={handleCheckboxChange} />}
              label="Make Administrator"
            />
          </Grid>


          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#00796B", fontWeight: "bold" }}>
              Submit
            </Button>
          </Grid>
        </Grid>

        {status && (
          <Typography sx={{ marginTop: 2, color: status.includes("success") ? "green" : "red" }}>
            {status}
          </Typography>
        )}
      </form>
    </Paper>
  );
        };

export default EmployeeForm;