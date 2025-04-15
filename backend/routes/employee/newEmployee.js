const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcrypt');



router.post('/add-employee', (req, res) => {
  const { isAdmin, firstName, lastName, role, phone, email, password, gender, address, locationID, licenseNumber} = req.body;

  if (!firstName || !lastName || !role || !phone || !email || !password || !locationID) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Server error while securing password.' });
    }

  const sql = `INSERT INTO Employee (isAdmin, firstName, lastName, role, phone, email, password, gender, address, locationID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;

    db.query(sql, [isAdmin || 0, firstName, lastName, role, phone, email, hashedPassword, gender, address, locationID ],
      (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  

  const employeeID = result.insertId;

if (role === "Doctor") {
  const doctorSQL = `INSERT INTO Doctors (employeeID, licenseNumber) VALUES (?, ?)`;
  db.query(doctorSQL, [employeeID, licenseNumber, "general"], (err2, result2) => {
    if (err2) {
      console.error("Doctor insert failed:", err2);
      return res.status(500).json({ error: "Failed to add doctor" });
    }
    return res.status(201).json({ message: "Doctor added successfully", employeeID });
  });
} else {
  return res.status(201).json({ message: "Employee added successfully", employeeID });
}
      });
});
});


module.exports = router;