const express = require('express');
const router = express.Router();
const db = require('../../db');
router.get("/clinicAppointments/:locationID", async (req, res) => {
    const { locationID } = req.params;
    const doctorID = req.query.doctorID;
  
    let sql = `
      SELECT a.*, 
             p.firstName AS patientFirstName, p.lastName AS patientLastName,
             e.firstName AS doctorFirstName, e.lastName AS doctorLastName
      FROM appointments a
      JOIN patient p ON a.patientID = p.patientID
      JOIN doctors d ON a.doctorID = d.doctorID
      JOIN employee e ON d.employeeID = e.employeeID
    `;
  
    const params = [];
  
    if (doctorID) {
      sql += `WHERE a.doctorID = ?`;
      params.push(doctorID);
    } else {
      sql += `WHERE a.locationID = ?`;
      params.push(locationID);
    }
  
    try {
      const [rows] = await db.promise().query(sql, params);
      res.json(rows);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  module.exports = router;
  