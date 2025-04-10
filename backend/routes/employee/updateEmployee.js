const express = require('express');
const router = express.Router();
const db = require('../../db');

// PUT /api/employees/:id
router.put('/:id', (req, res) => {
  const employeeID = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    gender,
    address
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !role || !gender || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `
    UPDATE Employee 
    SET firstName = ?, lastName = ?, email = ?, phone = ?, role = ?, gender = ?, address = ?
    WHERE employeeID = ?
  `;

  db.query(
    sql,
    [firstName, lastName, email, phone, role, gender, address, employeeID],
    (err, result) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.json({ message: "Employee updated successfully" });
    }
  );
});

module.exports = router;