const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/appointments/all', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        a.appointmentNumber,
        a.appointmentDate,
        a.appointmentTime,
        a.status,
        a.doctorID,
        a.patientID,
        p.firstName AS patientFirstName,
        p.lastName AS patientLastName
      FROM appointments a
      JOIN patient p ON a.patientID = p.patientID
      JOIN doctors d ON a.doctorID = d.doctorID
      ORDER BY a.appointmentDate, a.appointmentTime`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching all appointments:", err);
    res.status(500).json({ error: "Server error while fetching appointments." });
  }
});

module.exports = router;

