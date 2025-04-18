// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all booked appointments
router.get('/', async (req, res) => {
  const { locationID, date } = req.query;

  try {
    const connection = await db.getConnection();
    try {
      let sql = `
        SELECT 
          a.appointmentNumber,
          a.appointmentDate,
          a.appointmentTime,
          a.status,
          a.doctorID,
          a.patientID,
          p.firstName AS patientFirstName,
          p.lastName AS patientLastName,
          e.firstName AS doctorFirstName,
          e.lastName AS doctorLastName,
          s.startTime,
          s.endTime,
          s.dayOfWeek
        FROM appointments a
        LEFT JOIN patient p ON a.patientID = p.patientID
        LEFT JOIN doctors d ON a.doctorID = d.doctorID
        LEFT JOIN employee e ON d.employeeID = e.employeeID
        LEFT JOIN doctorschedule s ON d.doctorID = s.doctorID
      `;
      let params = [];

      if (locationID) {
        sql += ' WHERE a.locationID = ?';
        params.push(locationID);
      }

      if (date) {
        sql += locationID ? ' AND' : ' WHERE';
        sql += ' a.appointmentDate = ?';
        params.push(date);
      }

      sql += ' ORDER BY a.appointmentDate, a.appointmentTime';

      console.log("Executing SQL query:", sql);
      console.log("With parameters:", params);

      const [rows] = await connection.query(sql, params);
      console.log("Query results:", rows);

      // Ensure we always return an array, even if empty
      res.json(rows || []);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    console.error("Error details:", {
      code: err.code,
      sqlState: err.sqlState,
      message: err.message
    });
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: err.message 
    });
  }
});

// Book a new appointment
router.post('/', async (req, res) => {
  const { date, time, patientId, doctorId, service1ID, locationID } = req.body;

  console.log("Received request body:", req.body);

  // Parse all IDs as integers
  const parsedPatientId = parseInt(patientId);
  const parsedDoctorId = parseInt(doctorId);
  const parsedService1ID = parseInt(service1ID);
  const parsedLocationID = parseInt(locationID);

  console.log("Parsed IDs:", {
    patientId: parsedPatientId,
    doctorId: parsedDoctorId,
    service1ID: parsedService1ID,
    locationID: parsedLocationID
  });

  if (!date || !time || !parsedPatientId || !parsedDoctorId || isNaN(parsedService1ID) || !parsedLocationID) {
    console.log("Missing fields:", {
      date: !date,
      time: !time,
      patientId: !parsedPatientId,
      doctorId: !parsedDoctorId,
      service1ID: isNaN(parsedService1ID),
      locationID: !parsedLocationID
    });
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, service1ID, or locationID' });
  }

  try {
    const connection = await db.getConnection();
    try {
      // Check for conflict for the same doctor
      const [existing] = await connection.query(
        'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ?',
        [date, time, parsedDoctorId]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Time slot already booked for this doctor' });
      }

      // Check if the time slot is within the doctor's schedule
      const [schedule] = await connection.query(
        `SELECT s.startTime, s.endTime, s.dayOfWeek 
         FROM doctorschedule s 
         WHERE s.doctorID = ?`,
        [parsedDoctorId]
      );

      if (schedule.length === 0) {
        return res.status(400).json({ error: 'Doctor schedule not found' });
      }

      // Get day of week using UTC to match frontend
      const appointmentDay = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { 
        weekday: 'long',
        timeZone: 'UTC'
      });
      const scheduleDay = schedule[0].dayOfWeek;
      
      console.log("Day comparison:", {
        appointmentDay,
        scheduleDay,
        normalizedAppointmentDay: appointmentDay.toLowerCase().trim(),
        normalizedScheduleDay: scheduleDay.toLowerCase().trim(),
        inputDate: date,
        schedule: schedule[0]
      });
      
      // Normalize both day names to ensure consistent comparison
      const normalizedAppointmentDay = appointmentDay.toLowerCase().trim();
      const normalizedScheduleDay = scheduleDay.toLowerCase().trim();
      
      if (normalizedAppointmentDay !== normalizedScheduleDay) {
        return res.status(400).json({ 
          error: 'Appointment date does not match doctor\'s schedule',
          details: {
            selectedDay: normalizedAppointmentDay,
            availableDay: normalizedScheduleDay,
            doctorId: parsedDoctorId,
            locationId: parsedLocationID
          }
        });
      }

      const appointmentTime = new Date(`2000-01-01T${time}`);
      const startTime = new Date(`2000-01-01T${schedule[0].startTime}`);
      const endTime = new Date(`2000-01-01T${schedule[0].endTime}`);

      if (appointmentTime < startTime || appointmentTime > endTime) {
        return res.status(400).json({ error: 'Appointment time is outside doctor\'s working hours' });
      }

      // Insert appointment
      const insertQuery = `
        INSERT INTO appointments (
          appointmentDate, 
          appointmentTime, 
          patientId, 
          doctorId, 
          service1ID, 
          locationID,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, 'Scheduled')
      `;
      const insertParams = [date, time, parsedPatientId, parsedDoctorId, parsedService1ID, parsedLocationID];
      
      console.log("Executing SQL query:", insertQuery);
      console.log("With parameters:", insertParams);

      await connection.query(insertQuery, insertParams);

      res.status(201).json({ message: 'Appointment booked successfully' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error in appointment booking:", err);
    res.status(500).json({ 
      error: 'Booking failed',
      details: err.message 
    });
  }
});

//update given appt
router.put('/', async (req, res) => {
  const { date, time, patientId, doctorId, service1ID, appointmentID, status, locationID } = req.body;

  // Parse all IDs as integers
  const parsedPatientId = parseInt(patientId);
  const parsedDoctorId = parseInt(doctorId);
  const parsedService1ID = parseInt(service1ID);
  const parsedLocationID = parseInt(locationID);
  const parsedAppointmentID = parseInt(appointmentID);

  if (!date || !time || !parsedPatientId || !parsedDoctorId || isNaN(parsedService1ID) || !parsedLocationID || !parsedAppointmentID) {
    console.log("Missing fields:", {
      date: !date,
      time: !time,
      patientId: !parsedPatientId,
      doctorId: !parsedDoctorId,
      service1ID: isNaN(parsedService1ID),
      locationID: !parsedLocationID,
      appointmentID: !parsedAppointmentID
    });
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, service1ID, or locationID' });
  }

  try {
    const connection = await db.getConnection();
    try {
      // Check for conflict for the same doctor
      const [existing] = await connection.query(
        'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ? AND appointmentNumber != ?',
        [date, time, parsedDoctorId, parsedAppointmentID]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Time slot already booked for this doctor' });
      }

      await connection.query(
        `UPDATE appointments SET appointmentDate = ?, appointmentTime = ?, patientId = ?, doctorId = ?, service1ID = ?, locationID = ?, status = ? 
        WHERE appointmentNumber = ?`,
        [date, time, parsedPatientId, parsedDoctorId, parsedService1ID, parsedLocationID, status, parsedAppointmentID]
      );

      res.status(201).json({ message: 'Appointment updated successfully' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment by ID
router.delete('/:appointmentID', async (req, res) => {
  const { appointmentID } = req.params;

  if (!appointmentID) {
    return res.status(400).json({ error: 'Missing appointmentID' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM appointments WHERE appointmentNumber = ?',
      [appointmentID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// Get clinic-specific appointments
router.get('/clinicAppointments/:locationID', async (req, res) => {
  const { locationID } = req.params;
  
  try {
    const connection = await db.getConnection();
    try {
      const sql = `
        SELECT 
          a.appointmentNumber,
          a.appointmentDate,
          a.appointmentTime,
          a.status,
          a.doctorID,
          a.patientID,
          p.firstName AS patientFirstName,
          p.lastName AS patientLastName,
          e.firstName AS doctorFirstName,
          e.lastName AS doctorLastName
        FROM appointments a
        JOIN patient p ON a.patientID = p.patientID
        JOIN doctors d ON a.doctorID = d.doctorID
        JOIN employee e ON d.employeeID = e.employeeID
        WHERE a.locationID = ?
        ORDER BY a.appointmentDate, a.appointmentTime
      `;
      
      const [rows] = await connection.query(sql, [locationID]);
      res.json(rows || []);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching clinic appointments:", err);
    res.status(500).json({ 
      error: 'Failed to fetch clinic appointments',
      details: err.message 
    });
  }
});

module.exports = router;
