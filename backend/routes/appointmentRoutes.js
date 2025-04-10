// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all booked appointments
router.get('/', async (req, res) => {
  const [rows] = await db.promise().query('SELECT appointmentDate, appointmentTime FROM appointments');
  res.json(rows);
});

// Book a new appointment
router.post('/', async (req, res) => {
  const { date, time, patientId, doctorId, service1ID } = req.body;

  if (!date || !time || !patientId || !doctorId || !service1ID) {
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, or service1ID' });
  }

  try {
    // ✅ Check for conflict for the same doctor
    const [existing] = await db.promise().query(
      'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ?',
      [date, time, doctorId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Time slot already booked for this doctor' });
    }

    // ✅ Insert appointment
    await db.promise().query(
      'INSERT INTO appointments (appointmentDate, appointmentTime, patientId, doctorId, service1ID) VALUES (?, ?, ?, ?, ?)',
      [date, time, patientId, doctorId, service1ID]
    );

    res.status(201).json({ message: 'Appointment booked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

module.exports = router;
