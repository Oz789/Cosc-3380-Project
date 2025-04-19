const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get appointments for a specific doctor
router.get('/:doctorId/appointments', async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  console.log("Received request for doctor appointments:", {
    doctorId,
    date
  });

  try {
    const connection = await db.getConnection();
    try {
      // First, verify the doctor exists
      const [doctor] = await connection.query(
        'SELECT * FROM doctors WHERE doctorID = ?',
        [doctorId]
      );
      console.log("Doctor found:", doctor);

      if (!doctor || doctor.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      // Get raw appointments first to verify data
      const [rawAppointments] = await connection.query(
        'SELECT * FROM appointments WHERE doctorID = ?',
        [doctorId]
      );
      console.log("Raw appointments data:", rawAppointments);

      if (!rawAppointments || rawAppointments.length === 0) {
        return res.json([]);
      }

      // Now get the detailed appointment data
      let sql = `
        SELECT 
          a.appointmentNumber,
          a.appointmentDate,
          a.appointmentTime,
          a.status,
          a.patientID,
          COALESCE(p.firstName, 'Unknown') AS patientFirstName,
          COALESCE(p.lastName, 'Unknown') AS patientLastName,
          COALESCE(s.serviceName, 'Unknown Service') AS serviceName,
          COALESCE(l.name, 'Unknown Location') AS locationName,
          d.doctorID,
          e.firstName AS doctorFirstName,
          e.lastName AS doctorLastName
        FROM appointments a
        LEFT JOIN patient p ON a.patientID = p.patientID
        LEFT JOIN services s ON a.service1ID = s.serviceID
        LEFT JOIN location l ON a.locationID = l.locationID
        LEFT JOIN doctors d ON a.doctorID = d.doctorID
        LEFT JOIN employee e ON d.employeeID = e.employeeID
        WHERE a.doctorID = ?
      `;
      let params = [doctorId];

      if (date) {
        sql += ' AND a.appointmentDate = ?';
        params.push(date);
      }

      sql += ' ORDER BY a.appointmentDate, a.appointmentTime';

      console.log("Executing SQL query:", sql);
      console.log("With parameters:", params);

      const [appointments] = await connection.query(sql, params);
      console.log("Found appointments:", appointments);

      // Verify each appointment has the required data
      const validAppointments = appointments.map(appointment => ({
        ...appointment,
        patientID: appointment.patientID || 'Unknown',
        patientFirstName: appointment.patientFirstName || 'Unknown',
        patientLastName: appointment.patientLastName || 'Unknown',
        serviceName: appointment.serviceName || 'Unknown Service',
        locationName: appointment.locationName || 'Unknown Location'
      }));

      res.json(validAppointments);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    console.error("Error code:", err.code);
    console.error("Error state:", err.sqlState);
    console.error("Error message:", err.message);
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: err.message,
      code: err.code,
      state: err.sqlState
    });
  }
});

module.exports = router; 