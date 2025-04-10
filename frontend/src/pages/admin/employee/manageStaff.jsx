import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './manageStaff.css';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AdminStaff = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
      .then((res) => setEmployees(res.data));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/employees/${id}`).then(() => {
      setEmployees((prev) => prev.filter(emp => emp.employeeID !== id));
    });
  };

const [roleFilter, setRoleFilter] = useState('');
const filteredEmployees = roleFilter
  ? employees.filter(emp => emp.role.toLowerCase() === roleFilter.toLowerCase())
  : employees;


  return (
    <div className="staff-container">
      <h2 style={{ fontFamily: 'Serif', fontWeight: 'bold', fontSize:'32px'}}>Manage Staff</h2>

      <div className="filter-row">
  <Grid container spacing={2} marginBottom={3}>
  <Grid item xs={12} sm={3}>
    <FormControl fullWidth>
      <InputLabel>Role</InputLabel>
      <Select
        value={roleFilter}
        label="Filter by Role"
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Employee">Employee</MenuItem>
        <MenuItem value="Doctor">Doctor</MenuItem>
      </Select>
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={3}>
    <FormControl fullWidth disabled>
      <InputLabel>Filter by Location</InputLabel>
      <Select value="">
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Smith">Smith</MenuItem>
        <MenuItem value="Ramil">Ramil</MenuItem>
      </Select>
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={3}>
    <TextField
      fullWidth
      label="Search"
      placeholder="Search staff..."
      disabled
    />
  </Grid>
</Grid>

</div>


      <table className="styled-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Manage</th>
          
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.employeeID}>
              <td>{emp.employeeID}</td>
              <td>{emp.firstName}</td>
              <td>{emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td>
                <button onClick={() => {/* TODO: open edit modal */}}>Edit</button>
                <button onClick={() => handleDelete(emp.employeeID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStaff;


