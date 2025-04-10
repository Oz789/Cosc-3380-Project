const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcrypt');



router.post('/add-employee', (req, res) => {
  const { isAdmin, firstName, lastName, role, phone, email, password, gender, address } = req.body;

  if (!firstName || !lastName || !role || !phone || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Server error while securing password.' });
    }

  const sql = `INSERT INTO Employee (isAdmin, firstName, lastName, role, phone, email, password, gender, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `;

    db.query(sql, [isAdmin || 0, firstName, lastName, role, phone, email, hashedPassword, gender, address],
      (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ message: 'Employee added successfully', employeeID: result.insertId });
  });
});
});


module.exports = router;