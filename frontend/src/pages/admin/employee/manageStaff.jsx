import React, { useEffect, useState } from 'react';
import axios from 'axios';


import './manageStaff.css';

const AdminStaff = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
.then((res) => setEmployees(res.data));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/employees/${id}`).then(() => {
      setEmployees((prev) => prev.filter(emp => emp.Employee_Id !== id));
    });
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.employeeID}>
            <td>{emp.employeeID}</td>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td>{emp.email}</td>
            <td>{emp.phone}</td>
            <td>{emp.role}</td>
            <td>
              <button onClick={() => {/* open edit modal */}}>Edit</button>
              <button onClick={() => handleDelete(emp.employeeID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
        }; 
  

export default AdminStaff;
