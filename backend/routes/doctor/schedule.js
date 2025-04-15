const express = require('express');
const router = express.Router();
const db = require('../../db'); // Adjust path if needed


router.get('/location/:locationID', (req, res) => {
  const { locationID } = req.params;

  const sql = `
    SELECT 
      s.scheduleID, s.doctorID, e.firstName, e.lastName,
      s.dayOfWeek, s.startTime, s.endTime
    FROM doctorschedule s
    JOIN Doctors d ON s.doctorID = d.doctorID
    JOIN Employee e ON d.employeeID = e.employeeID
    WHERE s.locationID = ?
  `;

  db.query(sql, [locationID], (err, results) => {
    if (err) {
      console.error(' Failed to fetch schedule:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(results);
  });
});

module.exports = router;
