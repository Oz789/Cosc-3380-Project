const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) throw new Error("JWT_SECRET not defined!");

router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    DOB,
    sex,
    occupation,
    address,
    phoneNumber,
    email,
    password,
  } = req.body;

  try {
    // Check if email or phone already exists
    const [existing] = await db.promise().query(
      'SELECT * FROM patient WHERE email = ? OR phoneNumber = ?',
      [email, phoneNumber]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or phone already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new patient
    const [result] = await db.promise().query(
      `INSERT INTO patient 
        (firstName, lastName, DOB, sex, occupation, address, phoneNumber, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        DOB,
        sex,
        occupation,
        address,
        phoneNumber,
        email,
        hashedPassword,
      ]
    );

    const patientID = result.insertId;

    // Generate JWT
    const token = jwt.sign({ id: patientID, role: 'patient' }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      role: 'patient',
      user: {
        patientID,
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register patient' });
  }
});

module.exports = router;

