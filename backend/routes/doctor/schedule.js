const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/location/:locationID', async (req, res) => {
  const { locationID } = req.params;

  try {
    const connection = await db.getConnection();
    try {
      const [results] = await connection.query(`
        SELECT 
          s.scheduleID, 
          s.doctorID, 
          e.firstName, 
          e.lastName,
          s.dayOfWeek, 
          s.startTime, 
          s.endTime
        FROM doctorschedule s
        JOIN Doctors d ON s.doctorID = d.doctorID
        JOIN Employee e ON d.employeeID = e.employeeID
        WHERE s.locationID = ?
      `, [locationID]);

      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'No schedule found for this location' });
      }

      res.json(results);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

module.exports = router;
