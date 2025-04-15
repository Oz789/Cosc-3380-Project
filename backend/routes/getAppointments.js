// routes/getDoctorAppointments.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/doctors/:doctorID/appointments
router.get('/doctors/:doctorID/appointments', async (req, res) => {
  const { doctorID } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
        a.appointmentNumber,
        a.patientID,
        a.appointmentDate,
        a.appointmentTime,
        a.status,
        p.firstName,
        p.lastName
      FROM appointments a
      JOIN patient p ON a.patientID = p.patientID
      WHERE a.doctorID = ?
      ORDER BY a.appointmentDate, a.appointmentTime`,
      [doctorID]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching doctor appointments:', err);
    res.status(500).json({ error: 'Failed to fetch doctor appointments' });
  }
});

module.exports = router;
