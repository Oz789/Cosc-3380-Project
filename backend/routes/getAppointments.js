// routes/getDoctorAppointments.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/doctors/:doctorID/appointments
router.get('/doctors/:doctorID/appointments', async (req, res) => {
  const { doctorID } = req.params;

  try {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT 
          a.appointmentNumber,
          a.patientID,
          a.appointmentDate,
          a.appointmentTime,
          a.status,
          p.firstName AS patientFirstName,
          p.lastName AS patientLastName,
          d.doctorID,
          e.firstName AS doctorFirstName,
          e.lastName AS doctorLastName
        FROM appointments a
        JOIN patient p ON a.patientID = p.patientID
        JOIN doctors d ON a.doctorID = d.doctorID
        JOIN employee e ON d.employeeID = e.employeeID
        WHERE a.doctorID = ?
        ORDER BY a.appointmentDate, a.appointmentTime`,
        [doctorID]
      );

      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('❌ Error fetching doctor appointments:', err);
    res.status(500).json({ 
      error: 'Failed to fetch doctor appointments',
      details: err.message
    });
  }
});

module.exports = router;
