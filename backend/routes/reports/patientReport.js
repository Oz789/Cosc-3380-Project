const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get patient demographics report
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      // First, let's log the table structure
      const [patientColumns] = await connection.query(`
        DESCRIBE patient
      `);
      console.log("Patient table columns:", patientColumns);

      const [patients] = await connection.query(`
        SELECT 
          p.patientID,
          p.firstName,
          p.lastName,
          p.DOB,
          p.sex,
          p.email,
          p.phoneNumber,
          p.address,
          p.occupation,
          pf.insuranceID,
          i.insuranceProvider,
          i.policyNumber,
          COUNT(a.appointmentNumber) AS totalAppointments,
          MAX(a.appointmentDate) AS lastAppointmentDate
        FROM patient p
        LEFT JOIN patientform pf ON p.patientID = pf.patientID
        LEFT JOIN insurance i ON pf.insuranceID = i.insuranceID
        LEFT JOIN appointments a ON p.patientID = a.patientID
        GROUP BY p.patientID, pf.insuranceID, i.insuranceProvider, i.policyNumber
        ORDER BY p.lastName, p.firstName
      `);

      console.log("Query results:", patients);
      res.json(patients || []);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching patient report:", err);
    console.error("SQL Error:", err.sqlMessage);
    console.error("Error Code:", err.code);
    console.error("SQL State:", err.sqlState);
    res.status(500).json({ 
      error: 'Failed to fetch patient report',
      details: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

module.exports = router; 